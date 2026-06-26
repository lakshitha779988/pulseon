import { useState, useEffect, useRef } from "react";
import { LuPlay, LuPause, LuRotateCcw, LuTimer } from "react-icons/lu";
import "./stopwatch.css";

const presets = [30, 60, 90, 120];

const Stopwatch = ({ onClose }) => {
  const [seconds, setSeconds] = useState(60);
  const [remaining, setRemaining] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            setIsRunning(false);
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, remaining]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handlePreset = (val) => {
    setSeconds(val);
    setRemaining(val);
    setIsRunning(false);
  };

  const handleReset = () => {
    setRemaining(seconds);
    setIsRunning(false);
  };

  const percentage = seconds > 0 ? ((seconds - remaining) / seconds) * 100 : 0;
  const circumference = 2 * Math.PI * 70;

  return (
    <div className="stopwatch-card card">
      <div className="stopwatch-header">
        <h3 className="section-title">
          <LuTimer size={17} /> Rest Timer
        </h3>
      </div>

      <div className="stopwatch-ring-wrap">
        <svg className="stopwatch-ring" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="70" fill="none" stroke="var(--surface-2)" strokeWidth="9" />
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke={remaining === 0 ? "var(--accent)" : "var(--violet)"}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - percentage / 100)}
            transform="rotate(-90 80 80)"
            style={{ transition: "stroke-dashoffset 0.3s linear" }}
          />
        </svg>
        <div className="stopwatch-time">{formatTime(remaining)}</div>
      </div>

      <div className="stopwatch-presets">
        {presets.map((p) => (
          <button key={p} className={seconds === p ? "is-active" : ""} onClick={() => handlePreset(p)}>
            {p}s
          </button>
        ))}
      </div>

      <div className="stopwatch-controls">
        <button className="icon-btn" onClick={handleReset} aria-label="Reset timer">
          <LuRotateCcw size={17} />
        </button>
        <button
          className="btn-primary stopwatch-play-btn"
          onClick={() => setIsRunning((r) => !r)}
          disabled={remaining === 0}
        >
          {isRunning ? <LuPause size={17} /> : <LuPlay size={17} />}
          {isRunning ? "Pause" : "Start"}
        </button>
        {onClose && (
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default Stopwatch;
