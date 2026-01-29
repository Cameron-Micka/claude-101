import { writeFileSync } from 'fs';
import { join } from 'path';

interface RawPokemon {
  id: number;
  name: string;
  types: Array<{
    type: {
      name: string;
    };
  }>;
  sprites: {
    front_default: string;
  };
}

interface Pokemon {
  id: number;
  name: string;
  types: string[];
  spriteUrl: string;
}

interface TypeRelations {
  double_damage_to: Array<{ name: string }>;
  half_damage_to: Array<{ name: string }>;
  no_damage_to: Array<{ name: string }>;
}

interface RawType {
  name: string;
  damage_relations: TypeRelations;
}

interface TypeEffectiveness {
  [attackingType: string]: {
    [defendingType: string]: number;
  };
}

const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

async function fetchWithRetry(url: string, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`Retry ${i + 1}/${retries} for ${url}`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

async function fetchAllPokemon(): Promise<Pokemon[]> {
  console.log('Fetching Pokemon data from PokeAPI...');

  const promises = Array.from({ length: 151 }, (_, i) =>
    fetchWithRetry(`https://pokeapi.co/api/v2/pokemon/${i + 1}`)
  );

  try {
    const results: RawPokemon[] = await Promise.all(promises);

    const pokemon: Pokemon[] = results.map(p => ({
      id: p.id,
      name: p.name,
      types: p.types.map(t => t.type.name),
      spriteUrl: p.sprites.front_default
    }));

    console.log(`✓ Fetched ${pokemon.length} Pokemon`);
    return pokemon;
  } catch (error) {
    console.error('Failed to fetch Pokemon data:', error);
    throw new Error(`Failed to fetch data from PokeAPI: ${error}`);
  }
}

async function fetchTypeChart(): Promise<TypeEffectiveness> {
  console.log('Fetching type effectiveness data...');

  const promises = POKEMON_TYPES.map(type =>
    fetchWithRetry(`https://pokeapi.co/api/v2/type/${type}`)
  );

  try {
    const results: RawType[] = await Promise.all(promises);

    // Build effectiveness matrix
    const typeChart: TypeEffectiveness = {};

    // Initialize with 1x (neutral) for all combinations
    for (const attackType of POKEMON_TYPES) {
      typeChart[attackType] = {};
      for (const defendType of POKEMON_TYPES) {
        typeChart[attackType][defendType] = 1;
      }
    }

    // Fill in special effectiveness
    for (const typeData of results) {
      const attackType = typeData.name;

      // Super effective (2x)
      for (const target of typeData.damage_relations.double_damage_to) {
        typeChart[attackType][target.name] = 2;
      }

      // Not very effective (0.5x)
      for (const target of typeData.damage_relations.half_damage_to) {
        typeChart[attackType][target.name] = 0.5;
      }

      // No effect (0x)
      for (const target of typeData.damage_relations.no_damage_to) {
        typeChart[attackType][target.name] = 0;
      }
    }

    console.log(`✓ Built type effectiveness chart for ${POKEMON_TYPES.length} types`);
    return typeChart;
  } catch (error) {
    console.error('Failed to fetch type data:', error);
    throw new Error(`Failed to fetch type data from PokeAPI: ${error}`);
  }
}

async function main() {
  try {
    console.log('Starting data fetch from PokeAPI...\n');

    const [pokemon, typeChart] = await Promise.all([
      fetchAllPokemon(),
      fetchTypeChart()
    ]);

    // Save to JSON files
    const dataDir = join(process.cwd(), 'src', 'data');

    writeFileSync(
      join(dataDir, 'pokemon.json'),
      JSON.stringify(pokemon, null, 2)
    );
    console.log('✓ Saved pokemon.json');

    writeFileSync(
      join(dataDir, 'typeChart.json'),
      JSON.stringify(typeChart, null, 2)
    );
    console.log('✓ Saved typeChart.json');

    console.log('\n✅ Data fetch completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Build failed:', error);
    process.exit(1);
  }
}

main();
