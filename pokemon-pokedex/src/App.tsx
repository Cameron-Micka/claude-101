import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import type { Pokemon, TypeEffectiveness } from './types';
import Home from './pages/Home';
import PokemonPage from './pages/PokemonPage';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [typeChart, setTypeChart] = useState<TypeEffectiveness | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load data
    async function loadData() {
      try {
        const [pokemonData, typeChartData] = await Promise.all([
          import('./data/pokemon.json'),
          import('./data/typeChart.json'),
        ]);

        setPokemon(pokemonData.default as Pokemon[]);
        setTypeChart(typeChartData.default as TypeEffectiveness);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load Pokemon data. Please try refreshing the page.');
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Set default page title
  useEffect(() => {
    document.title = 'Pokedex';
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !typeChart) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-700 dark:text-gray-300">{error || 'Failed to load data'}</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home pokemon={pokemon} />} />
        <Route
          path="/pokemon/:idOrName"
          element={<PokemonPage pokemon={pokemon} typeChart={typeChart} />}
        />
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Home pokemon={pokemon} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
