import { Link, useNavigate } from "react-router-dom";
import { HiOutlineMenu } from "react-icons/hi";
import { LuActivity } from "react-icons/lu";
import ThemeToggle from "../ThemeToggle";
import "./topbar.css";

const TopBar = ({ title, onMenuClick }) => {
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="topbar-left">
          <button
            className="topbar-menu-btn"
            aria-label="Open navigation menu"
            onClick={onMenuClick}
          >
            <HiOutlineMenu size={20} />
          </button>

          <Link to="/" className="topbar-brand" aria-label="Pulseon home">
            <span className="brand-mark">
              <LuActivity size={18} strokeWidth={2.6} />
            </span>
            <span className="brand-name">
              Pulse<span className="brand-accent">on</span>
            </span>
          </Link>
        </div>

        {title && <h1 className="topbar-title">{title}</h1>}

        <div className="topbar-right">
          <ThemeToggle />
          <button
            className="topbar-avatar"
            aria-label="Account"
            onClick={() => navigate("/")}
          >
            <span>P</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
