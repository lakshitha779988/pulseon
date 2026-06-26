import { useState, useEffect } from "react";
import { LuDownload, LuX } from "react-icons/lu";
import { useInstallPrompt } from "../../hooks/useInstallPrompt";
import "./installprompt.css";

const DISMISS_KEY = "pulseon-install-dismissed";

const InstallPrompt = () => {
  const { canInstall, promptInstall } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore storage errors
    }
  };

  if (!canInstall || dismissed) return null;

  return (
    <div className="install-prompt">
      <div className="install-prompt-icon">
        <LuDownload size={17} />
      </div>
      <div className="install-prompt-text">
        <strong>Install Pulseon</strong>
        <span>Add it to your home screen for offline access and quicker launches.</span>
      </div>
      <button className="btn-primary install-prompt-btn" onClick={promptInstall}>
        Install
      </button>
      <button className="install-prompt-dismiss" onClick={handleDismiss} aria-label="Dismiss">
        <LuX size={16} />
      </button>
    </div>
  );
};

export default InstallPrompt;
