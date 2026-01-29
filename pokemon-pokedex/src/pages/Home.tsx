import type { Pokemon } from '../types';
import PokemonGrid from '../components/PokemonGrid';

interface HomeProps {
  pokemon: Pokemon[];
}

export default function Home({ pokemon }: HomeProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Pokedex
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gen 1 Pokemon Encyclopedia
          </p>
        </div>
      </header>
      <main>
        <PokemonGrid pokemon={pokemon} />
      </main>
    </div>
  );
}
