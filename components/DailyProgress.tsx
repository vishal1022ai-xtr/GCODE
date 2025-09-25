import React from 'react';

interface DailyProgressProps {
  progress: number; // 0 to 100
}

const DailyProgress: React.FC<DailyProgressProps> = ({ progress }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const progressColor = progress < 40 ? 'stroke-red-500' : progress < 80 ? 'stroke-yellow-500' : 'stroke-green-500';

  return (
    <div className="relative w-40 h-40">
      <svg className="w-full h-full" viewBox="0 0 120 120">
        <circle
          className="text-gray-200 dark:text-gray-700"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
        <circle
          className={`transition-all duration-500 ease-in-out ${progressColor}`}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{Math.round(progress)}%</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">Completed</span>
      </div>
    </div>
  );
};

export default DailyProgress;