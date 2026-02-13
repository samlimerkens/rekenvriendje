
import React from 'react';
import { PetStats } from '../types';

interface PetDisplayProps {
  stats: PetStats;
  message?: string;
}

const PetDisplay: React.FC<PetDisplayProps> = ({ stats, message }) => {
  const getPetImage = () => {
    switch (stats.stage) {
      case 'master':
        return "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Flappie&backgroundColor=c0aede&eyes=star&mouth=smile01&sides=antenna01";
      case 'adult':
        return "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Flappie&backgroundColor=ffdfbf&eyes=happy&mouth=smile02";
      case 'teen':
        return "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Flappie&backgroundColor=b6e3f4&eyes=joy&mouth=smile01";
      case 'baby':
      default:
        return "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Flappie&backgroundColor=f1f5f9&eyes=round&mouth=bite";
    }
  };

  const getStageColor = () => {
    switch (stats.stage) {
      case 'master': return 'from-purple-400 to-indigo-500 border-indigo-200';
      case 'adult': return 'from-orange-400 to-red-500 border-red-200';
      case 'teen': return 'from-sky-400 to-blue-500 border-blue-200';
      default: return 'from-slate-100 to-slate-200 border-slate-300';
    }
  };

  const statusColor = (val: number) => {
    if (val > 60) return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]';
    if (val > 25) return 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]';
    return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)] animate-pulse';
  };

  return (
    <div className="flex flex-col items-center bg-white p-6 sm:p-8 rounded-3xl shadow-xl border-4 border-sky-200 w-full max-w-sm mx-auto relative overflow-hidden">
      {/* Background Glow based on stage */}
      <div className={`absolute inset-0 bg-gradient-to-b ${getStageColor()} opacity-5`} />

      <div className="relative mb-4 sm:mb-6 z-10">
        <div className={`w-32 h-32 sm:w-48 sm:h-48 rounded-full flex items-center justify-center border-4 overflow-hidden transition-all duration-1000 ${stats.stage === 'master' ? 'bg-indigo-50 border-indigo-200 shadow-2xl scale-110' : 'bg-sky-50 border-sky-100 shadow-inner'}`}>
          <img 
            src={getPetImage()} 
            alt="Pet" 
            className={`w-24 h-24 sm:w-40 sm:h-40 animate-float transition-all duration-700 ${stats.stage === 'master' ? 'brightness-110' : ''}`} 
          />
        </div>
        
        {/* Level Tag */}
        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-yellow-400 text-yellow-900 font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border-2 border-white shadow-md text-sm z-20">
          Lv. {stats.level}
        </div>

        {/* Stage Tag */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-3 py-0.5 rounded-full border border-sky-200 shadow-sm text-[10px] font-black text-sky-600 uppercase tracking-widest z-20">
          {stats.stage}
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-fredoka text-sky-600 mb-1 z-10">{stats.name}</h2>
      
      {message && (
        <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl mb-6 text-sky-800 text-xs sm:text-sm italic relative w-full text-center border border-sky-100 shadow-sm z-10">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-sky-100"></div>
          {message}
        </div>
      )}

      <div className="w-full space-y-3 z-10">
        <div>
          <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-0.5 uppercase tracking-tighter">
            <span>Maaginhoud (Honger)</span>
            <span>{stats.hunger}%</span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div 
              className={`h-full transition-all duration-500 ${statusColor(stats.hunger)}`} 
              style={{ width: `${stats.hunger}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-0.5 uppercase tracking-tighter">
            <span>Blijdschap</span>
            <span>{stats.happiness}%</span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div 
              className={`h-full transition-all duration-500 ${statusColor(stats.happiness)}`} 
              style={{ width: `${stats.happiness}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-0.5 uppercase tracking-tighter">
            <span>Progressie naar volgend Level</span>
            <span>{stats.exp}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-400 transition-all duration-500 relative" 
              style={{ width: `${stats.exp}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDisplay;
