import type { Pokemon, TypeEffectiveness } from '../types';
import { calculateEffectiveness } from './typeEffectiveness';

/**
 * Find Pokemon that counter the target Pokemon
 * A counter must:
 * 1. Resist at least one of the target's types (defensive advantage)
 * 2. Hit the target super-effectively with at least one of its own types (offensive advantage)
 */
export function findCounters(
  targetPokemon: Pokemon,
  allPokemon: Pokemon[],
  typeChart: TypeEffectiveness
): Pokemon[] {
  const targetTypes = targetPokemon.types;

  return allPokemon.filter(pokemon => {
    // Exclude self
    if (pokemon.id === targetPokemon.id) {
      return false;
    }

    // Check defensive advantage: resists at least one of target's STAB types
    const resists = targetTypes.some(targetType =>
      pokemon.types.some(pokemonType => {
        const effectiveness = calculateEffectiveness(targetType, [pokemonType], typeChart);
        return effectiveness <= 1; // Resists or neutral
      })
    );

    if (!resists) {
      return false;
    }

    // Check offensive advantage: can hit target super-effectively
    const hitsSuper = pokemon.types.some(pokemonType => {
      const effectiveness = calculateEffectiveness(pokemonType, targetTypes, typeChart);
      return effectiveness >= 2; // Super effective
    });

    return hitsSuper;
  });
}
