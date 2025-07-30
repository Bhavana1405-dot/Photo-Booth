import React, { useState, useEffect } from 'react';

interface TimerProps {
  onComplete: () => void;
  duration?: number;
}

const Timer: React.FC<TimerProps> = ({ onComplete, duration = 3 }) => {
  const [count, setCount] = useState(duration);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => {
        setCount(count - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [count, onComplete]);

  const getColorClass = () => {
    switch (count) {
      case 3: return 'text-red-400 border-red-400 bg-red-500';
      case 2: return 'text-yellow-400 border-yellow-400 bg-yellow-500';
      case 1: return 'text-green-400 border-green-400 bg-green-500';
      default: return 'text-white border-white bg-white';
    }
  };

  const getScaleClass = () => {
    return count > 0 ? 'scale-100 animate-pulse' : 'scale-150';
  };

  if (count === 0) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-8xl md:text-9xl font-black text-yellow-400 animate-bounce drop-shadow-2xl">
          📸
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div className={`
        w-32 h-32 md:w-40 md:h-40 
        rounded-full border-8 
        flex items-center justify-center 
        transition-all duration-500 
        shadow-2xl
        ${getColorClass()} 
        ${getScaleClass()}
      `}>
        <div className="text-6xl md:text-7xl font-black text-white drop-shadow-lg">
          {count}
        </div>
      </div>
    </div>
  );
};

export default Timer;