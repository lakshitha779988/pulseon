import { useState, useEffect } from "react";

/**
 * Tracks the browser's online/offline status via the native events.
 * Note: `navigator.onLine` only reflects network *interface* state (e.g. wifi
 * connected) — it can be true even with no real internet access, and false
 * positives/negatives both exist. It's still the right signal for "should I
 * show an offline banner", because it's instant and has zero cost, unlike
 * pinging a server to verify real connectivity.
 */
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
};
