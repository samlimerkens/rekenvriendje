
import { FoodItem, PetStats } from './types';

// Fixed missing inventory property in INITIAL_PET_STATS
export const INITIAL_PET_STATS: PetStats = {
  name: 'Flappie',
  level: 1,
  exp: 0,
  hunger: 50,
  happiness: 50,
  coins: 20,
  stage: 'baby',
  inventory: {},
};

export const FOOD_ITEMS: FoodItem[] = [
  { id: 'apple', name: 'Appel', emoji: '🍎', cost: 5, hungerValue: 15, happinessValue: 5 },
  { id: 'pizza', name: 'Pizza', emoji: '🍕', cost: 15, hungerValue: 40, happinessValue: 10 },
  { id: 'icecream', name: 'Ijsje', emoji: '🍦', cost: 10, hungerValue: 5, happinessValue: 30 },
  { id: 'carrot', name: 'Wortel', emoji: '🥕', cost: 3, hungerValue: 10, happinessValue: 2 },
  { id: 'burger', name: 'Burger', emoji: '🍔', cost: 20, hungerValue: 50, happinessValue: 15 },
  { id: 'cake', name: 'Taart', emoji: '🍰', cost: 25, hungerValue: 20, happinessValue: 50 },
];

export const PET_STAGES = {
  baby: 'https://picsum.photos/seed/pet-baby/300/300',
  teen: 'https://picsum.photos/seed/pet-teen/300/300',
  adult: 'https://picsum.photos/seed/pet-adult/300/300',
};