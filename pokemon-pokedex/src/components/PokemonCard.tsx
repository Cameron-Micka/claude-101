import { Link } from 'react-router-dom';
import { Card } from '@fluentui/react-components';
import type { Pokemon } from '../types';
import TypeBadge from './TypeBadge';
import { useLazyImage } from '../hooks/useLazyImage';
import { getTypeColor } from '../utils/typeColors';

interface PokemonCardProps {
  pokemon: Pokemon;
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const { imageSrc, imgRef } = useLazyImage(pokemon.spriteUrl);

  // Calculate HP based on pokemon ID (just for display purposes)
  const hp = Math.min(30 + pokemon.id * 2, 150);

  // Get type colors for card background
  const primaryColor = getTypeColor(pokemon.types[0]);
  const secondaryColor = pokemon.types[1] ? getTypeColor(pokemon.types[1]) : primaryColor;

  // Desaturate color by mixing with white/light gray
  const desaturateColor = (color: string, amount: number = 0.7) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Mix with light color (230, 230, 230) for desaturation
    const mix = (val: number) => Math.round(val + (230 - val) * amount);

    return `#${mix(r).toString(16).padStart(2, '0')}${mix(g).toString(16).padStart(2, '0')}${mix(b).toString(16).padStart(2, '0')}`;
  };

  const bgPrimaryColor = desaturateColor(primaryColor);
  const bgSecondaryColor = desaturateColor(secondaryColor);

  return (
    <Link to={`/pokemon/${pokemon.id}`} className="block no-underline">
      <Card
        className="pokemon-card relative overflow-hidden transition-transform hover:scale-105 hover:shadow-2xl"
        style={{
          background: `linear-gradient(135deg, ${bgPrimaryColor} 0%, ${bgSecondaryColor} 100%)`,
          borderRadius: '16px',
          border: '8px solid #f4d03f',
          padding: '12px',
          width: '240px', // Fixed width
          height: '336px', // Fixed height (240 * 7/5 = 336 for 5:7 ratio)
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Card Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <span className="inline-block px-2 py-0.5 text-xs font-bold bg-white/80 rounded mb-1">
              BASIC
            </span>
            <h3 className="text-lg font-bold capitalize text-gray-900 leading-tight truncate">
              {pokemon.name}
            </h3>
          </div>
          <div className="flex items-center ml-2 flex-shrink-0">
            <span className="text-sm font-bold">HP</span>
            <span className="text-xl font-bold" style={{ marginLeft: '4px', marginRight: '12px' }}>{hp}</span>
            {pokemon.types[0] && <TypeBadge type={pokemon.types[0]} size="sm" />}
          </div>
        </div>

        {/* Image Frame */}
        <div
          className="relative mb-2 p-2 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg flex-1"
          style={{
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          <div 
            className="rounded p-3 flex items-center justify-center h-full"
            style={{ 
              background: 'linear-gradient(135deg, #d0d0d0 0%, #c2c1c1 100%)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            <img
              ref={imgRef}
              src={imageSrc || undefined}
              alt={`${pokemon.name} sprite`}
              className="pixelated max-w-full max-h-full"
              style={{ imageRendering: 'pixelated', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' }}
            />
          </div>
          {/* Frame decoration */}
          <div className="absolute top-1 left-1 w-2 h-2 bg-gray-500 rounded-full"></div>
          <div className="absolute top-1 right-1 w-2 h-2 bg-gray-500 rounded-full"></div>
          <div className="absolute bottom-1 left-1 w-2 h-2 bg-gray-500 rounded-full"></div>
          <div className="absolute bottom-1 right-1 w-2 h-2 bg-gray-500 rounded-full"></div>
        </div>

        {/* Type Info */}
        <div className="bg-white/60 rounded-lg p-4 mb-2">
          <div className="flex gap-3 justify-center flex-wrap">
            {pokemon.types.map((type) => (
              <TypeBadge key={type} type={type} size="sm" />
            ))}
          </div>
        </div>

        {/* Card Footer */}
        <div className="bg-white/40 rounded px-2 py-1 text-center mt-auto">
          <p className="text-xs font-mono font-bold text-gray-700">
            NO. {pokemon.id.toString().padStart(3, '0')}
          </p>
        </div>
      </Card>
    </Link>
  );
}
