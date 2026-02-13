
export type PetStats = {
  name: string;
  level: number;
  exp: number;
  hunger: number; // 0 to 100
  happiness: number; // 0 to 100
  coins: number;
  stage: 'baby' | 'peuter' | 'kleuter' | 'kind' | 'tiener' | 'jeugd' | 'volwassene';
  inventory: Record<string, number>; // itemId -> count
};

export type PracticeCategory = 'plus_min' | 'splitsen' | 'tafels';

export type PracticeConfig = {
  category: PracticeCategory;
  subType: 'plus' | 'min' | 'mix' | 'maal' | 'gedeeld';
  range?: 'tot_10' | 'tot_20_zonder' | 'tot_20_met' | 'tot_100' | 'tot_1000';
  splitsenRange?: { van: number; tot: number };
  selectedTables?: number[];
};

export type MathProblem = {
  question: string;
  answer: number;
  options: number[];
  type: string;
  total?: number; 
  part1?: number; 
};

export type FoodItem = {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  hungerValue: number;
  happinessValue: number;
};

export type GameState = 'dashboard' | 'practice_selection' | 'practice_game' | 'store';
