import { LuSun, LuMoon } from "react-icons/lu";
import { useTheme } from "../../context/ThemeContext";
import "./themetoggle.css";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-pressed={isDark}
    >
      <span className={`theme-toggle-track ${isDark ? "is-dark" : "is-light"}`}>
        <span className="theme-toggle-thumb">
          {isDark ? <LuMoon size={13} /> : <LuSun size={13} />}
        </span>
      </span>
    </button>
  );
};

export default ThemeToggle;
