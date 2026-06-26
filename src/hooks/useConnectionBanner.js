import { useState, useEffect } from "react";
import { useOnlineStatus } from "./useOnlineStatus";

/**
 * Wraps useOnlineStatus with the banner's own "still showing the brief
 * reconnected confirmation" window, so layout code and the banner itself
 * agree on exactly when space needs to be reserved at the top of the screen.
 */
export const useConnectionBanner = () => {
  const isOnline = useOnlineStatus();
  const [wasOffline, setWasOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline) {
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
        setWasOffline(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  return {
    isOnline,
    isBannerVisible: !isOnline || showReconnected,
    showReconnected,
  };
};
