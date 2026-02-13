
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MathProblem, PracticeConfig } from '../types';

interface MathGameProps {
  config: PracticeConfig;
  onComplete: (correctCount: number) => void;
  onCancel: () => void;
}

const MathGame: React.FC<MathGameProps> = ({ config, onComplete, onCancel }) => {
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [userInput, setUserInput] = useState<string>("");
  const isFinishingRef = useRef(false);

  const generateProblem = useCallback((): MathProblem => {
    let question = "";
    let answer = 0;
    let total: number | undefined;
    let part1: number | undefined;
    
    if (config.category === 'plus_min') {
      const mode = config.subType === 'mix' ? (Math.random() > 0.5 ? 'plus' : 'min') : config.subType;
      let a = 0, b = 0;
      switch (config.range) {
        case 'tot_10': a = Math.floor(Math.random() * 11); b = mode === 'plus' ? Math.floor(Math.random() * (11 - a)) : Math.floor(Math.random() * (a + 1)); break;
        case 'tot_20_zonder': 
          a = Math.floor(Math.random() * 15) + 5; 
          b = Math.floor(Math.random() * 5); 
          if (mode === 'min' && a - b < 0) b = a;
          break;
        case 'tot_20_met': 
          a = Math.floor(Math.random() * 9) + 6; 
          b = Math.floor(Math.random() * 9) + 5; 
          if (mode === 'min') { a = Math.floor(Math.random() * 9) + 11; b = Math.floor(Math.random() * 8) + 3; }
          break;
        default: a = Math.floor(Math.random() * 50) + 10; b = Math.floor(Math.random() * 10);
      }
      answer = mode === 'plus' ? a + b : a - b;
      question = `${a} ${mode === 'plus' ? '+' : '-'} ${b}`;
    } else if (config.category === 'splitsen') {
      const range = config.splitsenRange || { van: 3, tot: 10 };
      total = Math.floor(Math.random() * (range.tot - range.van + 1)) + range.van;
      part1 = Math.floor(Math.random() * (total + 1));
      answer = total - part1;
      question = `Splits ${total}`;
    } else {
      const tables = config.selectedTables || [2];
      const table = tables[Math.floor(Math.random() * tables.length)];
      const mult = Math.floor(Math.random() * 10) + 1;
      answer = table * mult;
      question = `${table} × ${mult}`;
    }
    return { question, answer, options: [], type: config.category, total, part1 };
  }, [config]);

  useEffect(() => {
    setProblems(Array.from({ length: 10 }, () => generateProblem()));
    isFinishingRef.current = false;
  }, [generateProblem]);

  const handleKeyPress = (key: string) => {
    if (feedback || isFinishingRef.current || problems.length === 0) return;

    if (key === 'delete') {
      setUserInput(prev => prev.slice(0, -1));
      return;
    }

    const nextInput = userInput + key;
    setUserInput(nextInput);
    
    const correctStr = problems[currentIndex].answer.toString();
    
    if (nextInput.length >= correctStr.length) {
      const isCorrect = nextInput === correctStr;
      const finalCorrectCount = isCorrect ? correctCount + 1 : correctCount;
      
      if (isCorrect) {
        setFeedback('correct');
        setCorrectCount(finalCorrectCount);
      } else {
        setFeedback('wrong');
      }

      if (currentIndex >= 9) {
        isFinishingRef.current = true;
        setTimeout(() => {
          onComplete(finalCorrectCount);
        }, 800);
      } else {
        setTimeout(() => {
          setFeedback(null);
          setUserInput("");
          setCurrentIndex(prev => prev + 1);
        }, 700);
      }
    }
  };

  if (problems.length === 0) return null;
  const current = problems[currentIndex];
  const isSplitsen = config.category === 'splitsen';

  return (
    <div className="flex flex-col items-center bg-white p-5 rounded-[2rem] shadow-xl border-4 border-yellow-200 w-full max-w-[350px] mx-auto animate-in zoom-in-95 duration-300">
      <div className="w-full flex justify-between text-[10px] font-black text-yellow-600 mb-3 px-1">
        <span className="bg-yellow-100 px-3 py-1 rounded-full uppercase tracking-wider">Som {currentIndex + 1} / 10</span>
        <button onClick={onCancel} className="text-red-400 font-bold hover:scale-110 transition-transform">STOP ✕</button>
      </div>

      {!isSplitsen ? (
        <>
          <div className={`w-full py-6 text-3xl sm:text-4xl font-fredoka text-center rounded-2xl mb-4 border-2 transition-all duration-300 shadow-sm ${feedback === 'correct' ? 'bg-green-100 border-green-300 text-green-700' : feedback === 'wrong' ? 'bg-red-100 border-red-300 text-red-700' : 'bg-sky-50 border-sky-100 text-sky-700'}`}>
            {current.question}
          </div>

          <div className={`w-full h-14 bg-slate-50 rounded-2xl border-2 flex items-center justify-center mb-5 shadow-inner transition-colors duration-300 ${feedback === 'correct' ? 'border-green-300' : feedback === 'wrong' ? 'border-red-300' : 'border-slate-100'}`}>
            <span className={`text-3xl font-black tracking-[0.2em] ${feedback === 'correct' ? 'text-green-600' : feedback === 'wrong' ? 'text-red-600' : 'text-slate-700'}`}>
              {feedback === 'wrong' ? current.answer : (userInput || '?')}
            </span>
          </div>
        </>
      ) : (
        /* Splitsen Boom Layout - Iets verkleind */
        <div className="w-full flex flex-col items-center mb-6 pt-2">
          <div className={`w-16 h-16 rounded-2xl border-[5px] flex items-center justify-center transition-all duration-300 shadow-md
            ${feedback === 'correct' ? 'bg-green-500 border-green-600 text-white' : 
              feedback === 'wrong' ? 'bg-red-500 border-red-600 text-white' : 
              'bg-amber-100 border-amber-300 text-amber-800'}
          `}>
            <span className="text-2xl font-fredoka">{current.total}</span>
          </div>

          <div className="w-full h-8 flex justify-center overflow-visible -my-1">
            <svg width="140" height="32" viewBox="0 0 140 32" className="fill-none stroke-slate-300 stroke-[3] rounded-lg">
              <path d="M70 0 L30 32" />
              <path d="M70 0 L110 32" />
            </svg>
          </div>

          <div className="flex justify-between w-full max-w-[200px]">
            <div className="w-14 h-14 rounded-xl border-[3px] border-slate-200 bg-slate-50 flex items-center justify-center text-slate-600 shadow-sm">
              <span className="text-xl font-fredoka">{current.part1}</span>
            </div>

            <div className={`w-14 h-14 rounded-xl border-[3px] flex items-center justify-center transition-all duration-300 shadow-lg
              ${feedback === 'correct' ? 'bg-green-500 border-green-600 text-white' : 
                feedback === 'wrong' ? 'bg-red-500 border-red-600 text-white' : 
                'bg-white border-sky-400 text-sky-700 animate-pulse'}
            `}>
              <span className="text-xl font-fredoka">
                {feedback === 'wrong' ? current.answer : (userInput || '?')}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 w-full max-w-[280px]">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'delete', 0].map(btn => (
          <button
            key={btn}
            onClick={() => handleKeyPress(btn.toString())}
            disabled={!!feedback || isFinishingRef.current}
            className={`h-12 text-xl font-fredoka rounded-xl shadow-sm border-b-4 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center
              ${btn === 'delete' ? 'bg-orange-50 text-orange-500 border-orange-200' : 'bg-white text-sky-600 border-slate-200'}
              ${(!!feedback || isFinishingRef.current) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {btn === 'delete' ? '⌫' : btn}
          </button>
        ))}
      </div>
      
      <div className="h-5 mt-3">
        {feedback === 'wrong' && (
          <span className="text-[10px] text-red-500 font-black uppercase tracking-wider animate-bounce">
            Oeps! Het antwoord was {current.answer}
          </span>
        )}
      </div>
    </div>
  );
};

export default MathGame;
