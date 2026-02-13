
import React from 'react';
import { PetStats } from '../types';

interface PetDisplayProps {
  stats: PetStats;
  message?: string;
}

const PetDisplay: React.FC<PetDisplayProps> = ({ stats, message }) => {
  // We gaan ervan uit dat de gebruiker de geüploade afbeelding heeft opgeslagen als 'pandas.png'
  const pandasImgUrl = "./pandas.png";
  
  // Logica om te bepalen welke panda uit de afbeelding we tonen
  // De afbeelding heeft 3 panda's: Kind (Links), Kleuter (Midden), Baby (Rechts)
  const getPandaPosition = () => {
    switch (stats.stage) {
      case 'volwassene':
      case 'jeugd':
      case 'tiener':
      case 'kind':
        return { pos: '0%', scale: 'scale-110' }; // Linker panda (Kind/Groot)
      case 'kleuter':
      case 'peuter':
        return { pos: '50%', scale: 'scale-100' }; // Middelste panda (Kleuter)
      case 'baby':
      default:
        return { pos: '100%', scale: 'scale-90' }; // Rechter panda (Baby)
    }
  };

  const { pos, scale } = getPandaPosition();

  const getStageColor = () => {
    switch (stats.stage) {
      case 'volwassene': return 'from-emerald-100 to-teal-50 border-teal-200';
      case 'jeugd': return 'from-blue-100 to-sky-50 border-sky-200';
      case 'tiener': return 'from-purple-100 to-fuchsia-50 border-fuchsia-200';
      case 'kind': return 'from-green-100 to-lime-50 border-lime-200';
      case 'kleuter': return 'from-yellow-100 to-orange-50 border-orange-200';
      case 'peuter': return 'from-pink-100 to-rose-50 border-rose-200';
      default: return 'from-slate-50 to-emerald-50 border-emerald-100';
    }
  };

  const statusColor = (val: number) => {
    if (val > 60) return 'bg-emerald-400';
    if (val > 25) return 'bg-amber-400';
    return 'bg-rose-400 animate-pulse';
  };

  return (
    <div className={`flex flex-col items-center p-5 rounded-[2.5rem] shadow-xl border-4 w-full transition-all duration-700 bg-gradient-to-b ${getStageColor()}`}>
      <div className="relative mb-6 mt-4 w-48 h-48 flex items-center justify-center overflow-hidden">
        {/* Glow effect achter de panda */}
        <div className="absolute inset-0 bg-white/40 blur-3xl rounded-full scale-110"></div>
        
        {/* De 'Sprite' container die de juiste panda uitsnijdt */}
        <div className={`relative w-40 h-40 transition-all duration-1000 ease-out ${scale} flex items-center justify-center`}>
          <div className="w-full h-full overflow-hidden flex items-center justify-center">
             <img 
              src={pandasImgUrl} 
              alt="Mijn Panda" 
              className="h-full max-w-none animate-float drop-shadow-xl"
              style={{
                width: '300%', // Omdat er 3 panda's naast elkaar staan
                objectFit: 'cover',
                objectPosition: `${pos} center`
              }}
              onError={(e) => {
                // Als pandas.png niet gevonden wordt, tonen we een placeholder emoji
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) parent.innerHTML = '<span class="text-8xl">🐼</span>';
              }}
            />
          </div>
        </div>
        
        {/* Level Badge */}
        <div className="absolute top-0 right-0 bg-emerald-500 text-white font-fredoka px-3 py-1 rounded-full border-4 border-white text-sm shadow-lg z-20">
          LVL {stats.level}
        </div>

        {/* Stage Label */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full border-2 border-emerald-100 text-[10px] font-black text-emerald-600 uppercase shadow-md tracking-widest z-20">
          {stats.stage}
        </div>
      </div>

      <h2 className="text-2xl font-fredoka text-emerald-800 mb-2">{stats.name} 🐼</h2>
      
      {message && (
        <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl mb-4 text-xs leading-snug italic text-emerald-900 text-center w-full border border-white shadow-sm">
          "{message}"
        </div>
      )}

      <div className="w-full space-y-3 bg-white/40 p-3 rounded-2xl border border-white/50">
        <StatBar label="Honger" value={stats.hunger} colorClass={statusColor(stats.hunger)} emoji="🎋" />
        <StatBar label="Geluk" value={stats.happiness} colorClass={statusColor(stats.happiness)} emoji="❤️" />
        <StatBar label="XP" value={stats.exp} colorClass="bg-emerald-500" emoji="✨" />
      </div>
    </div>
  );
};

const StatBar = ({ label, value, colorClass, emoji }: { label: string, value: number, colorClass: string, emoji: string }) => (
  <div className="w-full">
    <div className="flex justify-between text-[9px] font-black text-emerald-800/60 uppercase mb-1 px-1 items-center">
      <span className="flex items-center gap-1">{emoji} {label}</span>
      <span>{Math.round(value)}%</span>
    </div>
    <div className="h-2.5 bg-white/60 rounded-full overflow-hidden border border-white shadow-inner">
      <div 
        className={`h-full transition-all duration-1000 ease-out shadow-sm ${colorClass}`} 
        style={{ width: `${value}%` }} 
      />
    </div>
  </div>
);

export default PetDisplay;
