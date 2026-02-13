
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
  const prevMilestoneDay = [...MILESTONES].reverse().find(m => m.day <= streak)?.day || 0;
  
  const daysRemaining = Math.max(0, nextMilestone.day - streak);
  const isAtMax = streak >= 100;

  const progress = isAtMax 
    ? 100 
    : Math.min(100, Math.max(0, ((streak - prevMilestoneDay) / (nextMilestone.day - prevMilestoneDay)) * 100));

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Header Info */}
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="text-4xl animate-bounce inline-block" style={{ animationDuration: '3s' }}>🔥</span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-ping"></div>
          </div>
          <div>
            <div className="text-4xl font-black text-[#0052FF] leading-none tracking-tighter">{streak}</div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Current Streak</div>
          </div>
        </div>
        
        <div className="text-right">
          {isAtMax ? (
            <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-yellow-200">
              Max Level Reached
            </div>
          ) : (
            <div className="flex flex-col items-end">
              <span className="text-sm font-black text-gray-800 flex items-center gap-1">
                {nextMilestone.emoji} {daysRemaining} Days Left
              </span>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-tight">
                To {nextMilestone.label}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Progress Bar */}
      <div className="space-y-3">
        <div className="relative">
          {/* Track Background */}
          <div className="w-full h-5 bg-gray-100 rounded-full overflow-hidden border border-gray-100 p-1">
            {/* Progress Fill */}
            <div 
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-[#0052FF] transition-all duration-1000 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_2s_infinite_linear]"></div>
            </div>
          </div>

          {/* Milestone Markers on Bar */}
          {!isAtMax && (
             <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full flex justify-between px-1 pointer-events-none">
                <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
             </div>
          )}
        </div>

        {/* Labels */}
        <div className="flex justify-between items-center px-1">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Start</span>
            <span className="text-xs font-bold text-gray-800">{prevMilestoneDay}D</span>
          </div>
          
          <div className="flex flex-col items-center">
             <div className={`text-xs font-black px-2 py-0.5 rounded-md border ${progress > 50 ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                {Math.floor(progress)}%
             </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Next</span>
            <span className="text-xs font-bold text-gray-800">{nextMilestone.day}D</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

export default StreakTracker;
