import { useState, useCallback } from "react";

export function useNotification() {
  const [toasts, setToasts] = useState([]);

  const playSound = useCallback((type = "success") => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();

    const frequencies = {
      success: [523.25, 659.25, 783.99], 
      error: [130.81, 146.83, 164.81], 
      warning: [440, 494.88, 392], 
      info: [261.63, 329.63, 392],
    };

    const freq = frequencies[type] || frequencies.info;
    let currentFreqIndex = 0;

    const playNote = () => {
      if (currentFreqIndex >= freq.length) return;

      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.frequency.value = freq[currentFreqIndex];
      oscillator.type = "sine";

      gain.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.1
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);

      currentFreqIndex++;
      setTimeout(playNote, 100);
    };

    playNote();
  }, []);

  const addToast = useCallback(
    (message, type = "info", duration = 3000) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);
      playSound(type);

      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, duration);

      return id;
    },
    [playSound]
  );

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return { toasts, addToast, removeToast, playSound };
}
