
import React from 'react';
import { PetStats } from '../types';

interface PetDisplayProps {
  stats: PetStats;
  message?: string;
}

const PetDisplay: React.FC<PetDisplayProps> = ({ stats, message }) => {
  const getPetImage = () => {
    const base = "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Panda";
    
    // We passen de Dicebear parameters aan per fase om de panda te laten groeien
    switch (stats.stage) {
      case 'volwassene': 
        return `${base}&backgroundColor=c0aede&eyes=star&mouth=smile01&sides=antenna01&texture=dots`;
      case 'jeugd': 
        return `${base}&backgroundColor=ffdfbf&eyes=happy&mouth=smile02&sides=antenna02`;
      case 'tiener': 
        return `${base}&backgroundColor=b6e3f4&eyes=shades&mouth=smile01&sides=antenna01`;
      case 'kind': 
        return `${base}&backgroundColor=d1f4ff&eyes=round&mouth=smile01&sides=round01`;
      case 'kleuter': 
        return `${base}&backgroundColor=fdf4ff&eyes=wink&mouth=smile01`;
      case 'peuter': 
        return `${base}&backgroundColor=f1f5f9&eyes=round&mouth=smile01`;
      case 'baby':
      default:
        return `${base}&backgroundColor=f1f5f9&eyes=round&mouth=bite`;
    }
  };

  const getStageColor = () => {
    switch (stats.stage) {
      case 'volwassene': return 'from-purple-100 to-indigo-50 border-indigo-200';
      case 'jeugd': return 'from-orange-100 to-red-50 border-red-200';
      case 'tiener': return 'from-sky-100 to-blue-50 border-blue-200';
      case 'kind': return 'from-green-100 to-emerald-50 border-emerald-200';
      case 'kleuter': return 'from-pink-100 to-rose-50 border-rose-200';
      case 'peuter': return 'from-yellow-100 to-amber-50 border-amber-200';
      default: return 'from-slate-50 to-slate-100 border-slate-200';
    }
  };

  const statusColor = (val: number) => {
    if (val > 60) return 'bg-green-400';
    if (val > 25) return 'bg-yellow-400';
    return 'bg-red-400 animate-pulse';
  };

  return (
    <div className={`flex flex-col items-center p-4 rounded-3xl shadow-sm border-2 w-full transition-all duration-700 bg-gradient-to-b ${getStageColor()}`}>
      <div className="relative mb-3">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center border-4 border-white overflow-hidden bg-white shadow-inner">
          <img 
            src={getPetImage()} 
            alt="Panda Pet" 
            className="w-24 h-24 sm:w-28 sm:h-28 animate-float" 
          />
        </div>
        
        {/* Level Badge */}
        <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 font-black px-2 py-0.5 rounded-full border-2 border-white text-[10px] shadow-sm">
          LVL {stats.level}
        </div>

        {/* Stage Label */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-3 py-0.5 rounded-full border border-sky-100 text-[9px] font-black text-sky-600 uppercase shadow-sm tracking-wider">
          {stats.stage}
        </div>
      </div>

      <h2 className="text-xl font-fredoka text-sky-700 mb-1">{stats.name}</h2>
      
      {message && (
        <div className="bg-white/90 p-2 rounded-xl mb-4 text-[10px] leading-tight italic text-sky-800 text-center w-full border border-sky-50 shadow-sm">
          "{message}"
        </div>
      )}

      <div className="w-full space-y-2">
        <StatBar label="Honger" value={stats.hunger} colorClass={statusColor(stats.hunger)} />
        <StatBar label="Geluk" value={stats.happiness} colorClass={statusColor(stats.happiness)} />
        <StatBar label="Ervaring" value={stats.exp} colorClass="bg-blue-400" />
      </div>
    </div>
  );
};

const StatBar = ({ label, value, colorClass }: { label: string, value: number, colorClass: string }) => (
  <div className="w-full">
    <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase mb-0.5 px-1">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-2 bg-white/60 rounded-full overflow-hidden border border-white/40 shadow-inner">
      <div 
        className={`h-full transition-all duration-1000 ease-out ${colorClass}`} 
        style={{ width: `${value}%` }} 
      />
    </div>
  </div>
);

export default PetDisplay;
