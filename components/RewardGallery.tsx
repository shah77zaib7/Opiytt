
import React, { useMemo } from 'react';
import { MILESTONES } from '../constants';

interface RewardGalleryProps {
  currentStreak: number;
}

const RewardGallery: React.FC<RewardGalleryProps> = ({ currentStreak }) => {
  // Count how many milestones are unlocked to use as a key for re-triggering animations
  const unlockedCount = useMemo(() => 
    MILESTONES.filter(m => currentStreak >= m.day).length, 
    [currentStreak]
  );

  return (
    <div className="w-full space-y-8">
      <div className="text-center animate-fade-in">
        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Reward Vault</h2>
        <p className="text-gray-500 text-sm">Track your path to legendary status</p>
      </div>

      {/* 
        The key={unlockedCount} ensures the entire grid re-animates 
        whenever a new milestone is unlocked.
      */}
      <div 
        key={unlockedCount} 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {MILESTONES.map((milestone, index) => {
          const isUnlocked = currentStreak >= milestone.day;
          const isJustUnlocked = currentStreak === milestone.day;
          
          // Apply staggered animation delay
          const delayClass = index === 0 ? 'delay-100' : index === 1 ? 'delay-200' : 'delay-300';
          
          return (
            <div 
              key={milestone.day}
              className={`relative overflow-hidden rounded-3xl border-2 transition-all duration-700 p-6 flex flex-col items-center text-center space-y-4 shadow-sm animate-card-pop ${delayClass} ${
                isUnlocked 
                  ? `bg-white border-[#0052FF] shadow-blue-100 unlocked-glow ${isJustUnlocked ? 'scale-105 ring-4 ring-blue-100' : 'scale-100'}` 
                  : 'bg-gray-50 border-gray-100 opacity-60 grayscale scale-[0.98]'
              }`}
            >
              {!isUnlocked && (
                <div className="absolute inset-0 bg-gray-900/5 flex items-center justify-center backdrop-blur-[1px] z-10">
                  <span className="bg-white/90 px-3 py-1 rounded-full text-[10px] font-black uppercase text-gray-500 tracking-widest border border-gray-200">
                    Locked
                  </span>
                </div>
              )}
              
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl bg-gradient-to-br ${milestone.color} shadow-lg text-white transition-transform duration-500 ${isUnlocked ? 'rotate-0' : '-rotate-6'}`}>
                {milestone.emoji}
              </div>

              <div>
                <h3 className="font-extrabold text-gray-900 text-lg leading-tight">{milestone.label}</h3>
                <span className={`text-[10px] font-black uppercase tracking-widest ${isUnlocked ? 'text-[#0052FF]' : 'text-gray-400'}`}>
                  {milestone.rarity} • {milestone.day} Days
                </span>
              </div>

              <div className="w-full space-y-2 pt-2 border-t border-gray-100">
                {milestone.perks.map((perk, i) => (
                  <div key={i} className="flex items-center gap-2 text-left">
                    <span className={`text-[10px] ${isUnlocked ? 'text-[#0052FF]' : 'text-gray-300'}`}>✦</span>
                    <span className="text-[11px] font-semibold text-gray-600 leading-tight">{perk}</span>
                  </div>
                ))}
              </div>

              {/* Subtle background shimmer for unlocked cards */}
              {isUnlocked && (
                <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] pointer-events-none group-hover:left-[150%] transition-all duration-1000" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RewardGallery;
