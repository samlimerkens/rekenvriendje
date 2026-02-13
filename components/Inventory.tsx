
import React from 'react';
import { PetStats } from '../types';
import { FOOD_ITEMS } from '../constants';

interface InventoryProps {
  inventory: Record<string, number>;
  onFeed: (itemId: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ inventory, onFeed }) => {
  const inventoryEntries = Object.entries(inventory || {});

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl border-4 border-amber-100 w-full animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">🎒</span>
        <h3 className="font-fredoka text-xl text-amber-600">Mijn Rugzak</h3>
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-3">
        {inventoryEntries.length === 0 ? (
          <div className="col-span-full py-8 text-center border-2 border-dashed border-slate-100 rounded-2xl">
            <p className="text-slate-400 text-sm italic">Je rugzak is nog leeg...</p>
            <p className="text-[10px] text-slate-300 mt-1">Koop iets lekkers in de winkel!</p>
          </div>
        ) : (
          inventoryEntries.map(([itemId, count]) => {
            const item = FOOD_ITEMS.find(f => f.id === itemId);
            if (!item) return null;
            return (
              <button
                key={itemId}
                onClick={() => onFeed(itemId)}
                className="group relative flex flex-col items-center justify-center p-2 bg-amber-50 rounded-2xl border-2 border-transparent hover:border-amber-400 hover:bg-white transition-all transform hover:scale-105 active:scale-90 shadow-sm"
              >
                <span className="text-3xl mb-1">{item.emoji}</span>
                <span className="text-[10px] font-bold text-amber-800 truncate w-full text-center">
                  {item.name}
                </span>
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {count}
                </span>
                
                {/* Info Tooltip */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30 shadow-lg">
                  Geef aan je vriendje!
                </div>
              </button>
            );
          })
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100">
        <p className="text-[10px] text-slate-400 text-center font-medium">
          Klik op een item om je huisdier te voeren
        </p>
      </div>
    </div>
  );
};

export default Inventory;
