import { NavLink } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuDroplets,
  LuDumbbell,
  LuSearch,
  LuTrendingUp,
} from "react-icons/lu";
import "./bottomnav.css";

const navItems = [
  { to: "/", label: "Home", icon: LuLayoutDashboard, end: true },
  { to: "/water", label: "Water", icon: LuDroplets },
  { to: "/workout", label: "Workout", icon: LuDumbbell },
  { to: "/exercises", label: "Explore", icon: LuSearch },
  { to: "/progress", label: "Progress", icon: LuTrendingUp },
];

const BottomNav = () => {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {navItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => `bottom-nav-item ${isActive ? "is-active" : ""}`}
        >
          <span className="bottom-nav-icon">
            <Icon size={21} strokeWidth={2} />
          </span>
          <span className="bottom-nav-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
