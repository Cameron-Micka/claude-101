import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Pokemon, TypeEffectiveness } from '../types';
import TypeBadge from './TypeBadge';
import PokemonCard from './PokemonCard';
import { getAllTypeMatchups } from '../utils/typeEffectiveness';
import { findCounters } from '../utils/findCounters';

interface PokemonDetailProps {
  pokemon: Pokemon;
  allPokemon: Pokemon[];
  typeChart: TypeEffectiveness;
}

export default function PokemonDetail({ pokemon, allPokemon, typeChart }: PokemonDetailProps) {
  const typeMatchups = useMemo(
    () => getAllTypeMatchups(pokemon.types, typeChart),
    [pokemon.types, typeChart]
  );

  const counters = useMemo(
    () => findCounters(pokemon, allPokemon, typeChart),
    [pokemon, allPokemon, typeChart]
  );

  // Group matchups by category
  const weaknesses = typeMatchups.filter((m) => m.multiplier > 1);
  const resistances = typeMatchups.filter((m) => m.multiplier < 1 && m.multiplier > 0);
  const immunities = typeMatchups.filter((m) => m.multiplier === 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6"
      >
        ← Back to Pokedex
      </Link>

      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-32 h-32 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
            <img
              src={pokemon.spriteUrl}
              alt={`${pokemon.name} sprite`}
              className="pixelated max-w-full max-h-full"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="text-lg text-gray-500 dark:text-gray-400 font-mono mb-1">
              #{pokemon.id.toString().padStart(3, '0')}
            </p>
            <h1 className="text-4xl font-bold capitalize text-gray-900 dark:text-gray-100 mb-3">
              {pokemon.name}
            </h1>
            <div className="flex gap-2 justify-center md:justify-start">
              {pokemon.types.map((type) => (
                <TypeBadge key={type} type={type} size="lg" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Type Effectiveness Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Type Effectiveness
        </h2>

        {/* Weaknesses */}
        {weaknesses.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
              Weak to ({weaknesses.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {weaknesses.map((m) => (
                <div
                  key={m.type}
                  className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg"
                >
                  <TypeBadge type={m.type} size="sm" />
                  <span className="text-sm font-semibold text-red-700 dark:text-red-300">
                    {m.multiplier}x
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resistances */}
        {resistances.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">
              Resists ({resistances.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {resistances.map((m) => (
                <div
                  key={m.type}
                  className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg"
                >
                  <TypeBadge type={m.type} size="sm" />
                  <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                    {m.multiplier}x
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Immunities */}
        {immunities.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
              Immune to ({immunities.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {immunities.map((m) => (
                <div
                  key={m.type}
                  className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg"
                >
                  <TypeBadge type={m.type} size="sm" />
                  <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                    0x
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Counters Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Good Counters
        </h2>
        {counters.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No Pokemon have both resistances and super-effective attacks
          </p>
        ) : (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              These Pokemon resist {pokemon.name}'s attacks and can hit back super-effectively
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {counters.map((counter) => (
                <PokemonCard key={counter.id} pokemon={counter} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
