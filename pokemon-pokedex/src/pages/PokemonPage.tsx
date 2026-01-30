import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Pokemon, TypeEffectiveness } from '../types';
import PokemonDetail from '../components/PokemonDetail';
import LoadingSpinner from '../components/LoadingSpinner';

interface PokemonPageProps {
  pokemon: Pokemon[];
  typeChart: TypeEffectiveness;
}

export default function PokemonPage({ pokemon, typeChart }: PokemonPageProps) {
  const { idOrName } = useParams<{ idOrName: string }>();
  const navigate = useNavigate();
  const [currentPokemon, setCurrentPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    if (!idOrName) {
      navigate('/');
      return;
    }

    // Try to find by ID first (if numeric), then by name
    let found: Pokemon | undefined;

    const numericId = parseInt(idOrName, 10);
    if (!isNaN(numericId)) {
      found = pokemon.find((p) => p.id === numericId);
    } else {
      found = pokemon.find((p) => p.name.toLowerCase() === idOrName.toLowerCase());
    }

    if (found) {
      setCurrentPokemon(found);
      // Update page title
      document.title = `${found.name.charAt(0).toUpperCase() + found.name.slice(1)} - Pokedex`;
    } else {
      // Invalid Pokemon, redirect to home
      navigate('/');
      return;
    }

    // Brief loading state for UX
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, [idOrName, pokemon, navigate]);

  if (loading || !currentPokemon) {
    return (
      <div
        className="min-h-screen"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      }}
    >
      <PokemonDetail pokemon={currentPokemon} allPokemon={pokemon} typeChart={typeChart} />
    </div>
  );
}
