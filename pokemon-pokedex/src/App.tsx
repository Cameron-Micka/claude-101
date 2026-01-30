import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
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
      <FluentProvider theme={webLightTheme}>
        <div
          className="min-h-screen flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          }}
        >
          <LoadingSpinner />
        </div>
      </FluentProvider>
    );
  }

  if (error || !typeChart) {
    return (
      <FluentProvider theme={webLightTheme}>
        <div
          className="min-h-screen flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          }}
        >
          <div className="text-center bg-white/90 rounded-xl shadow-2xl p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
            <p className="text-gray-700">{error || 'Failed to load data'}</p>
          </div>
        </div>
      </FluentProvider>
    );
  }

  return (
    <FluentProvider theme={webLightTheme}>
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
    </FluentProvider>
  );
}

export default App;
