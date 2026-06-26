import { NavLink } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuDroplets,
  LuDumbbell,
  LuFlame,
  LuTrendingUp,
  LuSearch,
} from "react-icons/lu";
import "./sidenav.css";

const navItems = [
  { to: "/", label: "Dashboard", icon: LuLayoutDashboard, end: true },
  { to: "/exercises", label: "Exercises", icon: LuSearch },
  { to: "/workout", label: "Workouts", icon: LuDumbbell },
  { to: "/water", label: "Hydration", icon: LuDroplets },
  { to: "/calories", label: "Calories", icon: LuFlame },
  { to: "/progress", label: "Progress", icon: LuTrendingUp },
];

const SideNav = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && <div className="sidenav-backdrop" onClick={onClose} />}
      <aside className={`sidenav ${isOpen ? "is-open" : ""}`}>
        <nav className="sidenav-nav" aria-label="Primary">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) => `sidenav-link ${isActive ? "is-active" : ""}`}
            >
              <Icon size={19} strokeWidth={2} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidenav-footer">
          <div className="sidenav-tip">
            <p className="sidenav-tip-title">Stay consistent</p>
            <p className="sidenav-tip-body">Small daily logs compound into real progress.</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideNav;
