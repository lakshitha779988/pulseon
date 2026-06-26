import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { LuTrendingUp, LuDroplets, LuDumbbell, LuZap } from "react-icons/lu";
import { getWaterRecords, getWorkouts, getWorkoutExercises } from "../../services/db";
import PageHeader from "../../components/PageHeader";
import { SkeletonBlock } from "../../components/Skeleton";
import "./progress.css";

const Progress = () => {
  const [timeRange, setTimeRange] = useState("week");
  const [waterData, setWaterData] = useState([]);
  const [workoutData, setWorkoutData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgressData();
  }, [timeRange]);

  const loadProgressData = async () => {
    setLoading(true);
    try {
      const days = timeRange === "week" ? 7 : 30;
      const dates = Array.from({ length: days }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (days - 1 - i));
        return d.toISOString().split("T")[0];
      });

      const waterRecords = await getWaterRecords();
      const workouts = await getWorkouts();

      const wData = dates.map((date) => {
        const rec = waterRecords.filter((r) => r.date === date || r.createdAt?.startsWith(date)).pop();
        return {
          date,
          label: formatLabel(date, timeRange),
          value: rec?.amount || 0,
          goal: rec?.goal || 2500,
        };
      });
      setWaterData(wData);

      const woData = [];
      const volData = [];

      for (const date of dates) {
        const dayWorkouts = workouts.filter((w) => w.date === date);
        woData.push({
          date,
          label: formatLabel(date, timeRange),
          value: dayWorkouts.length,
        });

        let dayVolume = 0;
        for (const w of dayWorkouts) {
          const exercises = await getWorkoutExercises(w.id);
          for (const ex of exercises) {
            dayVolume += ex.sets?.reduce((sum, s) => sum + s.reps * s.weight, 0) || 0;
          }
        }
        volData.push({ date, label: formatLabel(date, timeRange), value: dayVolume });
      }

      setWorkoutData(woData);
      setVolumeData(volData);
    } catch (err) {
      console.error("Failed to load progress", err);
    } finally {
      setLoading(false);
    }
  };

  const formatLabel = (date, range) => {
    const d = new Date(date);
    if (range === "week") return d.toLocaleDateString("en", { weekday: "short" });
    return d.toLocaleDateString("en", { day: "numeric", month: "short" });
  };

  const avg = (data) => (data.length ? Math.round(data.reduce((a, b) => a + b.value, 0) / data.length) : 0);
  const total = (data) => data.reduce((a, b) => a + b.value, 0);

  const tooltipStyle = {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    color: "var(--text-primary)",
    fontSize: 12.5,
  };

  return (
    <div className="progress-page">
      <PageHeader
        icon={LuTrendingUp}
        eyebrow="Insights"
        title="Your progress"
        subtitle="Track hydration, training frequency, and volume trends over time."
        action={
          <div className="range-toggle">
            <button className={timeRange === "week" ? "is-active" : ""} onClick={() => setTimeRange("week")}>
              Week
            </button>
            <button className={timeRange === "month" ? "is-active" : ""} onClick={() => setTimeRange("month")}>
              Month
            </button>
          </div>
        }
      />

      <div className="card chart-section">
        <div className="chart-header">
          <h3 className="section-title">
            <LuDroplets size={17} /> Water Intake
          </h3>
          <span className="chart-avg">Avg: {avg(waterData)} ml</span>
        </div>
        {loading ? (
          <SkeletonBlock height="200px" radius="12px" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={waterData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--water)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--water)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 11.5 }} interval={timeRange === "month" ? 3 : 0} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 11.5 }} width={42} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value} ml`, "Water"]} />
              <Area type="monotone" dataKey="value" stroke="var(--water)" strokeWidth={2.5} fill="url(#waterGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="card chart-section">
        <div className="chart-header">
          <h3 className="section-title">
            <LuDumbbell size={17} /> Workouts
          </h3>
          <span className="chart-avg">Total: {total(workoutData)}</span>
        </div>
        {loading ? (
          <SkeletonBlock height="200px" radius="12px" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={workoutData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }} barCategoryGap={timeRange === "month" ? "20%" : "32%"}>
              <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 11.5 }} interval={timeRange === "month" ? 3 : 0} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 11.5 }} width={28} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value} workout${value === 1 ? "" : "s"}`, ""]} cursor={{ fill: "var(--surface-hover)" }} />
              <Bar dataKey="value" radius={[6, 6, 6, 6]} maxBarSize={24} fill="var(--accent)" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="card chart-section">
        <div className="chart-header">
          <h3 className="section-title">
            <LuZap size={17} /> Training Volume
          </h3>
          <span className="chart-avg">Total: {total(volumeData).toLocaleString()} kg</span>
        </div>
        {loading ? (
          <SkeletonBlock height="200px" radius="12px" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={volumeData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }} barCategoryGap={timeRange === "month" ? "20%" : "32%"}>
              <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 11.5 }} interval={timeRange === "month" ? 3 : 0} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 11.5 }} width={42} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value.toLocaleString()} kg`, "Volume"]} cursor={{ fill: "var(--surface-hover)" }} />
              <Bar dataKey="value" radius={[6, 6, 6, 6]} maxBarSize={24} fill="var(--energy)" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Progress;
