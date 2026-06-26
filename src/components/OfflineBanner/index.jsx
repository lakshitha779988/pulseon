import { LuWifiOff, LuCheck } from "react-icons/lu";
import { useConnectionBanner } from "../../hooks/useConnectionBanner";
import "./offlinebanner.css";

/**
 * Shows a banner when the connection drops, and a brief "back online"
 * confirmation when it returns. Workout/water/calorie logging keeps working
 * either way since all of that reads/writes IndexedDB directly — this banner
 * is purely informational, plus it's where the ExerciseDB-needs-internet
 * caveat gets surfaced honestly instead of letting a search just hang.
 */
const OfflineBanner = () => {
  const { isOnline, isBannerVisible } = useConnectionBanner();

  if (!isBannerVisible) return null;

  return (
    <div className={`offline-banner ${isOnline ? "is-reconnected" : "is-offline"}`}>
      {isOnline ? (
        <>
          <LuCheck size={15} />
          <span>Back online — everything's in sync.</span>
        </>
      ) : (
        <>
          <LuWifiOff size={15} />
          <span>You're offline. Your logs are saved on this device and the app keeps working.</span>
        </>
      )}
    </div>
  );
};

export default OfflineBanner;
