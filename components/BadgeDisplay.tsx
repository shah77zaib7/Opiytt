
import React from 'react';

interface BadgeDisplayProps {
  streak: number;
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ streak }) => {
  let badgeIcon = '🛡️';
  let badgeTitle = 'Novice Badge';
  let badgeClass = 'bg-gray-100 text-gray-400';

  if (streak >= 100) {
    badgeIcon = '🥇';
    badgeTitle = 'Legendary Gold';
    badgeClass = 'bg-yellow-100 text-yellow-600 border-yellow-300';
  } else if (streak >= 30) {
    badgeIcon = '🥈';
    badgeTitle = 'Rare Silver';
    badgeClass = 'bg-slate-100 text-slate-600 border-slate-300';
  } else if (streak >= 7) {
    badgeIcon = '🥉';
    badgeTitle = 'Special Bronze';
    badgeClass = 'bg-orange-100 text-orange-600 border-orange-300';
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`w-40 h-40 rounded-full border-4 flex items-center justify-center text-8xl shadow-xl transition-all duration-500 ${badgeClass}`}>
        {badgeIcon}
      </div>
      <h2 className="mt-6 text-2xl font-bold text-gray-800">{badgeTitle}</h2>
      <p className="text-gray-500">Unlocked at {streak >= 100 ? 100 : streak >= 30 ? 30 : streak >= 7 ? 7 : 0} days</p>
    </div>
  );
};

export default BadgeDisplay;
