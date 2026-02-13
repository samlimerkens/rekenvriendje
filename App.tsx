
import React, { useState, useEffect } from 'react';
import { GameState, PetStats, FoodItem, PracticeConfig } from './types';
import { INITIAL_PET_STATS, FOOD_ITEMS } from './constants';
import PetDisplay from './components/PetDisplay';
import MathGame from './components/MathGame';
import Store from './components/Store';
import PracticeSelection from './components/PracticeSelection';
import Inventory from './components/Inventory';
import { getEncouragement } from './services/geminiService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('dashboard');
  const [petStats, setPetStats] = useState<PetStats>(() => {
    const saved = localStorage.getItem('petStats');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.inventory) parsed.inventory = {};
      return parsed;
    }
    return { ...INITIAL_PET_STATS, stage: 'baby', inventory: {} };
  });
  const [petMessage, setPetMessage] = useState<string>("Hoi! Zullen we gaan rekenen?");
  const [showEvolutionOverlay, setShowEvolutionOverlay] = useState(false);
  const [practiceConfig, setPracticeConfig] = useState<PracticeConfig | null>(null);

  useEffect(() => {
    localStorage.setItem('petStats', JSON.stringify(petStats));
  }, [petStats]);

  const getStageFromLevel = (level: number): 'baby' | 'teen' | 'adult' | 'master' => {
    if (level >= 25) return 'master';
    if (level >= 15) return 'adult';
    if (level >= 5) return 'teen';
    return 'baby';
  };

  const resetGame = () => {
    if (window.confirm("Weet je het zeker? Je raakt alle voortgang en je huisdier kwijt!")) {
      setPetStats({ ...INITIAL_PET_STATS, stage: 'baby', inventory: {} });
      setPetMessage("Hoi! Ik ben nieuw hier. Zullen we rekenen?");
      setGameState('dashboard');
    }
  };

  const handleStartPractice = (config: PracticeConfig) => {
    setPracticeConfig(config);
    setGameState('practice_game');
  };

  const handlePracticeComplete = async (correctCount: number) => {
    const earnedCoins = correctCount * 5;
    const earnedExp = correctCount * 15;
    
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
          setTimeout(() => setShowEvolutionOverlay(false), 4000);
        }
      }
      
      return {
        ...prev,
        level: newLevel,
        exp: newExp,
        stage: newStage,
        coins: prev.coins + earnedCoins,
        hunger: Math.max(0, prev.hunger - 12),
        happiness: Math.min(100, prev.happiness + (correctCount * 3)),
      };
    });

    const perf = correctCount >= 7 ? 'great' : correctCount >= 4 ? 'good' : 'retry';
    const msg = await getEncouragement(petStats.name, petStats.level, perf);
    setPetMessage(msg);
    setGameState('dashboard');
  };

  const handleBuyItem = (item: FoodItem) => {
    if (petStats.coins < item.cost) return;

    setPetStats(prev => ({
      ...prev,
      coins: prev.coins - item.cost,
      inventory: {
        ...prev.inventory,
        [item.id]: (prev.inventory[item.id] || 0) + 1
      }
    }));
    setPetMessage(`Gekocht! Die ${item.name} zit in je rugzak. 🎒`);
  };

  const handleFeedPet = (itemId: string) => {
    const item = FOOD_ITEMS.find(f => f.id === itemId);
    if (!item || !petStats.inventory[itemId] || petStats.inventory[itemId] <= 0) return;

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
    setPetMessage(`Nom nom nom! ${item.emoji} was heerlijk!`);
  };

  return (
    <div className="min-h-screen pb-24 pt-4 px-3 flex flex-col items-center max-w-full overflow-x-hidden relative">
      {showEvolutionOverlay && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-sky-600/90 backdrop-blur-sm animate-in fade-in duration-500">
          <div className="text-6xl mb-4 animate-bounce">✨ ✨ ✨</div>
          <h2 className="text-4xl font-fredoka text-white text-center px-6">
            WAUW! {petStats.name} is gegroeid naar de {petStats.stage} fase!
          </h2>
          <div className="mt-8 text-2xl text-yellow-300 font-bold animate-pulse">
            Je bent een echte reken-expert!
          </div>
        </div>
      )}

      <header className="mb-6 w-full max-w-md px-4 flex items-center justify-between">
        <button onClick={resetGame} className="text-slate-300 hover:text-red-400 text-xs font-bold w-12 text-left">
          Reset
        </button>
        <div className="text-center flex-1">
          <h1 className="text-2xl sm:text-3xl font-fredoka text-sky-600 leading-none">RekenVriendje</h1>
        </div>
        <div className="bg-yellow-100 px-3 py-1.5 rounded-full border-2 border-yellow-200 shadow-sm flex items-center gap-1.5 w-max">
          <span className="text-lg">💰</span>
          <span className="font-bold text-yellow-700 text-sm sm:text-base">{petStats.coins}</span>
        </div>
      </header>

      <main className="w-full max-w-4xl flex flex-col items-center gap-4 sm:gap-6">
        {gameState === 'dashboard' && (
          <div className="flex flex-col lg:flex-row gap-6 w-full items-start justify-center px-2">
            {/* Linkerkant: Het Huisdier */}
            <div className="w-full max-w-sm animate-in zoom-in-95 duration-300">
              <PetDisplay stats={petStats} message={petMessage} />
            </div>
            
            {/* Rechterkant: De Rugzak (Inventory) */}
            <div className="w-full max-w-sm">
               <Inventory inventory={petStats.inventory} onFeed={handleFeedPet} />
            </div>
          </div>
        )}

        {gameState === 'practice_selection' && (
          <PracticeSelection onSelect={handleStartPractice} onCancel={() => setGameState('dashboard')} />
        )}

        {gameState === 'practice_game' && practiceConfig && (
          <MathGame 
            config={practiceConfig}
            onComplete={handlePracticeComplete} 
            onCancel={() => setGameState('practice_selection')} 
          />
        )}

        {gameState === 'store' && (
          <Store 
            coins={petStats.coins} 
            onBuy={handleBuyItem} 
            onClose={() => setGameState('dashboard')} 
          />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 flex justify-around p-3 pb-8 sm:pb-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-50">
        <button 
          onClick={() => setGameState('dashboard')}
          className={`flex flex-col items-center px-6 transition-all transform ${gameState === 'dashboard' ? 'text-sky-500 scale-110' : 'text-slate-400 hover:text-sky-300 active:scale-90'}`}
        >
          <span className="text-2xl sm:text-3xl">🏠</span>
          <span className="text-[10px] font-bold mt-1">HUIS</span>
        </button>
        <button 
          onClick={() => setGameState('practice_selection')}
          className={`flex flex-col items-center px-6 transition-all transform ${gameState.includes('practice') ? 'text-sky-500 scale-110' : 'text-slate-400 hover:text-sky-300 active:scale-90'}`}
        >
          <span className="text-2xl sm:text-3xl">🧠</span>
          <span className="text-[10px] font-bold mt-1">OEFENEN</span>
        </button>
        <button 
          onClick={() => setGameState('store')}
          className={`flex flex-col items-center px-6 transition-all transform ${gameState === 'store' ? 'text-sky-500 scale-110' : 'text-slate-400 hover:text-sky-300 active:scale-90'}`}
        >
          <span className="text-2xl sm:text-3xl">🛒</span>
          <span className="text-[10px] font-bold mt-1">WINKEL</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
