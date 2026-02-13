
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
      return parsed;
    }
    return { ...INITIAL_PET_STATS, stage: 'baby', inventory: {} };
  });
  const [petMessage, setPetMessage] = useState<string>("Hoi! Zullen we gaan rekenen?");
  const [showEvolutionOverlay, setShowEvolutionOverlay] = useState(false);
  const [practiceConfig, setPracticeConfig] = useState<PracticeConfig | null>(null);
  
  // Tijdelijke opslag voor resultaten van de laatste sessie
  const [lastResults, setLastResults] = useState<{ correct: number; coins: number; exp: number } | null>(null);

  useEffect(() => {
    localStorage.setItem('petStats', JSON.stringify(petStats));
  }, [petStats]);

  const getStageFromLevel = (level: number): PetStats['stage'] => {
    if (level >= 30) return 'volwassene';
    if (level >= 25) return 'jeugd';
    if (level >= 20) return 'tiener';
    if (level >= 15) return 'kind';
    if (level >= 10) return 'kleuter';
    if (level >= 5) return 'peuter';
    return 'baby';
  };

  const resetGame = () => {
    if (window.confirm("Weet je het zeker? Je raakt alle voortgang kwijt!")) {
      setPetStats({ ...INITIAL_PET_STATS, stage: 'baby', inventory: {} });
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
    
    // Sla resultaten op voor het Celebration scherm
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

    // Haal alvast een berichtje op van de Gemini AI
    const perf = correctCount >= 8 ? 'great' : correctCount >= 5 ? 'good' : 'retry';
    getEncouragement(petStats.name, petStats.level, perf).then(msg => setPetMessage(msg));
    
    // Toon het feestscherm!
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
  };

  return (
    <div className="min-h-screen pb-14 pt-1 px-3 flex flex-col items-center max-w-full overflow-x-hidden relative bg-sky-50">
      {showEvolutionOverlay && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-sky-600/95 backdrop-blur-md">
          <div className="text-7xl mb-4 animate-bounce">🐼✨</div>
          <h2 className="text-4xl font-fredoka text-white text-center">GEWELDIG!</h2>
          <p className="text-xl text-white font-bold mt-2">{petStats.name} groeit naar {petStats.stage}!</p>
        </div>
      )}

      {/* Celebration Scherm Overlay */}
      {gameState === 'celebration' && lastResults && (
        <Celebration 
          correctCount={lastResults.correct} 
          earnedCoins={lastResults.coins}
          earnedExp={lastResults.exp}
          onClose={() => setGameState('dashboard')} 
        />
      )}

      <header className="mb-2 w-full max-w-md px-2 flex items-center justify-between">
        <button onClick={resetGame} className="text-slate-300 text-[8px] font-black uppercase tracking-tighter">Reset</button>
        <h1 className="text-lg font-fredoka text-sky-600 tracking-tight">RekenVriendje</h1>
        <div className="bg-yellow-100 px-2 py-0.5 rounded-full border border-yellow-200 flex items-center gap-1 shadow-sm">
          <span className="text-xs">💰</span>
          <span className="font-black text-yellow-700 text-xs">{petStats.coins}</span>
        </div>
      </header>

      <main className="w-full max-w-md flex flex-col items-center gap-3">
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

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 flex justify-around p-1 pb-2 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
        <NavBtn active={gameState === 'dashboard' || gameState === 'celebration'} onClick={() => setGameState('dashboard')} icon="🏠" label="HUIS" />
        <NavBtn active={gameState.includes('practice')} onClick={() => setGameState('practice_selection')} icon="🧠" label="OEFENEN" />
        <NavBtn active={gameState === 'store'} onClick={() => setGameState('store')} icon="🛒" label="WINKEL" />
      </nav>
    </div>
  );
};

const NavBtn = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: string, label: string }) => (
  <button onClick={onClick} className={`flex flex-col items-center px-4 transition-all duration-300 ${active ? 'text-sky-500 scale-110' : 'text-slate-400 opacity-70'}`}>
    <span className="text-xl mb-0.5">{icon}</span>
    <span className="text-[7px] font-black tracking-widest">{label}</span>
  </button>
);

export default App;
