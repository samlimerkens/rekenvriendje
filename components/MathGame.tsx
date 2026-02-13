
import React, { useState, useEffect, useCallback } from 'react';
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

  const generateProblem = useCallback((): MathProblem => {
    let question = "";
    let answer = 0;
    let type = config.category;
    let total: number | undefined;
    let part1: number | undefined;

    if (config.category === 'plus_min') {
      const mode = config.subType === 'mix' ? (Math.random() > 0.5 ? 'plus' : 'min') : config.subType;
      let a = 0, b = 0;

      switch (config.range) {
        case 'tot_10':
          a = Math.floor(Math.random() * 11);
          b = mode === 'plus' ? Math.floor(Math.random() * (11 - a)) : Math.floor(Math.random() * (a + 1));
          break;
        case 'tot_20_zonder':
          if (mode === 'plus') {
            a = Math.floor(Math.random() * 19) + 1;
            b = Math.floor(Math.random() * (21 - a));
            while ((a % 10) + (b % 10) >= 10 && b > 0) b--;
          } else {
            a = Math.floor(Math.random() * 20) + 1;
            b = Math.floor(Math.random() * (a + 1));
            while ((a % 10) < (b % 10)) b--;
          }
          break;
        case 'tot_20_met':
          if (mode === 'plus') {
            a = Math.floor(Math.random() * 9) + 2;
            b = Math.floor(Math.random() * 9) + 2;
            while ((a % 10) + (b % 10) < 10 || a + b > 20) {
              a = Math.floor(Math.random() * 9) + 2;
              b = Math.floor(Math.random() * 9) + 2;
            }
          } else {
            a = Math.floor(Math.random() * 9) + 11;
            b = Math.floor(Math.random() * 9) + 2;
            while ((a % 10) >= (b % 10) || a - b < 0) {
              b = Math.floor(Math.random() * 9) + 2;
            }
          }
          break;
        case 'tot_100':
          a = Math.floor(Math.random() * 91) + 10;
          b = mode === 'plus' ? Math.floor(Math.random() * (101 - a)) : Math.floor(Math.random() * (a + 1));
          break;
        case 'tot_1000':
          a = Math.floor(Math.random() * 901) + 50;
          b = mode === 'plus' ? Math.floor(Math.random() * (1001 - a)) : Math.floor(Math.random() * (a + 1));
          break;
      }
      answer = mode === 'plus' ? a + b : a - b;
      question = `${a} ${mode === 'plus' ? '+' : '-'} ${b}`;
    } else if (config.category === 'splitsen') {
      const range = config.splitsenRange || { van: 3, tot: 10 };
      total = Math.floor(Math.random() * (range.tot - range.van + 1)) + range.van;
      part1 = Math.floor(Math.random() * (total + 1));
      answer = total - part1;
      question = `Splits ${total} in ${part1} en ...`;
    } else if (config.category === 'tafels') {
      const mode = config.subType === 'mix' ? (Math.random() > 0.5 ? 'maal' : 'gedeeld') : config.subType;
      const tables = config.selectedTables || [2];
      const table = tables[Math.floor(Math.random() * tables.length)];
      const multiplier = Math.floor(Math.random() * 11) + 1;
      
      if (mode === 'maal') {
        answer = table * multiplier;
        question = `${table} × ${multiplier}`;
      } else {
        const product = table * multiplier;
        answer = multiplier;
        question = `${product} ÷ ${table}`;
      }
    }

    return {
      question,
      answer,
      options: [],
      type,
      total,
      part1
    };
  }, [config]);

  useEffect(() => {
    const newProblems = Array.from({ length: 10 }, () => generateProblem());
    setProblems(newProblems);
  }, [generateProblem]);

  const handleNext = (isCorrect: boolean) => {
    setTimeout(() => {
      setFeedback(null);
      setUserInput("");
      if (currentIndex < problems.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        onComplete(isCorrect ? correctCount + 1 : correctCount);
      }
    }, 1000);
  };

  const handleKeyPress = (key: string) => {
    if (feedback) return;

    if (key === 'delete') {
      setUserInput(prev => prev.slice(0, -1));
      return;
    }

    const nextInput = userInput + key;
    if (nextInput.length > 4) return;
    
    setUserInput(nextInput);

    const correctAnswerStr = problems[currentIndex].answer.toString();
    
    if (nextInput.length >= correctAnswerStr.length) {
      const isCorrect = nextInput === correctAnswerStr;
      if (isCorrect) {
        setFeedback('correct');
        setCorrectCount(prev => prev + 1);
        handleNext(true);
      } else {
        setFeedback('wrong');
        handleNext(false);
      }
    }
  };

  if (problems.length === 0) return <div className="p-10 font-bold text-sky-600 animate-pulse text-center">Sommen voorbereiden...</div>;

  const currentProblem = problems[currentIndex];
  const isSplitsen = config.category === 'splitsen';

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-white rounded-3xl shadow-xl border-4 border-yellow-400 w-full max-w-md mx-auto animate-in zoom-in-95">
      <div className="w-full flex justify-between items-center mb-4">
        <span className="text-lg font-bold text-yellow-600">Vraag {currentIndex + 1} / 10</span>
        <button onClick={onCancel} className="text-red-400 hover:text-red-500 font-bold text-sm bg-red-50 w-8 h-8 rounded-full flex items-center justify-center">✕</button>
      </div>

      {/* Logic for Splitsen vs Standard Layout */}
      {!isSplitsen ? (
        <>
          <div className={`text-2xl sm:text-3xl font-fredoka mb-4 p-4 rounded-2xl w-full text-center border-2 min-h-[100px] flex items-center justify-center leading-tight transition-all duration-300 shadow-inner
            ${feedback === 'correct' ? 'bg-green-500 text-white border-green-600 scale-105 shadow-green-200' : 
              feedback === 'wrong' ? 'bg-red-500 text-white border-red-600 scale-95 shadow-red-200' : 
              'bg-blue-50 text-blue-600 border-blue-200'}
          `}>
            {currentProblem.question}
          </div>

          <div className={`w-full h-20 bg-slate-50 rounded-2xl border-4 flex items-center justify-center mb-6 transition-all duration-300 ${feedback === 'correct' ? 'border-green-400' : feedback === 'wrong' ? 'border-red-400' : 'border-slate-100'}`}>
            <span className={`text-5xl font-black tracking-widest ${feedback === 'correct' ? 'text-green-600' : feedback === 'wrong' ? 'text-red-600' : 'text-slate-700'}`}>
              {feedback === 'wrong' ? currentProblem.answer : (userInput || '?')}
            </span>
          </div>
        </>
      ) : (
        <div className="w-full flex flex-col items-center mb-8 pt-4">
          {/* Top Box (Total) */}
          <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-4 flex items-center justify-center transition-all duration-300 shadow-lg
            ${feedback === 'correct' ? 'bg-green-500 border-green-600 text-white scale-110' : 
              feedback === 'wrong' ? 'bg-red-500 border-red-600 text-white scale-90' : 
              'bg-amber-50 border-amber-300 text-amber-700'}
          `}>
            <span className="text-4xl sm:text-5xl font-fredoka">{currentProblem.total}</span>
          </div>

          {/* SVG Connector Lines */}
          <svg className="w-full h-12 overflow-visible" viewBox="0 0 100 20">
             <line x1="50" y1="0" x2="30" y2="20" stroke={feedback === 'correct' ? '#16a34a' : feedback === 'wrong' ? '#dc2626' : '#cbd5e1'} strokeWidth="3" />
             <line x1="50" y1="0" x2="70" y2="20" stroke={feedback === 'correct' ? '#16a34a' : feedback === 'wrong' ? '#dc2626' : '#cbd5e1'} strokeWidth="3" />
          </svg>

          {/* Bottom Boxes (Parts) */}
          <div className="flex justify-center gap-8 sm:gap-12 w-full px-4">
            {/* Left Box (Given Part) */}
            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 flex items-center justify-center transition-all duration-300 shadow-md
              ${feedback === 'correct' ? 'bg-green-50 border-green-200 text-green-700' : 
                feedback === 'wrong' ? 'bg-red-50 border-red-200 text-red-700' : 
                'bg-slate-50 border-slate-200 text-slate-600'}
            `}>
              <span className="text-3xl sm:text-4xl font-fredoka">{currentProblem.part1}</span>
            </div>

            {/* Right Box (Input Part) */}
            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 flex items-center justify-center transition-all duration-300 shadow-md
              ${feedback === 'correct' ? 'bg-green-500 border-green-600 text-white' : 
                feedback === 'wrong' ? 'bg-red-500 border-red-600 text-white' : 
                'bg-white border-sky-300 text-sky-700'}
            `}>
              <span className="text-3xl sm:text-4xl font-fredoka">
                {feedback === 'wrong' ? currentProblem.answer : (userInput || '?')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Custom Keypad */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-[280px]">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => handleKeyPress(num.toString())}
            disabled={!!feedback}
            className="h-16 bg-white hover:bg-sky-50 text-sky-600 font-fredoka text-3xl rounded-2xl border-b-4 border-slate-200 active:translate-y-1 active:border-b-0 transition-all shadow-sm"
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => handleKeyPress('delete')}
          disabled={!!feedback}
          className="h-16 bg-orange-50 hover:bg-orange-100 text-orange-600 font-fredoka text-3xl rounded-2xl border-b-4 border-orange-200 active:translate-y-1 active:border-b-0 transition-all shadow-sm"
        >
          ⌫
        </button>
        <button
          onClick={() => handleKeyPress('0')}
          disabled={!!feedback}
          className="h-16 bg-white hover:bg-sky-50 text-sky-600 font-fredoka text-3xl rounded-2xl border-b-4 border-slate-200 active:translate-y-1 active:border-b-0 transition-all shadow-sm"
        >
          0
        </button>
        <div className="h-16 bg-slate-50 rounded-2xl border-b-4 border-slate-100 flex items-center justify-center opacity-30">
          ✨
        </div>
      </div>

      <div className="h-10 mt-4 flex items-center justify-center">
        {feedback && (
          <div className={`text-2xl font-fredoka animate-bounce ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
            {feedback === 'correct' ? 'Goed gedaan!' : `Foutje! Het was ${currentProblem.answer}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default MathGame;
