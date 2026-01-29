import type { TypeEffectiveness, TypeMatchup } from '../types';

/**
 * Calculate effectiveness of an attacking type against a Pokemon's types
 */
export function calculateEffectiveness(
  attackType: string,
  defenderTypes: string[],
  typeChart: TypeEffectiveness
): number {
  let multiplier = 1;

  for (const defenderType of defenderTypes) {
    const effectiveness = typeChart[attackType]?.[defenderType] ?? 1;
    multiplier *= effectiveness;
  }

  return multiplier;
}

/**
 * Get all type matchups for a Pokemon (what types it's weak/resistant to)
 */
export function getAllTypeMatchups(
  defenderTypes: string[],
  typeChart: TypeEffectiveness
): TypeMatchup[] {
  const allTypes = Object.keys(typeChart);
  const matchups: TypeMatchup[] = [];

  for (const attackType of allTypes) {
    const multiplier = calculateEffectiveness(attackType, defenderTypes, typeChart);
    matchups.push({
      type: attackType,
      multiplier,
    });
  }

  // Sort by multiplier descending (weaknesses first)
  return matchups.sort((a, b) => b.multiplier - a.multiplier);
}

/**
 * Get effectiveness category for display
 */
export function getEffectivenessCategory(multiplier: number): {
  label: string;
  color: string;
} {
  if (multiplier === 0) {
    return { label: 'immune', color: 'text-blue-600 dark:text-blue-400' };
  } else if (multiplier >= 2) {
    return { label: 'weak', color: 'text-red-600 dark:text-red-400' };
  } else if (multiplier > 1) {
    return { label: 'weak', color: 'text-orange-600 dark:text-orange-400' };
  } else if (multiplier < 1) {
    return { label: 'resistant', color: 'text-green-600 dark:text-green-400' };
  }
  return { label: 'neutral', color: 'text-gray-600 dark:text-gray-400' };
}
