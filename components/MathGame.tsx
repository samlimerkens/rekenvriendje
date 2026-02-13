
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
    
    if (config.category === 'plus_min') {
      const mode = config.subType === 'mix' ? (Math.random() > 0.5 ? 'plus' : 'min') : config.subType;
      let a = 0, b = 0;
      switch (config.range) {
        case 'tot_10': a = Math.floor(Math.random() * 11); b = mode === 'plus' ? Math.floor(Math.random() * (11 - a)) : Math.floor(Math.random() * (a + 1)); break;
        case 'tot_20_zonder': a = Math.floor(Math.random() * 15) + 5; b = Math.floor(Math.random() * 5); break;
        default: a = Math.floor(Math.random() * 50) + 10; b = Math.floor(Math.random() * 10);
      }
      answer = mode === 'plus' ? a + b : a - b;
      question = `${a} ${mode === 'plus' ? '+' : '-'} ${b}`;
    } else if (config.category === 'splitsen') {
      const total = Math.floor(Math.random() * 8) + 3;
      const part1 = Math.floor(Math.random() * (total + 1));
      answer = total - part1;
      question = `Splits ${total}: ${part1} en ?`;
    } else {
      const tables = config.selectedTables || [2];
      const table = tables[Math.floor(Math.random() * tables.length)];
      const mult = Math.floor(Math.random() * 10) + 1;
      answer = table * mult;
      question = `${table} × ${mult}`;
    }
    return { question, answer, options: [], type: config.category };
  }, [config]);

  useEffect(() => {
    setProblems(Array.from({ length: 10 }, () => generateProblem()));
    isFinishingRef.current = false;
  }, [generateProblem]);

  const handleNext = (wasCorrect: boolean) => {
    if (isFinishingRef.current) return;
    
    setTimeout(() => {
      setFeedback(null);
      setUserInput("");
      
      if (currentIndex < 9) {
        setCurrentIndex(prev => prev + 1);
      } else {
        isFinishingRef.current = true;
        onComplete(wasCorrect ? correctCount + 1 : correctCount);
      }
    }, 650);
  };

  const handleKeyPress = (key: string) => {
    if (feedback || isFinishingRef.current) return;
    if (key === 'delete') { setUserInput(prev => prev.slice(0, -1)); return; }

    const nextInput = userInput + key;
    setUserInput(nextInput);
    
    const correctStr = problems[currentIndex].answer.toString();
    if (nextInput.length >= correctStr.length) {
      const isCorrect = nextInput === correctStr;
      if (isCorrect) {
        setFeedback('correct');
        setCorrectCount(c => c + 1);
        handleNext(true);
      } else {
        setFeedback('wrong');
        handleNext(false);
      }
    }
  };

  if (problems.length === 0) return null;
  const current = problems[currentIndex];

  return (
    <div className="flex flex-col items-center bg-white p-4 rounded-3xl shadow-md border-2 border-yellow-200 w-full max-w-[320px] mx-auto animate-in zoom-in-95">
      <div className="w-full flex justify-between text-[10px] font-black text-yellow-600 mb-3 px-1">
        <span className="bg-yellow-50 px-2 py-0.5 rounded-full uppercase">Som {currentIndex + 1}/10</span>
        <button onClick={onCancel} className="text-red-400">STOP ✕</button>
      </div>

      <div className={`w-full py-6 text-3xl font-fredoka text-center rounded-2xl mb-4 border-2 transition-all duration-300 ${feedback === 'correct' ? 'bg-green-100 border-green-300 text-green-700' : feedback === 'wrong' ? 'bg-red-100 border-red-300 text-red-700' : 'bg-sky-50 border-sky-100 text-sky-700'}`}>
        {current.question}
      </div>

      <div className="w-full h-14 bg-slate-50 rounded-2xl border-2 border-slate-100 flex items-center justify-center mb-5 shadow-inner">
        <span className="text-3xl font-black text-slate-700 tracking-widest">{userInput || '?'}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 w-full">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'delete', 0].map(btn => (
          <button
            key={btn}
            onClick={() => btn === 'delete' ? handleKeyPress('delete') : handleKeyPress(btn.toString())}
            disabled={!!feedback}
            className={`h-12 text-xl font-fredoka rounded-xl shadow-sm border-b-4 active:border-b-0 active:translate-y-1 transition-all
              ${btn === 'delete' ? 'bg-orange-50 text-orange-500 border-orange-200' : 'bg-white text-sky-600 border-slate-200'}`}
          >
            {btn === 'delete' ? '⌫' : btn}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MathGame;
