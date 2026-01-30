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
      <div
        className="sticky top-0 z-10 shadow-lg border-b-4 border-yellow-500 p-4 mb-6"
        style={{
          background: 'linear-gradient(135deg, #f4d03f 0%, #f9e79f 100%)',
        }}
      >
        <div 
          className="flex gap-4 flex-col sm:flex-row"
          style={{ maxWidth: '600px', margin: '0 auto' }}
        >
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <TypeFilter selectedType={selectedType} onChange={setSelectedType} />
        </div>
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto px-4 mb-4">
        <div className="bg-white/90 rounded-lg px-4 py-2 inline-block shadow">
          <p className="text-sm font-semibold text-gray-700">
            📋 Showing {filteredPokemon.length} of {pokemon.length} Pokemon
          </p>
        </div>
      </div>

      {/* Pokemon Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {filteredPokemon.length === 0 ? (
          <div className="text-center py-12 bg-white/80 rounded-xl shadow-lg">
            <p className="text-gray-700 text-lg font-semibold">
              🔍 No Pokemon found matching your criteria
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center" style={{ gap: '2rem' }}>
            {filteredPokemon.map((p) => (
              <PokemonCard key={p.id} pokemon={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
