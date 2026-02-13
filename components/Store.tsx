
import React from 'react';
import { FoodItem } from '../types';
import { FOOD_ITEMS } from '../constants';

interface StoreProps {
  coins: number;
  onBuy: (item: FoodItem) => void;
  onClose: () => void;
}

const Store: React.FC<StoreProps> = ({ coins, onBuy, onClose }) => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-2xl border-4 border-pink-200 w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-fredoka text-pink-500">Supermarkt 🛒</h2>
        <button 
          onClick={onClose}
          className="text-pink-300 hover:text-pink-500 font-bold"
        >
          Sluiten
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2 pb-2">
        {FOOD_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onBuy(item)}
            disabled={coins < item.cost}
            className={`p-4 rounded-2xl border-2 flex flex-col items-center transition-all transform active:scale-95
              ${coins >= item.cost 
                ? 'border-pink-100 hover:border-pink-400 bg-pink-50' 
                : 'border-slate-100 bg-slate-50 opacity-60 grayscale'
              }`}
          >
            <span className="text-4xl mb-2">{item.emoji}</span>
            <span className="font-bold text-slate-700 text-sm">{item.name}</span>
            <span className="text-xs text-pink-600 font-bold mt-1">💰 {item.cost}</span>
            <div className="mt-2 text-[10px] text-slate-500 flex flex-col items-center">
              <span>Honger: +{item.hungerValue}</span>
              <span>Geluk: +{item.happinessValue}</span>
            </div>
          </button>
        ))}
      </div>

      <button 
        onClick={onClose}
        className="w-full mt-6 py-4 bg-pink-500 text-white font-bold rounded-2xl shadow-lg hover:bg-pink-600 transition-colors"
      >
        Klaar met shoppen
      </button>
    </div>
  );
};

export default Store;
