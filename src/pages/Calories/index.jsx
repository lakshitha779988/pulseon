import { useState, useEffect } from "react";
import {
  LuFlame,
  LuPlus,
  LuTrash2,
  LuTarget,
  LuUtensils,
  LuCroissant,
  LuDrumstick,
  LuSalad,
} from "react-icons/lu";
import { saveCalorieEntry, getCalorieEntries, deleteCalorieEntry } from "../../services/db";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import { SkeletonBlock } from "../../components/Skeleton";
import "./calories.css";

const mealTypes = [
  { id: "breakfast", label: "Breakfast", icon: LuCroissant },
  { id: "lunch", label: "Lunch", icon: LuSalad },
  { id: "dinner", label: "Dinner", icon: LuDrumstick },
  { id: "snack", label: "Snack", icon: LuUtensils },
];

const Calories = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [goal, setGoal] = useState(2200);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", calories: "", meal: "breakfast" });

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    setLoading(true);
    try {
      const data = await getCalorieEntries();
      setEntries(data);
    } catch (err) {
      console.error("Failed to load calorie entries", err);
    } finally {
      setLoading(false);
    }
  };

  const todayEntries = entries.filter((e) => (e.createdAt || "").startsWith(today));
  const totalToday = todayEntries.reduce((sum, e) => sum + Number(e.calories || 0), 0);
  const remaining = Math.max(goal - totalToday, 0);
  const percentage = Math.min((totalToday / goal) * 100, 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.calories) return;

    try {
      await saveCalorieEntry({
        name: form.name.trim(),
        calories: Number(form.calories),
        meal: form.meal,
        date: today,
      });
      setForm({ name: "", calories: "", meal: "breakfast" });
      setShowForm(false);
      loadEntries();
    } catch (err) {
      console.error("Failed to save calorie entry", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCalorieEntry(id);
      loadEntries();
    } catch (err) {
      console.error("Failed to delete entry", err);
    }
  };

  const groupedByMeal = mealTypes.map((meal) => ({
    ...meal,
    entries: todayEntries.filter((e) => e.meal === meal.id),
  }));

  if (loading) {
    return (
      <div className="calories-page">
        <PageHeader icon={LuFlame} eyebrow="Nutrition" title="Calories" />
        <SkeletonBlock height="160px" radius="20px" style={{ marginBottom: 16 }} />
        <SkeletonBlock height="80px" radius="16px" />
      </div>
    );
  }

  return (
    <div className="calories-page">
      <PageHeader
        icon={LuFlame}
        eyebrow="Nutrition"
        title="Calorie tracker"
        subtitle="Log meals throughout the day and keep an eye on your daily energy budget."
        action={
          !showForm && (
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              <LuPlus size={16} /> Log Food
            </button>
          )
        }
      />

      <div className="card calorie-summary-card">
        <div className="calorie-ring-wrap">
          <svg className="calorie-ring" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="68" fill="none" stroke="var(--surface-2)" strokeWidth="11" />
            <circle
              cx="80"
              cy="80"
              r="68"
              fill="none"
              stroke="var(--energy)"
              strokeWidth="11"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 68}
              strokeDashoffset={2 * Math.PI * 68 * (1 - percentage / 100)}
              transform="rotate(-90 80 80)"
              style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />
          </svg>
          <div className="calorie-ring-content">
            <span className="calorie-value">{totalToday}</span>
            <span className="calorie-unit">kcal today</span>
          </div>
        </div>

        <div className="calorie-stats-list">
          <div className="calorie-stat-row">
            <span className="calorie-stat-icon tone-energy">
              <LuTarget size={16} />
            </span>
            <div>
              <span className="calorie-stat-value">{goal} kcal</span>
              <span className="calorie-stat-label">Daily goal</span>
            </div>
          </div>
          <div className="calorie-stat-row">
            <span className="calorie-stat-icon tone-accent">
              <LuFlame size={16} />
            </span>
            <div>
              <span className="calorie-stat-value">{remaining} kcal</span>
              <span className="calorie-stat-label">Remaining</span>
            </div>
          </div>
          <div className="goal-presets calorie-goal-presets">
            {[1800, 2200, 2600, 3000].map((g) => (
              <button key={g} className={goal === g ? "is-active" : ""} onClick={() => setGoal(g)}>
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card calorie-form">
          <div className="calorie-form-row">
            <input
              type="text"
              placeholder="Food name, e.g. Grilled chicken bowl"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              autoFocus
            />
            <input
              type="number"
              placeholder="kcal"
              min="0"
              value={form.calories}
              onChange={(e) => setForm({ ...form, calories: e.target.value })}
              className="calorie-input-narrow"
            />
          </div>
          <div className="meal-type-select">
            {mealTypes.map(({ id, label, icon: Icon }) => (
              <button
                type="button"
                key={id}
                className={form.meal === id ? "is-active" : ""}
                onClick={() => setForm({ ...form, meal: id })}
              >
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setShowForm(false);
                setForm({ name: "", calories: "", meal: "breakfast" });
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Entry
            </button>
          </div>
        </form>
      )}

      <div className="meal-groups">
        {groupedByMeal.map(({ id, label, icon: Icon, entries: mealEntries }) => (
          <div className="card meal-group" key={id}>
            <div className="meal-group-header">
              <span className="meal-group-icon">
                <Icon size={16} />
              </span>
              <h3>{label}</h3>
              <span className="meal-group-total">
                {mealEntries.reduce((sum, e) => sum + Number(e.calories || 0), 0)} kcal
              </span>
            </div>
            {mealEntries.length === 0 ? (
              <p className="meal-group-empty">Nothing logged yet</p>
            ) : (
              <div className="meal-entries">
                {mealEntries.map((entry) => (
                  <div className="meal-entry" key={entry.id}>
                    <span className="meal-entry-name">{entry.name}</span>
                    <span className="meal-entry-cal">{entry.calories} kcal</span>
                    <button onClick={() => handleDelete(entry.id)} aria-label="Delete entry">
                      <LuTrash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {todayEntries.length === 0 && !showForm && (
        <EmptyState
          icon={LuUtensils}
          title="No meals logged today"
          body="Add your first meal to start tracking today's calories."
          action={
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              <LuPlus size={16} /> Log Food
            </button>
          }
        />
      )}
    </div>
  );
};

export default Calories;
