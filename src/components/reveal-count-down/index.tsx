import { Text } from '@mantine/core';
import { useEffect, useState } from 'react';

interface RevealCountdownProps {
  seconds?: number;
  onFinish: () => void;
}

export function RevealCountdown({
  seconds = 3,
  onFinish,
}: RevealCountdownProps) {
  const [count, setCount] = useState(seconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setTimeout(() => {
            onFinish();
          }, 0);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="absolute inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
      <Text className="text-white text-6xl font-bold animate-pulse">
        {count}
      </Text>
    </div>
  );
}
