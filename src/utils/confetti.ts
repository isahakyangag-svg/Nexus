import confetti from 'canvas-confetti';

/**
 * Triggers a premium, subtle dual-side burst confetti event.
 * Ideal for high-profile successes like downloading files or submitting key forms.
 */
export const triggerPremiumConfetti = () => {
  // Sophisticated palette featuring gold, emerald, royal purple, magenta, and cyan
  const colors = ['#a855f7', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];

  // Left-corner burst
  confetti({
    particleCount: 35,
    angle: 60,
    spread: 60,
    origin: { x: 0.1, y: 0.8 },
    colors,
    gravity: 1.1,
    scalar: 0.9,
    drift: 0.5,
    disableForReducedMotion: true,
  });

  // Right-corner burst
  confetti({
    particleCount: 35,
    angle: 120,
    spread: 60,
    origin: { x: 0.9, y: 0.8 },
    colors,
    gravity: 1.1,
    scalar: 0.9,
    drift: -0.5,
    disableForReducedMotion: true,
  });
};

/**
 * Triggers a smaller, delicate center burst confetti event.
 * Perfect for quick feedback states or smaller interactions.
 */
export const triggerSubtleConfetti = () => {
  const colors = ['#c084fc', '#34d399', '#60a5fa', '#f472b6'];
  
  confetti({
    particleCount: 30,
    spread: 50,
    startVelocity: 25,
    origin: { x: 0.5, y: 0.6 },
    colors,
    gravity: 1.0,
    scalar: 0.8,
    disableForReducedMotion: true,
  });
};
