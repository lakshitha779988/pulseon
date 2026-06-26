import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  LuDroplets,
  LuDumbbell,
  LuFlame,
  LuZap,
  LuSearch,
  LuClipboardList,
  LuTrendingUp,
  LuCalendarDays,
} from "react-icons/lu";
import { getWaterRecords, getWorkouts, getWorkoutExercises } from "../../services/db";
import PageHeader from "../../components/PageHeader";
import { SkeletonBlock } from "../../components/Skeleton";
import "./dashboard.css";

const Dashboard = () => {
  const [todayWater, setTodayWater] = useState(0);
  const [todayWorkouts, setTodayWorkouts] = useState(0);
  const [todayExercises, setTodayExercises] = useState(0);
  const [todayVolume, setTodayVolume] = useState(0);
  const [weeklyWorkouts, setWeeklyWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const waterRecords = await getWaterRecords();
      const todayWaterRec = waterRecords
        .filter((r) => r.date === today || r.createdAt?.startsWith(today))
        .pop();
      setTodayWater(todayWaterRec?.amount || 0);

      const workouts = await getWorkouts();
      const todayWorkoutList = workouts.filter((w) => w.date === today);
      setTodayWorkouts(todayWorkoutList.length);

      let totalExercises = 0;
      let totalVolume = 0;

      for (const workout of todayWorkoutList) {
        const exercises = await getWorkoutExercises(workout.id);
        totalExercises += exercises.length;
        for (const ex of exercises) {
          totalVolume += ex.sets?.reduce((sum, s) => sum + s.reps * s.weight, 0) || 0;
        }
      }

      setTodayExercises(totalExercises);
      setTodayVolume(totalVolume);

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split("T")[0];
      });

      const weeklyData = last7Days.map((date) => {
        const dayWorkouts = workouts.filter((w) => w.date === date);
        return {
          date,
          label: new Date(date).toLocaleDateString("en", { weekday: "short" }),
          count: dayWorkouts.length,
        };
      });

      setWeeklyWorkouts(weeklyData);
    } catch (err) {
      console.error("Failed to load dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      to: "/water",
      icon: LuDroplets,
      value: todayWater,
      unit: "ml",
      label: "Water Intake",
      tone: "water",
    },
    {
      to: "/workout",
      icon: LuDumbbell,
      value: todayWorkouts,
      unit: "",
      label: "Workouts",
      tone: "accent",
    },
    {
      to: null,
      icon: LuClipboardList,
      value: todayExercises,
      unit: "",
      label: "Exercises Logged",
      tone: "violet",
    },
    {
      to: null,
      icon: LuZap,
      value: todayVolume,
      unit: "kg",
      label: "Training Volume",
      tone: "energy",
    },
  ];

  const quickActions = [
    { to: "/water", icon: LuDroplets, label: "Log Water" },
    { to: "/exercises", icon: LuSearch, label: "Find Exercise" },
    { to: "/workout", icon: LuDumbbell, label: "View Workouts" },
    { to: "/calories", icon: LuFlame, label: "Log Calories" },
    { to: "/progress", icon: LuTrendingUp, label: "Progress" },
  ];

  return (
    <div className="dashboard">
      <PageHeader
        icon={LuCalendarDays}
        eyebrow={new Date().toLocaleDateString("en", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
        title="Welcome back"
        subtitle="Here's a snapshot of today's activity across hydration, training and recovery."
      />

      <div className="stats-grid">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const content = (
            <>
              <div className={`stat-icon tone-${stat.tone}`}>
                <Icon size={19} strokeWidth={2} />
              </div>
              {loading ? (
                <SkeletonBlock width="64px" height="26px" />
              ) : (
                <div className="stat-value">
                  {stat.value}
                  {stat.unit && <span className="stat-unit"> {stat.unit}</span>}
                </div>
              )}
              <div className="stat-label">{stat.label}</div>
            </>
          );

          return stat.to ? (
            <Link to={stat.to} className={`stat-card tone-${stat.tone}`} key={stat.label}>
              {content}
            </Link>
          ) : (
            <div className={`stat-card tone-${stat.tone}`} key={stat.label}>
              {content}
            </div>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <div className="card chart-card">
          <div className="card-header-row">
            <h3 className="section-title">
              <LuTrendingUp size={17} />
              Weekly Activity
            </h3>
          </div>
          {loading ? (
            <SkeletonBlock width="100%" height="180px" radius="12px" />
          ) : (
            <div className="weekly-chart-wrap">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyWorkouts} barCategoryGap="32%">
                  <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="var(--border)" />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--surface-hover)" }}
                    contentStyle={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 10,
                      color: "var(--text-primary)",
                      fontSize: 12.5,
                    }}
                    labelFormatter={() => ""}
                    formatter={(value) => [`${value} workout${value === 1 ? "" : "s"}`, ""]}
                  />
                  <Bar dataKey="count" radius={[8, 8, 8, 8]} maxBarSize={28} fill="var(--accent)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="card quick-actions-card">
          <h3 className="section-title">Quick Start</h3>
          <div className="action-grid">
            {quickActions.map(({ to, icon: Icon, label }) => (
              <Link to={to} className="action-btn" key={label}>
                <span className="action-icon">
                  <Icon size={18} strokeWidth={2} />
                </span>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
