
import React, { useEffect } from 'react';

interface CelebrationProps {
  correctCount: number;
  earnedCoins: number;
  earnedExp: number;
  onClose: () => void;
}

const Celebration: React.FC<CelebrationProps> = ({ correctCount, earnedCoins, earnedExp, onClose }) => {
  useEffect(() => {
    // Geluidje zou hier kunnen, maar we houden het bij visuals
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-sky-500/90 backdrop-blur-sm p-6 overflow-hidden">
      {/* Confetti Emojis Animatie */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute text-2xl animate-fall"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          >
            {['✨', '🎉', '🌟', '🎊', '🎈'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-[3rem] shadow-2xl border-4 border-yellow-300 text-center max-w-sm w-full animate-in zoom-in-75 duration-500 relative z-10">
        <div className="text-7xl mb-4 animate-bounce">🏆</div>
        
        <h2 className="text-3xl font-fredoka text-sky-600 mb-2">GEWELDIG!</h2>
        <p className="text-slate-500 font-bold mb-6 italic">Je hebt de oefening afgemaakt!</p>

        <div className="space-y-4 mb-8">
          <div className="bg-green-50 p-3 rounded-2xl border-2 border-green-100 flex items-center justify-between px-6">
            <span className="font-black text-green-600">SCORE</span>
            <span className="font-fredoka text-xl text-green-700">{correctCount} / 10 goed</span>
          </div>

          <div className="bg-yellow-50 p-3 rounded-2xl border-2 border-yellow-100 flex items-center justify-between px-6">
            <span className="font-black text-yellow-600">BELONING</span>
            <div className="flex items-center gap-2">
              <span className="text-xl">💰</span>
              <span className="font-fredoka text-xl text-yellow-700">+{earnedCoins} munten</span>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-2xl border-2 border-blue-100 flex items-center justify-between px-6">
            <span className="font-black text-blue-600">ERVARING</span>
            <span className="font-fredoka text-xl text-blue-700">+{earnedExp} XP</span>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-4 bg-sky-500 hover:bg-sky-600 text-white font-fredoka text-xl rounded-2xl shadow-lg transform active:scale-95 transition-all"
        >
          Terug naar huis 🏠
        </button>
      </div>

      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Celebration;
