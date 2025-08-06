import { useEffect, useRef } from 'react';
import './styles.css';

const flakeChars = ['🃏', '♠', '♥', '♦', '♣'];

export function Snowflakes() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createFlake = () => {
      const flake = document.createElement('div');
      flake.className = 'snowflake';
      flake.textContent =
        flakeChars[Math.floor(Math.random() * flakeChars.length)];

      const size = Math.random() * 6 + 6; // 6px to 12px
      const left = Math.random() * 100; // vw
      const duration = Math.random() * 5 + 4; // 4s to 9s

      flake.style.left = `${left}vw`;
      flake.style.fontSize = `${size}px`;
      flake.style.animationDuration = `${duration}s`;

      container.appendChild(flake);

      setTimeout(() => {
        container.removeChild(flake);
      }, duration * 1000);
    };

    const interval = setInterval(createFlake, 150);

    return () => clearInterval(interval);
  }, []);

  return <div className="snowflake-container" ref={containerRef} />;
}
