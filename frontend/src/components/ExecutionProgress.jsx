import React, { useEffect, useState } from 'react';

/**
 * ExecutionProgress — an animated progress bar that runs during code execution.
 * It progresses from 0 → ~85% quickly, then waits (since we don't know real progress),
 * and jumps to 100% when done.
 */
const ExecutionProgress = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer;
    if (isLoading) {
      setVisible(true);
      setProgress(0);

      // Animate to 85% over 2 seconds with easing
      let current = 0;
      const steps = [
        { target: 30, duration: 300 },
        { target: 60, duration: 500 },
        { target: 78, duration: 700 },
        { target: 85, duration: 600 },
      ];

      let delay = 0;
      for (const step of steps) {
        const { target, duration } = step;
        delay += duration;
        timer = setTimeout(() => setProgress(target), delay);
      }
    } else {
      // Complete and fade out
      setProgress(100);
      timer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 600);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0,
      height: 2,
      zIndex: 100,
      background: 'transparent',
    }}>
      <div style={{
        height: '100%',
        width: `${progress}%`,
        background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary), var(--accent-green))',
        backgroundSize: '200% 100%',
        transition: progress === 100 ? 'width 0.3s ease' : 'width 0.6s ease',
        boxShadow: '0 0 8px var(--accent-secondary)',
        animation: isLoading ? 'shimmer 1.5s infinite' : 'none',
      }} />
    </div>
  );
};

export default ExecutionProgress;
