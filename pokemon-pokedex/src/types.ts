export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  spriteUrl: string;
}

export interface TypeEffectiveness {
  [attackingType: string]: {
    [defendingType: string]: number;
  };
}

export interface TypeMatchup {
  type: string;
  multiplier: number;
}
