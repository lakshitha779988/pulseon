import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TopBar from "../components/TopBar";
import SideNav from "../components/SideNav";
import BottomNav from "../components/BottomNav";

const pageTitles = {
  "/": "Dashboard",
  "/water": "Hydration",
  "/workout": "Workouts",
  "/exercises": "Exercise Library",
  "/progress": "Progress",
  "/calories": "Calories",
};

const getTitle = (pathname) => {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith("/exercises/")) return "Exercise Detail";
  return "Pulseon";
};

const AppLayout = ({ children }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsNavOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <TopBar title={getTitle(location.pathname)} onMenuClick={() => setIsNavOpen((v) => !v)} />
      <SideNav isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
      <div className="app-main" style={{ paddingTop: "var(--topbar-h)" }}>
        <main className="app-content page-fade" key={location.pathname}>
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
};

export default AppLayout;
