import type { Pokemon } from '../types';
import PokemonGrid from '../components/PokemonGrid';

interface HomeProps {
  pokemon: Pokemon[];
}

export default function Home({ pokemon }: HomeProps) {
  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      }}
    >
      <header className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 shadow-2xl border-b-4 border-yellow-600">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.3)' }}>
            ⚡ Pokédex ⚡
          </h1>
          <p className="text-white text-lg mt-2 drop-shadow" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
            Gen 1 Pokemon Card Collection
          </p>
        </div>
      </header>
      <main>
        <PokemonGrid pokemon={pokemon} />
      </main>
    </div>
  );
}
