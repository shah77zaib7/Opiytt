
export const CONTRACT_ADDRESS = '0x7955f570ad25b82ceCC44947e4d632c029A0689e';

export const CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "checkIn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "streakCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "lastCheckIn",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const SOUND_CLICK = 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3';
export const SOUND_SUCCESS = 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3';
export const SOUND_UNLOCKED = 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3';

export interface Milestone {
  day: number;
  label: string;
  emoji: string;
  color: string;
  description: string;
  perks: string[];
  rarity: 'Common' | 'Rare' | 'Legendary' | 'Epic';
}

export const MILESTONES: Milestone[] = [
  { 
    day: 7, 
    label: 'Bronze Pathfinder', 
    emoji: '🥉', 
    color: 'from-orange-400 to-orange-700',
    description: 'You have shown consistency. You are now a Pathfinder of the Base ecosystem.',
    perks: ['Exclusive Discord Role', '1.1x Streak Multiplier (Visual)', 'Early Access to Tier 2'],
    rarity: 'Common'
  },
  { 
    day: 30, 
    label: 'Silver Sentinel', 
    emoji: '🥈', 
    color: 'from-slate-300 to-slate-500',
    description: 'A full month of dedication. Your presence is etched into the block history.',
    perks: ['Priority Minting', '1.5x Streak Multiplier (Visual)', 'Sentinel Badge NFT Metadata'],
    rarity: 'Rare'
  },
  { 
    day: 100, 
    label: 'Gold Sovereign', 
    emoji: '🥇', 
    color: 'from-yellow-300 to-yellow-600',
    description: 'Centurion of Base. You are among the elite 1% of daily active users.',
    perks: ['Governance Voting Rights', '2.0x Streak Multiplier (Visual)', 'Legendary Physical Merch Eligibility'],
    rarity: 'Legendary'
  }
];
