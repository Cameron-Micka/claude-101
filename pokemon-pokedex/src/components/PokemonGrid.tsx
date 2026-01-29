import { useState, useMemo } from 'react';
import type { Pokemon } from '../types';
import PokemonCard from './PokemonCard';
import SearchBar from './SearchBar';
import TypeFilter from './TypeFilter';

interface PokemonGridProps {
  pokemon: Pokemon[];
}

export default function PokemonGrid({ pokemon }: PokemonGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filteredPokemon = useMemo(() => {
    return pokemon.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = !selectedType || p.types.includes(selectedType);
      return matchesSearch && matchesType;
    });
  }, [pokemon, searchQuery, selectedType]);

  return (
    <div>
      {/* Search and Filter Bar */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="max-w-7xl mx-auto flex gap-4 flex-col sm:flex-row">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <TypeFilter selectedType={selectedType} onChange={setSelectedType} />
        </div>
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto px-4 mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredPokemon.length} of {pokemon.length} Pokemon
        </p>
      </div>

      {/* Pokemon Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {filteredPokemon.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No Pokemon found matching your criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPokemon.map((p) => (
              <PokemonCard key={p.id} pokemon={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
