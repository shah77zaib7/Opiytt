
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
// Added base chain import to satisfy strict typing in writeContract
import { base } from 'wagmi/chains';
import { CONTRACT_ADDRESS, CONTRACT_ABI, SOUND_CLICK, SOUND_SUCCESS, MILESTONES, SOUND_UNLOCKED } from './constants';
import { useAudio } from './hooks/useAudio';
import BadgeDisplay from './components/BadgeDisplay';
import StreakTracker from './components/StreakTracker';
import RewardGallery from './components/RewardGallery';

type ViewState = 'home' | 'rewards';

const App: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [activeView, setActiveView] = useState<ViewState>('home');
  const playClick = useAudio(SOUND_CLICK);
  const playSuccess = useAudio(SOUND_SUCCESS);
  const playUnlocked = useAudio(SOUND_UNLOCKED);
  
  const [celebrationMsg, setCelebrationMsg] = useState<{title: string, msg: string} | null>(null);

  // Read Streak Count
  const { data: streakCountData, refetch: refetchStreak } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'streakCount',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  });

  const streak = useMemo(() => streakCountData ? Number(streakCountData) : 0, [streakCountData]);

  // Mint Action
  const { data: hash, writeContract, isPending: isMinting } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const triggerConfetti = useCallback(() => {
    // @ts-ignore
    if (window.confetti) {
      // @ts-ignore
      window.confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0052FF', '#FFFFFF', '#60A5FA']
      });
    }
  }, []);

  const handleMint = useCallback(() => {
    playClick();
    // Fixed: Added address check and explicit parameters for writeContract to resolve missing 'chain' and 'account' type errors
    if (!isConnected || !address) return;
    
    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'checkIn',
      account: address,
      chain: base,
    });
  }, [isConnected, address, writeContract, playClick]);

  // Handle Success & Milestones
  useEffect(() => {
    if (isConfirmed) {
      playSuccess();
      refetchStreak();
      
      const milestoneHit = MILESTONES.find(m => m.day === streak);
      if (milestoneHit) {
        setCelebrationMsg({
          title: 'LEVEL UP!',
          msg: `Unlocked ${milestoneHit.label} ${milestoneHit.emoji}`
        });
        playUnlocked();
        triggerConfetti();
      } else {
        triggerConfetti();
      }
    }
  }, [isConfirmed, streak, refetchStreak, playSuccess, playUnlocked, triggerConfetti]);

  // Clear celebration message
  useEffect(() => {
    if (celebrationMsg) {
      const timer = setTimeout(() => setCelebrationMsg(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [celebrationMsg]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#F8FAFC] text-gray-900 font-sans">
      {/* Header */}
      <header className="w-full flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0052FF] rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <span className="text-white font-black text-xl italic">B</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-gray-900 leading-none">STREAK<span className="text-[#0052FF]">BASE</span></span>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Mainnet Edition</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Wallet>
            <ConnectWallet className="!bg-[#0052FF] !text-white !rounded-xl !h-10 !px-4 hover:!bg-blue-600 transition-colors shadow-sm" />
          </Wallet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl flex flex-col items-center py-10 px-6 space-y-10">
        {celebrationMsg && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] animate-bounce w-full max-w-sm px-4">
            <div className="bg-[#0052FF] text-white px-8 py-5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,82,255,0.3)] font-black text-xl flex flex-col items-center text-center gap-1 border-4 border-white">
              <span className="text-xs uppercase tracking-[0.3em] opacity-80 mb-1">{celebrationMsg.title}</span>
              <span className="text-2xl">{celebrationMsg.msg}</span>
            </div>
          </div>
        )}

        {isConnected && (
          <nav className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
            <button 
              onClick={() => { playClick(); setActiveView('home'); }}
              className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${activeView === 'home' ? 'bg-[#0052FF] text-white shadow-lg shadow-blue-100' : 'text-gray-400 hover:text-gray-600'}`}
            >
              DASHBOARD
            </button>
            <button 
              onClick={() => { playClick(); setActiveView('rewards'); }}
              className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${activeView === 'rewards' ? 'bg-[#0052FF] text-white shadow-lg shadow-blue-100' : 'text-gray-400 hover:text-gray-600'}`}
            >
              REWARDS
            </button>
          </nav>
        )}

        {!isConnected ? (
          <div className="text-center space-y-8 mt-12 animate-fade-in py-20 bg-white w-full rounded-[3rem] shadow-xl border border-gray-50 max-w-xl">
            <div className="relative inline-block">
              <div className="text-8xl animate-pulse">🗓️</div>
              <div className="absolute -top-4 -right-4 bg-yellow-400 w-12 h-12 rounded-full flex items-center justify-center text-2xl border-4 border-white shadow-lg">✨</div>
            </div>
            <div className="space-y-4 px-10">
              <h1 className="text-4xl font-black text-gray-900 leading-tight">Your Onchain Ritual Starts Here</h1>
              <p className="text-gray-500 font-medium leading-relaxed">
                Connect your wallet to start building your streak and unlock exclusive onchain rewards on Base.
              </p>
            </div>
            <div className="flex justify-center">
              <Wallet>
                <ConnectWallet className="!h-16 !px-12 !rounded-[2rem] !text-xl !font-black shadow-2xl hover:scale-105 transition-transform" />
              </Wallet>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center space-y-12">
            {activeView === 'home' ? (
              <>
                <div className="text-center space-y-2">
                  <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight">Active Streak</h1>
                  <p className="text-gray-400 font-semibold tracking-wide">Daily check-in for non-transferable status</p>
                </div>

                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                  <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-50 flex flex-col items-center justify-center">
                    <BadgeDisplay streak={streak} />
                  </div>
                  
                  <div className="space-y-10">
                    <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-50">
                      <StreakTracker streak={streak} />
                    </div>

                    <div className="w-full">
                      <button
                        onClick={handleMint}
                        disabled={isMinting || isConfirming}
                        className={`w-full py-8 rounded-[2.5rem] font-black text-2xl transition-all shadow-2xl active:scale-95 disabled:opacity-50 flex flex-col items-center justify-center gap-1 group ${
                          isMinting || isConfirming 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-[#0052FF] text-white hover:bg-blue-600 hover:shadow-blue-200'
                        }`}
                      >
                        {isMinting || isConfirming ? (
                          <div className="flex items-center gap-4">
                            <svg className="animate-spin h-8 w-8 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Processing...</span>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-3">
                              <span>MINT DAILY BADGE</span>
                              <span className="text-3xl group-hover:rotate-12 transition-transform">⚡</span>
                            </div>
                            <span className="text-[10px] font-bold opacity-60 tracking-[0.2em]">REQUIRES GAS ON BASE</span>
                          </>
                        )}
                      </button>
                      
                      <p className="text-center mt-6 text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
                        Non-Transferable Soulbound Asset
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <RewardGallery currentStreak={streak} />
            )}
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="w-full max-w-4xl py-12 px-6 border-t border-gray-100 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">?</div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-gray-900 uppercase tracking-wider">How it works</span>
              <span className="text-[10px] text-gray-400 font-semibold max-w-[200px]">Check in once every 24 hours to maintain your streak. Missing a day resets your count!</span>
            </div>
          </div>
          
          <div className="flex gap-4">
            {MILESTONES.map(m => (
              <div key={m.day} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${streak >= m.day ? 'bg-blue-50 border-blue-100 text-[#0052FF]' : 'bg-gray-50 border-gray-100 text-gray-300'}`}>
                {m.day}D {m.emoji}
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
