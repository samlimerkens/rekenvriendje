
import React, { useState, useEffect } from 'react';
import { GameState, PetStats, FoodItem, PracticeConfig } from './types';
import { INITIAL_PET_STATS, FOOD_ITEMS } from './constants';
import PetDisplay from './components/PetDisplay';
import MathGame from './components/MathGame';
import Store from './components/Store';
import PracticeSelection from './components/PracticeSelection';
import Inventory from './components/Inventory';
import Celebration from './components/Celebration';
import { getEncouragement } from './services/geminiService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('dashboard');
  const [petStats, setPetStats] = useState<PetStats>(() => {
    const saved = localStorage.getItem('petStats');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.inventory) parsed.inventory = {};
      // Zorg dat we oude stats naar de nieuwe 3 stadia forceren
      if (parsed.stage !== 'baby' && parsed.stage !== 'kleuter' && parsed.stage !== 'kind') {
        parsed.stage = parsed.level < 5 ? 'baby' : parsed.level < 10 ? 'kleuter' : 'kind';
      }
      return parsed;
    }
    return INITIAL_PET_STATS;
  });
  const [petMessage, setPetMessage] = useState<string>("Hoi! Heb je zin om samen te rekenen? 🎋");
  const [showEvolutionOverlay, setShowEvolutionOverlay] = useState(false);
  const [practiceConfig, setPracticeConfig] = useState<PracticeConfig | null>(null);
  
  const [lastResults, setLastResults] = useState<{ correct: number; coins: number; exp: number } | null>(null);

  useEffect(() => {
    localStorage.setItem('petStats', JSON.stringify(petStats));
  }, [petStats]);

  const getStageFromLevel = (level: number): PetStats['stage'] => {
    if (level >= 10) return 'kind';
    if (level >= 5) return 'kleuter';
    return 'baby';
  };

  const resetGame = () => {
    if (window.confirm("Weet je het zeker? Je raakt alle voortgang kwijt!")) {
      setPetStats(INITIAL_PET_STATS);
      setGameState('dashboard');
    }
  };

  const handleStartPractice = (config: PracticeConfig) => {
    setPracticeConfig(config);
    setGameState('practice_game');
  };

  const handlePracticeComplete = async (correctCount: number) => {
    const earnedCoins = 10;
    const earnedExp = correctCount * 15;
    
    setLastResults({ correct: correctCount, coins: earnedCoins, exp: earnedExp });

    setPetStats(prev => {
      let newExp = prev.exp + earnedExp;
      let newLevel = prev.level;
      let newStage = prev.stage;
      
      while (newExp >= 100) {
        newLevel += 1;
        newExp -= 100;
        
        const calculatedStage = getStageFromLevel(newLevel);
        if (calculatedStage !== newStage) {
          newStage = calculatedStage;
          setShowEvolutionOverlay(true);
          setTimeout(() => setShowEvolutionOverlay(false), 3000);
        }
      }
      
      return {
        ...prev,
        level: newLevel,
        exp: newExp,
        stage: newStage,
        coins: prev.coins + earnedCoins,
        hunger: Math.max(0, prev.hunger - 10),
        happiness: Math.min(100, prev.happiness + (correctCount * 2)),
      };
    });

    const perf = correctCount >= 8 ? 'great' : correctCount >= 5 ? 'good' : 'retry';
    getEncouragement(petStats.name, petStats.level, perf).then(msg => setPetMessage(msg));
    
    setGameState('celebration');
  };

  const handleBuyItem = (item: FoodItem) => {
    if (petStats.coins < item.cost) return;
    setPetStats(prev => ({
      ...prev,
      coins: prev.coins - item.cost,
      inventory: { ...prev.inventory, [item.id]: (prev.inventory[item.id] || 0) + 1 }
    }));
  };

  const handleFeedPet = (itemId: string) => {
    const item = FOOD_ITEMS.find(f => f.id === itemId);
    if (!item || !petStats.inventory[itemId]) return;

    setPetStats(prev => {
      const newInventory = { ...prev.inventory };
      newInventory[itemId] -= 1;
      if (newInventory[itemId] <= 0) delete newInventory[itemId];
      return {
        ...prev,
        inventory: newInventory,
        hunger: Math.min(100, prev.hunger + item.hungerValue),
        happiness: Math.min(100, prev.happiness + item.happinessValue),
      };
    });
    setPetMessage("Mmm, lekker hoor! Dankjewel! 🎋✨");
  };

  return (
    <div className="min-h-screen pb-14 pt-1 px-3 flex flex-col items-center max-w-full overflow-x-hidden relative bg-[#f7fff7]">
      {showEvolutionOverlay && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-emerald-600/95 backdrop-blur-md animate-in fade-in duration-500">
          <div className="text-9xl mb-4 animate-bounce drop-shadow-2xl">🐼✨</div>
          <h2 className="text-5xl font-fredoka text-white text-center drop-shadow-md uppercase">Wauw!</h2>
          <p className="text-2xl text-white font-bold mt-4 bg-white/20 px-6 py-2 rounded-full border border-white/30">
            {petStats.name} is gegroeid naar {petStats.stage}!
          </p>
        </div>
      )}

      {gameState === 'celebration' && lastResults && (
        <Celebration 
          correctCount={lastResults.correct} 
          earnedCoins={lastResults.coins}
          earnedExp={lastResults.exp}
          onClose={() => setGameState('dashboard')} 
        />
      )}

      <header className="mb-4 w-full max-w-md px-2 flex items-center justify-between mt-2">
        <button onClick={resetGame} className="text-emerald-300 text-[10px] font-black uppercase tracking-widest hover:text-emerald-500 transition-colors">Reset</button>
        <h1 className="text-2xl font-fredoka text-emerald-600 tracking-tight drop-shadow-sm">RekenVriendje</h1>
        <div className="bg-emerald-100 px-3 py-1 rounded-full border-2 border-emerald-200 flex items-center gap-2 shadow-sm">
          <span className="text-sm">💰</span>
          <span className="font-fredoka text-emerald-700 text-sm">{petStats.coins}</span>
        </div>
      </header>

      <main className="w-full max-w-md flex flex-col items-center gap-4">
        {gameState === 'dashboard' && (
          <>
            <PetDisplay stats={petStats} message={petMessage} />
            <Inventory inventory={petStats.inventory} onFeed={handleFeedPet} />
          </>
        )}

        {gameState === 'practice_selection' && (
          <PracticeSelection onSelect={handleStartPractice} onCancel={() => setGameState('dashboard')} />
        )}

        {gameState === 'practice_game' && practiceConfig && (
          <MathGame config={practiceConfig} onComplete={handlePracticeComplete} onCancel={() => setGameState('practice_selection')} />
        )}

        {gameState === 'store' && (
          <Store coins={petStats.coins} onBuy={handleBuyItem} onClose={() => setGameState('dashboard')} />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t-2 border-emerald-100 flex justify-around p-2 pb-3 z-50 shadow-[0_-5px_20px_rgba(16,185,129,0.1)]">
        <NavBtn active={gameState === 'dashboard' || gameState === 'celebration'} onClick={() => setGameState('dashboard')} icon="🏠" label="HUIS" />
        <NavBtn active={gameState.includes('practice')} onClick={() => setGameState('practice_selection')} icon="🧠" label="OEFENEN" />
        <NavBtn active={gameState === 'store'} onClick={() => setGameState('store')} icon="🛒" label="WINKEL" />
      </nav>
    </div>
  );
};

const NavBtn = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: string, label: string }) => (
  <button onClick={onClick} className={`flex flex-col items-center px-6 transition-all duration-300 ${active ? 'text-emerald-500 scale-110' : 'text-emerald-200 opacity-60'}`}>
    <span className="text-2xl mb-1">{icon}</span>
    <span className="text-[8px] font-black tracking-[0.2em]">{label}</span>
  </button>
);

export default App;
