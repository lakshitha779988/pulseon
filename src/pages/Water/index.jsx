import { useEffect, useState } from "react";
import {
  LuDroplets,
  LuTarget,
  LuTrendingDown,
  LuClock,
  LuSave,
  LuChevronDown,
  LuChevronUp,
  LuCupSoda,
  LuGlassWater,
} from "react-icons/lu";
import { saveWaterRecord, getWaterRecords } from "../../services/db";
import PageHeader from "../../components/PageHeader";
import WaterSlider from "../../components/WaterSlider";
import "./water.css";

const quickAddOptions = [
  { ml: 250, label: "Glass", icon: LuGlassWater },
  { ml: 500, label: "Bottle", icon: LuCupSoda },
  { ml: 750, label: "Large", icon: LuCupSoda },
  { ml: 1000, label: "Jug", icon: LuDroplets },
];

const goalPresets = [2000, 2500, 3000, 3500, 4000];

const Water = () => {
  const [goal, setGoal] = useState(3000);
  const [amount, setAmount] = useState(0);
  const [records, setRecords] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const data = await getWaterRecords();
      setRecords(data);

      if (data.length > 0) {
        const latest = data[data.length - 1];
        setAmount(latest.amount);
        setGoal(latest.goal);
        setLastSaved(new Date(latest.createdAt).toLocaleTimeString());
      }
    };
    loadData();
  }, []);

  const saveWater = async () => {
    await saveWaterRecord({
      date: new Date().toISOString(),
      amount,
      goal,
    });

    const updated = await getWaterRecords();
    setRecords(updated);
    setLastSaved(new Date().toLocaleTimeString());
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1600);

    if (navigator.vibrate) navigator.vibrate(50);
  };

  const quickAdd = (ml) => {
    setAmount((prev) => Math.min(prev + ml, goal * 1.5));
  };

  const percentage = Math.min((amount / goal) * 100, 100);
  const remaining = Math.max(goal - amount, 0);

  const getStatusColor = () => {
    if (percentage >= 100) return "var(--accent)";
    if (percentage >= 75) return "var(--water)";
    if (percentage >= 50) return "var(--energy)";
    if (percentage >= 25) return "#ff9f4a";
    return "var(--danger)";
  };

  const getStatusText = () => {
    if (percentage >= 100) return "Goal crushed";
    if (percentage >= 75) return "Almost there";
    if (percentage >= 50) return "Keep going";
    if (percentage >= 25) return "Good start";
    return "Hydrate now";
  };

  const todayRecords = records.filter((r) => {
    const recDate = new Date(r.createdAt || r.date).toISOString().split("T")[0];
    return recDate === new Date().toISOString().split("T")[0];
  });

  const statusColor = getStatusColor();
  const circumference = 2 * Math.PI * 85;

  return (
    <div className="water-page">
      <PageHeader
        icon={LuDroplets}
        eyebrow="Hydration"
        title="Track your water intake"
        subtitle="Stay on top of your daily hydration goal with quick logs and a visual progress ring."
      />

      <div className="water-top-grid">
        <div className="card water-ring-card">
          <div className="water-ring-wrapper">
            <svg className="water-ring" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke="var(--surface-2)"
                strokeWidth="12"
              />
              <circle
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke={statusColor}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${circumference}`}
                strokeDashoffset={`${circumference * (1 - percentage / 100)}`}
                transform="rotate(-90 100 100)"
                style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.3s ease" }}
              />
            </svg>
            <div className="water-ring-content">
              <span className="water-amount">{amount}</span>
              <span className="water-unit">ml</span>
              <span className="water-percent" style={{ color: statusColor }}>
                {Math.round(percentage)}%
              </span>
            </div>
          </div>
          <div className="water-status" style={{ color: statusColor }}>
            {getStatusText()}
          </div>
        </div>

        <div className="water-stats-stack">
          <div className="card water-stat-box">
            <span className="water-stat-icon tone-accent">
              <LuTarget size={18} />
            </span>
            <div>
              <span className="water-stat-value">{goal} ml</span>
              <span className="water-stat-label">Daily goal</span>
            </div>
          </div>
          <div className="card water-stat-box">
            <span className="water-stat-icon tone-water">
              <LuTrendingDown size={18} />
            </span>
            <div>
              <span className="water-stat-value">{remaining} ml</span>
              <span className="water-stat-label">Remaining</span>
            </div>
          </div>
          <div className="card water-stat-box">
            <span className="water-stat-icon tone-violet">
              <LuClock size={18} />
            </span>
            <div>
              <span className="water-stat-value">{lastSaved || "--"}</span>
              <span className="water-stat-label">Last log</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card water-section">
        <h3 className="section-title">Quick add</h3>
        <div className="quick-add-grid">
          {quickAddOptions.map(({ ml, label, icon: Icon }) => (
            <button className="quick-add-btn" key={ml} onClick={() => quickAdd(ml)}>
              <span className="quick-add-icon">
                <Icon size={18} />
              </span>
              <span className="quick-add-amount">+{ml >= 1000 ? `${ml / 1000}L` : `${ml}ml`}</span>
              <span className="quick-add-desc">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card water-section">
        <div className="slider-header">
          <h3 className="section-title">Custom amount</h3>
          <span className="slider-value">{amount} ml</span>
        </div>
        <WaterSlider amount={amount} goal={goal} color={statusColor} onChange={setAmount} />
        <div className="slider-labels">
          <span>0</span>
          <span>{Math.round(goal / 2)}</span>
          <span>{goal}</span>
          <span>{Math.round(goal * 1.5)}</span>
        </div>
      </div>

      <div className="card water-section">
        <h3 className="section-title">Daily goal</h3>
        <div className="goal-input-wrapper">
          <input
            type="number"
            value={goal}
            onChange={(e) => setGoal(Number(e.target.value))}
            className="goal-input"
            min="500"
            max="10000"
            step="100"
          />
          <span className="goal-unit">ml</span>
        </div>
        <div className="goal-presets">
          {goalPresets.map((g) => (
            <button
              key={g}
              className={goal === g ? "is-active" : ""}
              onClick={() => setGoal(g)}
            >
              {g / 1000}L
            </button>
          ))}
        </div>
      </div>

      <button
        className={`btn-primary water-save-btn ${justSaved ? "is-saved" : ""}`}
        onClick={saveWater}
      >
        <LuSave size={17} />
        {justSaved ? "Saved!" : "Save Intake"}
      </button>

      {todayRecords.length > 0 && (
        <div className="card water-history">
          <button className="history-header" onClick={() => setShowHistory(!showHistory)}>
            <h3 className="section-title">Today's logs ({todayRecords.length})</h3>
            {showHistory ? <LuChevronUp size={18} /> : <LuChevronDown size={18} />}
          </button>
          {showHistory && (
            <div className="history-list">
              {todayRecords
                .slice()
                .reverse()
                .map((rec, idx) => (
                  <div key={idx} className="history-item">
                    <span className="history-time">
                      {new Date(rec.createdAt || rec.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="history-bar">
                      <span
                        className="history-bar-fill"
                        style={{ width: `${Math.min((rec.amount / goal) * 100, 100)}%` }}
                      />
                    </span>
                    <span className="history-amount">{rec.amount}ml</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Water;
