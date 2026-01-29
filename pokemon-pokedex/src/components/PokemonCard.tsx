import { Link } from 'react-router-dom';
import type { Pokemon } from '../types';
import TypeBadge from './TypeBadge';
import { useLazyImage } from '../hooks/useLazyImage';

interface PokemonCardProps {
  pokemon: Pokemon;
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const { imageSrc, imgRef } = useLazyImage(pokemon.spriteUrl);

  return (
    <Link
      to={`/pokemon/${pokemon.id}`}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg mb-2">
          <img
            ref={imgRef}
            src={imageSrc || undefined}
            alt={`${pokemon.name} sprite`}
            className="pixelated max-w-full max-h-full"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            #{pokemon.id.toString().padStart(3, '0')}
          </p>
          <h3 className="text-lg font-bold capitalize text-gray-900 dark:text-gray-100 mb-2">
            {pokemon.name}
          </h3>
          <div className="flex gap-1 justify-center flex-wrap">
            {pokemon.types.map((type) => (
              <TypeBadge key={type} type={type} size="sm" />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
