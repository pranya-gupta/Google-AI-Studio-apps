export type Gender = 'male' | 'female' | 'others';
export type Era = 'human' | 'vampire' | 'werewolf' | 'hybrid' | 'witch';
export type Atmosphere = 'summer' | 'winter' | 'rainy' | 'spring' | 'autumn';
export type Character = 'stefan' | 'damon' | 'elena' | 'caroline' | 'bonnie' | 'katherine' | 'klaus' | 'elijah' | 'rebekah' | 'kol' | 'hope' | 'tyler' | 'jeremy' | 'alaric' | 'matt';

export interface FashionItem {
  name: string;
  price: string;
}

export interface Look {
  id: string;
  name: string;
  topwear: FashionItem;
  bottomwear: FashionItem;
  layering: FashionItem;
  accessories: FashionItem;
  shoes: FashionItem;
  description: string;
  imageUrl?: string;
}

export interface RecommendationRequest {
  occasion: string;
  age: string;
  gender: Gender;
  era: Era;
  character: Character;
  atmosphere: Atmosphere;
  userImage?: string;
}
