import { useEffect, useState, useCallback, useRef } from "react";
import { logout, refreshToken } from "../api/auth";

export default function useSessionTimeout({
  isAuthenticated,
  sessionDuration = 15 * 60 * 1000,
  warningDuration = 60 * 1000,
}) {
  const [showWarning, setShowWarning] = useState(false);

  const idleTimerRef = useRef(null);
  const logoutTimerRef = useRef(null);

  const clearAllTimers = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
  };

  const startTimers = useCallback(() => {
    clearAllTimers();
    setShowWarning(false);

    idleTimerRef.current = setTimeout(() => {
      setShowWarning(true);
    }, sessionDuration - warningDuration);

    logoutTimerRef.current = setTimeout(async () => {
      try {
        await logout();
      } finally {
        window.location.replace("/login");
      }
    }, sessionDuration);
  }, [sessionDuration, warningDuration]);

  const resetActivityTimer = useCallback(() => {
    if (!isAuthenticated) return;
    startTimers();
  }, [startTimers, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      clearAllTimers();
      setShowWarning(false);
      return;
    }

    const events = ["mousemove", "keydown", "scroll", "click"];
    const handler = () => resetActivityTimer();

    events.forEach((e) =>
      window.addEventListener(e, handler, { passive: true })
    );

    startTimers();

    return () => {
      events.forEach((e) =>
        window.removeEventListener(e, handler)
      );
      clearAllTimers();
    };
  }, [isAuthenticated, resetActivityTimer, startTimers]);

  const resetTimer = async () => {
    try {
      await refreshToken();
      setShowWarning(false);
      startTimers();
    } catch {
      await logout();
      window.location.replace("/login");
    }
  };

  return { showWarning, resetTimer };
}
