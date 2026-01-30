import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from '@fluentui/react-components';
import { ArrowLeft24Regular } from '@fluentui/react-icons';
import type { Pokemon, TypeEffectiveness } from '../types';
import TypeBadge from './TypeBadge';
import PokemonCard from './PokemonCard';
import { getAllTypeMatchups } from '../utils/typeEffectiveness';
import { findCounters } from '../utils/findCounters';
import { getTypeColor } from '../utils/typeColors';

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

  const hp = Math.min(30 + pokemon.id * 2, 150);
  const weaknesses = typeMatchups.filter((m) => m.multiplier > 1);
  const resistances = typeMatchups.filter((m) => m.multiplier < 1 && m.multiplier > 0);
  const immunities = typeMatchups.filter((m) => m.multiplier === 0);

  // Get type colors for card background (same as PokemonCard)
  const primaryColor = getTypeColor(pokemon.types[0]);
  const secondaryColor = pokemon.types[1] ? getTypeColor(pokemon.types[1]) : primaryColor;

  // Desaturate color by mixing with white/light gray
  const desaturateColor = (color: string, amount: number = 0.7) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const mix = (val: number) => Math.round(val + (230 - val) * amount);
    return `#${mix(r).toString(16).padStart(2, '0')}${mix(g).toString(16).padStart(2, '0')}${mix(b).toString(16).padStart(2, '0')}`;
  };

  const bgPrimaryColor = desaturateColor(primaryColor);
  const bgSecondaryColor = desaturateColor(secondaryColor);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link to="/" className="inline-block mb-6">
        <Button icon={<ArrowLeft24Regular />} appearance="subtle">
          Back to Pokedex
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Pokemon Card - Large */}
        <Card
          className="pokemon-detail-card relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${bgPrimaryColor} 0%, ${bgSecondaryColor} 100%)`,
            borderRadius: '24px',
            border: '12px solid #f4d03f',
            padding: '24px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <span className="inline-block px-3 py-1 text-sm font-bold bg-white/80 rounded mb-2">
                BASIC
              </span>
              <h1 className="text-4xl font-bold capitalize text-gray-900 leading-tight mb-2">
                {pokemon.name}
              </h1>
              <div className="flex gap-2">
                {pokemon.types.map((type) => (
                  <TypeBadge key={type} type={type} size="lg" />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span className="text-2xl font-bold">HP</span>
              <span className="text-4xl font-bold">{hp}</span>
              <div className="ml-1">
                {pokemon.types[0] && <TypeBadge type={pokemon.types[0]} size="md" />}
              </div>
            </div>
          </div>

          {/* Large Image Frame */}
          <div
            className="relative mb-4 p-4 bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl"
            style={{
              boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.2)',
            }}
          >
            <div 
              className="rounded-xl p-8 flex items-center justify-center min-h-[300px]"
              style={{ 
                background: 'linear-gradient(135deg, #d0d0d0 0%, #a0a0a0 100%)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              <img
                src={pokemon.spriteUrl}
                alt={`${pokemon.name} sprite`}
                className="pixelated max-w-full max-h-full"
                style={{
                  imageRendering: 'pixelated',
                  filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.3))',
                  transform: 'scale(2)',
                }}
              />
            </div>
            {/* Frame decorations */}
            <div className="absolute top-2 left-2 w-4 h-4 bg-gray-500 rounded-full"></div>
            <div className="absolute top-2 right-2 w-4 h-4 bg-gray-500 rounded-full"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 bg-gray-500 rounded-full"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-gray-500 rounded-full"></div>
          </div>

          {/* Weakness & Resistance Section (Card-style) */}
          <div className="bg-white/70 rounded-xl p-4 mb-3">
            <div className="flex gap-4 text-sm">
              {/* Weaknesses */}
              <div className="flex-1">
                <div className="font-bold mb-1 text-gray-700">weakness</div>
                <div className="flex flex-wrap gap-3">
                  {weaknesses.slice(0, 3).map((m) => (
                    <div key={m.type} className="flex items-center gap-2 bg-red-100 px-3 py-1.5 rounded">
                      <TypeBadge type={m.type} size="sm" />
                      <span className="text-xs font-bold text-red-700">×{m.multiplier}</span>
                    </div>
                  ))}
                  {weaknesses.length === 0 && <span className="text-gray-500 text-xs">None</span>}
                </div>
              </div>

              {/* Resistances */}
              <div className="flex-1">
                <div className="font-bold mb-1 text-gray-700">resistance</div>
                <div className="flex flex-wrap gap-3">
                  {resistances.slice(0, 3).map((m) => (
                    <div key={m.type} className="flex items-center gap-2 bg-green-100 px-3 py-1.5 rounded">
                      <TypeBadge type={m.type} size="sm" />
                      <span className="text-xs font-bold text-green-700">-{Math.round((1-m.multiplier)*100)}%</span>
                    </div>
                  ))}
                  {resistances.length === 0 && <span className="text-gray-500 text-xs">None</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Card Number */}
          <div className="bg-white/50 rounded-lg px-3 py-2 text-center">
            <p className="text-sm font-mono font-bold text-gray-700">
              NO. {pokemon.id.toString().padStart(3, '0')} / 151
            </p>
          </div>
        </Card>

        {/* Right Side - Type Effectiveness Details */}
        <div className="space-y-6 flex-1">
          {/* Full Type Effectiveness */}
          <div
            style={{
              padding: '20px',
            }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Type Matchups</h2>

            {/* Weaknesses */}
            {weaknesses.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Weak to ({weaknesses.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {weaknesses.map((m) => (
                    <div
                      key={m.type}
                      className="flex items-center gap-3 bg-red-50 px-5 py-3 rounded-lg border border-red-200"
                    >
                      <TypeBadge type={m.type} size="sm" />
                      <span className="text-sm font-bold text-red-700">×{m.multiplier}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resistances */}
            {resistances.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Resists ({resistances.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {resistances.map((m) => (
                    <div
                      key={m.type}
                      className="flex items-center gap-3 bg-green-50 px-5 py-3 rounded-lg border border-green-200"
                    >
                      <TypeBadge type={m.type} size="sm" />
                      <span className="text-sm font-bold text-green-700">×{m.multiplier}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Immunities */}
            {immunities.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-blue-600 mb-2">
                  Immune to ({immunities.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {immunities.map((m) => (
                    <div
                      key={m.type}
                      className="flex items-center gap-3 bg-blue-50 px-5 py-3 rounded-lg border border-blue-200"
                    >
                      <TypeBadge type={m.type} size="sm" />
                      <span className="text-sm font-bold text-blue-700">×0</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Counters Section */}
          <div
            style={{
              padding: '20px',
            }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">Good Counters</h2>
            {counters.length === 0 ? (
              <p className="text-white/70">
                No Pokemon have both resistances and super-effective attacks
              </p>
            ) : (
              <>
                <p className="text-sm text-white/80 mb-4">
                  These Pokemon resist {pokemon.name}'s attacks and hit back super-effectively
                </p>
                <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {counters.slice(0, 8).map((counter) => (
                    <PokemonCard key={counter.id} pokemon={counter} />
                  ))}
                </div>
                {counters.length > 8 && (
                  <p className="text-xs text-white/60 mt-2 text-center">
                    +{counters.length - 8} more counters
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
