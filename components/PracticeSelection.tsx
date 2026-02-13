
import React, { useState } from 'react';
import { PracticeConfig, PracticeCategory } from '../types';

interface PracticeSelectionProps {
  onSelect: (config: PracticeConfig) => void;
  onCancel: () => void;
}

const PracticeSelection: React.FC<PracticeSelectionProps> = ({ onSelect, onCancel }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [category, setCategory] = useState<PracticeCategory | null>(null);
  const [subType, setSubType] = useState<'plus' | 'min' | 'mix' | 'maal' | 'gedeeld'>('plus');
  const [splitsenRange, setSplitsenRange] = useState({ van: 3, tot: 10 });
  const [selectedTables, setSelectedTables] = useState<number[]>([]);

  const handleCategorySelect = (cat: PracticeCategory) => {
    setCategory(cat);
    if (cat === 'plus_min') {
      setSubType('plus');
      setStep(2);
    } else if (cat === 'tafels') {
      setSubType('maal');
      setStep(2);
    } else {
      setStep(2);
    }
  };

  const handleTableToggle = (num: number) => {
    setSelectedTables(prev => 
      prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num]
    );
  };

  const ranges = [
    { id: 'tot_10', label: 'Tot 10' },
    { id: 'tot_20_zonder', label: 'Tot 20 (zonder brug)' },
    { id: 'tot_20_met', label: 'Tot 20 (met brug)' },
    { id: 'tot_100', label: 'Tot 100' },
    { id: 'tot_1000', label: 'Tot 1000' },
  ] as const;

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded-3xl shadow-xl border-4 border-sky-100 animate-in slide-in-from-bottom-4">
      {step === 1 && (
        <>
          <h2 className="text-2xl font-fredoka text-sky-600 mb-6 text-center">Wat wil je oefenen?</h2>
          <div className="space-y-4">
            <button onClick={() => handleCategorySelect('plus_min')} className="w-full p-6 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-2xl flex items-center gap-4 transition-all transform active:scale-95 group">
              <span className="text-4xl group-hover:scale-110 transition-transform">➕</span>
              <div className="text-left">
                <p className="font-fredoka text-xl text-blue-700">Plus en Min</p>
                <p className="text-xs text-blue-500">Optellen en aftrekken tot 1000</p>
              </div>
            </button>
            <button onClick={() => handleCategorySelect('splitsen')} className="w-full p-6 bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-2xl flex items-center gap-4 transition-all transform active:scale-95 group">
              <span className="text-4xl group-hover:scale-110 transition-transform">⚖️</span>
              <div className="text-left">
                <p className="font-fredoka text-xl text-green-700">Splitsen</p>
                <p className="text-xs text-green-500">Getallen uit elkaar halen</p>
              </div>
            </button>
            <button onClick={() => handleCategorySelect('tafels')} className="w-full p-6 bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 rounded-2xl flex items-center gap-4 transition-all transform active:scale-95 group">
              <span className="text-4xl group-hover:scale-110 transition-transform">✖️</span>
              <div className="text-left">
                <p className="font-fredoka text-xl text-purple-700">Tafels</p>
                <p className="text-xs text-purple-500">Vermenigvuldigen en delen</p>
              </div>
            </button>
          </div>
        </>
      )}

      {step === 2 && category === 'plus_min' && (
        <>
          <h2 className="text-2xl font-fredoka text-sky-600 mb-4 text-center">Kies je sommen</h2>
          <div className="flex gap-2 mb-6">
            {['plus', 'min', 'mix'].map((t) => (
              <button 
                key={t}
                onClick={() => setSubType(t as any)}
                className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${subType === t ? 'bg-blue-500 border-blue-600 text-white' : 'bg-white border-blue-100 text-blue-400'}`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {ranges.map((r) => (
              <button 
                key={r.id}
                onClick={() => onSelect({ category: 'plus_min', subType, range: r.id })}
                className="w-full p-4 bg-white hover:bg-blue-50 border-2 border-slate-100 hover:border-blue-200 rounded-xl font-bold text-slate-700 text-left flex justify-between items-center transition-all transform active:scale-95"
              >
                {r.label}
                <span className="text-blue-300">➔</span>
              </button>
            ))}
          </div>
          <button onClick={() => setStep(1)} className="mt-6 text-slate-400 font-bold w-full">Vorige</button>
        </>
      )}

      {step === 2 && category === 'splitsen' && (
        <>
          <h2 className="text-2xl font-fredoka text-sky-600 mb-6 text-center">Splitsen bereik</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-500 mb-2">Van:</label>
              <select 
                value={splitsenRange.van} 
                onChange={(e) => setSplitsenRange(prev => ({ ...prev, van: parseInt(e.target.value) }))}
                className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold"
              >
                {[...Array(98)].map((_, i) => <option key={i+3} value={i+3}>{i+3}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-500 mb-2">Tot:</label>
              <select 
                value={splitsenRange.tot} 
                onChange={(e) => setSplitsenRange(prev => ({ ...prev, tot: Math.max(splitsenRange.van, parseInt(e.target.value)) }))}
                className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold"
              >
                {[...Array(101 - splitsenRange.van)].map((_, i) => {
                  const val = i + splitsenRange.van;
                  return <option key={val} value={val}>{val}</option>;
                })}
              </select>
            </div>
            <button 
              onClick={() => onSelect({ category: 'splitsen', subType: 'mix', splitsenRange })}
              className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-fredoka text-xl rounded-2xl shadow-lg transition-all transform active:scale-95"
            >
              Starten! 🚀
            </button>
          </div>
          <button onClick={() => setStep(1)} className="mt-6 text-slate-400 font-bold w-full">Vorige</button>
        </>
      )}

      {step === 2 && category === 'tafels' && (
        <>
          <h2 className="text-2xl font-fredoka text-sky-600 mb-4 text-center">Kies je tafels</h2>
          <div className="flex gap-2 mb-6">
            {['maal', 'gedeeld', 'mix'].map((t) => (
              <button 
                key={t}
                onClick={() => setSubType(t as any)}
                className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${subType === t ? 'bg-purple-500 border-purple-600 text-white' : 'bg-white border-purple-100 text-purple-400'}`}
              >
                {t === 'maal' ? '×' : t === 'gedeeld' ? '÷' : 'Mix'}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2 mb-6">
            {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
              <button 
                key={n}
                onClick={() => handleTableToggle(n)}
                className={`aspect-square rounded-full font-bold text-lg border-2 transition-all transform active:scale-90 ${selectedTables.includes(n) ? 'bg-purple-100 border-purple-400 text-purple-700' : 'bg-white border-slate-100 text-slate-400'}`}
              >
                {n}
              </button>
            ))}
          </div>
          <button 
            disabled={selectedTables.length === 0}
            onClick={() => onSelect({ category: 'tafels', subType, selectedTables })}
            className={`w-full py-4 font-fredoka text-xl rounded-2xl shadow-lg transition-all transform active:scale-95 ${selectedTables.length > 0 ? 'bg-purple-500 hover:bg-purple-600 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
            Starten! 🚀
          </button>
          <button onClick={() => setStep(1)} className="mt-6 text-slate-400 font-bold w-full">Vorige</button>
        </>
      )}
    </div>
  );
};

export default PracticeSelection;
