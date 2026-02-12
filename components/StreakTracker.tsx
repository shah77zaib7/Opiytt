
import React from 'react';
import { MILESTONES } from '../constants';

interface StreakTrackerProps {
  streak: number;
}

const StreakTracker: React.FC<StreakTrackerProps> = ({ streak }) => {
  const getNextMilestone = () => {
    return MILESTONES.find(m => m.day > streak) || MILESTONES[MILESTONES.length - 1];
  };

  const nextMilestone = getNextMilestone();
  // Fixed: Replaced findLast with a spread-reverse-find pattern for better compatibility with older TS targets
  const prevMilestoneDay = [...MILESTONES].reverse().find(m => m.day <= streak)?.day || 0;
  
  const progress = Math.min(
    100, 
    Math.max(0, ((streak - prevMilestoneDay) / (nextMilestone.day - prevMilestoneDay)) * 100)
  );

  return (
    <div className="w-full max-w-md mx-auto space-y-4 px-4">
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-2">
          <span className="text-4xl">🔥</span>
          <div>
            <div className="text-3xl font-extrabold text-[#0052FF]">{streak}</div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Current Streak</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-600">Next: {nextMilestone.emoji}</div>
          <div className="text-xs text-gray-400">{nextMilestone.day} Days</div>
        </div>
      </div>

      <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden border border-gray-100">
        <div 
          className="absolute top-0 left-0 h-full bg-[#0052FF] transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        >
          <div className="w-full h-full opacity-30 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse" />
        </div>
      </div>
      
      <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
        <span>{prevMilestoneDay} DAYS</span>
        <span>{nextMilestone.day} DAYS</span>
      </div>
    </div>
  );
};

export default StreakTracker;
