# Pokemon Pokedex Website - Specification

## Project Overview
A Gen 1 Pokemon Pokedex website that displays the original 151 Pokemon with their types and calculates which Pokemon are effective counters based on type matchups.

## Core Features
1. **Pokemon Grid View**: Display all 151 Gen 1 Pokemon in a responsive grid
2. **Individual Pokemon Pages**: Detailed view for each Pokemon with routing
3. **Type Effectiveness**: Calculate and display type matchups with multipliers
4. **Counter Analysis**: Show specific Pokemon that resist AND can hit super-effectively
5. **Search & Filter**: Filter by Pokemon name and type
6. **Dark Mode**: Automatic theme switching based on system preference

## Technical Stack
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Deployment**: Vercel
- **Data Source**: PokeAPI (build-time static fetch)

## Scope Constraints

### Included
- Original 151 Gen 1 Pokemon (Bulbasaur #1 to Mew #151)
- Basic type effectiveness calculations (2x, 0.5x, 0x multipliers)
- Type badges with official Pokemon type colors
- Responsive design (4 columns desktop, 2-3 columns mobile)
- Dynamic page titles per Pokemon

### Explicitly Excluded
- Alolan forms or any non-Kanto regional variants
- Pokemon stats (HP, Attack, Defense, etc.)
- Abilities that modify type effectiveness (Levitate, Wonder Guard, etc.)
- Move data, movesets, or coverage moves
- STAB (Same Type Attack Bonus) prioritization in counters
- Evolution stage filtering
- Legendary/Mythical filtering
- Base Stat Total (BST) information
- PWA/offline support
- Open Graph meta tags for social sharing

## Data Architecture

### Build-Time Data Fetching
The application fetches all data during build time from PokeAPI and bundles it statically:

1. **Pokemon Data** (151 requests):
   - Endpoint: `https://pokeapi.co/api/v2/pokemon/{id}` (id: 1-151)
   - Extract: name, id, types, sprites (front_default)
   - Structure:
   ```typescript
   interface Pokemon {
     id: number;
     name: string;
     types: string[]; // e.g., ["fire", "flying"]
     spriteUrl: string;
   }
   ```

2. **Type Chart Data** (18 requests):
   - Endpoint: `https://pokeapi.co/api/v2/type/{type-name}` for all 18 types
   - Extract: damage_relations (double_damage_to, half_damage_to, no_damage_to)
   - Build effectiveness matrix for O(1) lookups
   - Structure:
   ```typescript
   interface TypeEffectiveness {
     [attackingType: string]: {
       [defendingType: string]: number; // 0, 0.5, 1, 2
     };
   }
   ```

3. **Build Failure Handling**:
   - If any PokeAPI request fails, the build must fail with a clear error message
   - No fallback to stale data or partial builds
   - Log which endpoint failed and the HTTP status code

### Data Processing
- Pre-calculate all type matchups during build
- Generate a lookup map: `pokemonById` and `pokemonByName` for O(1) access
- Store all data in `/src/data/pokemon.json` and `/src/data/typeChart.json`

## UI/UX Design

### Homepage (/)
- Directly displays grid of all 151 Pokemon
- No landing page or hero section
- Fixed order by Pokedex number (1-151, not sortable)

### Pokemon Grid
- **Desktop**: 4 columns
- **Tablet**: 3 columns
- **Mobile**: 2 columns
- **Card Contents**:
  - Pokemon sprite (pixel art from Gen 1-5 style)
  - Pokedex number (#001 format)
  - Pokemon name (capitalized)
  - Type badge(s)
- **Image Loading**: Lazy load sprites as user scrolls with Intersection Observer
- **Hover State**: Subtle scale or shadow effect

### Search & Filter Bar
- **Search**: Text input for Pokemon name (real-time filtering)
- **Type Filter**: Dropdown or button group to filter by single type
  - Shows Pokemon that have that type (either primary or secondary)
  - "All Types" option to clear filter
- Positioned above the grid, sticky on scroll

### Pokemon Detail Page (/pokemon/:id or /pokemon/:name)
Route supports both ID and name (e.g., `/pokemon/25` or `/pokemon/pikachu`)

**Layout**:
1. **Header Section**:
   - Large Pokemon sprite
   - Pokemon name (title case)
   - Pokedex number
   - Type badges

2. **Type Effectiveness Section**:
   - Title: "Type Effectiveness"
   - Grid showing all 18 types with multipliers
   - Color coding:
     - Red/Strong: 2x, 4x (takes increased damage)
     - Gray/Neutral: 1x
     - Green/Weak: 0.5x, 0.25x (resists)
     - Blue/Immune: 0x (immune)
   - Format: "Fire: 2x", "Water: 0.5x", etc.
   - Display final multiplier only (no calculation breakdown for dual types)

3. **Counters Section**:
   - Title: "Good Counters"
   - List of Pokemon that:
     - Resist at least one of the target's types (defensive advantage)
     - Can hit the target super-effectively with their own STAB types (offensive advantage)
   - Each counter shows: sprite thumbnail, name, types
   - Clicking a counter navigates to that Pokemon's detail page
   - If no counters exist, show: "No Pokemon have both resistances and super-effective attacks"

4. **Back Navigation**:
   - Link/button to return to homepage
   - Browser back button should work (proper routing)

**Invalid Routes**:
- If route parameter is invalid (e.g., /pokemon/999, /pokemon/charizard-mega)
- Automatically redirect to homepage (/)

### Type Badges
- Use official Pokemon type colors:
  - Normal: #A8A878
  - Fire: #F08030
  - Water: #6890F0
  - Electric: #F8D030
  - Grass: #78C850
  - Ice: #98D8D8
  - Fighting: #C03028
  - Poison: #A040A0
  - Ground: #E0C068
  - Flying: #A890F0
  - Psychic: #F85888
  - Bug: #A8B820
  - Rock: #B8A038
  - Ghost: #705898
  - Dragon: #7038F8
  - Dark: #705848
  - Steel: #B8B8D0
  - Fairy: #EE99AC
- Rounded pill shape with white text
- Small size in grid, larger in detail view

### Dark Mode
- Detect system preference: `prefers-color-scheme: dark`
- No manual toggle
- Color scheme:
  - **Light**: White background, dark text, subtle shadows
  - **Dark**: Dark gray/near-black background (#1a1a1a), light text (#e5e5e5), darker cards
- Ensure type badges remain readable in both modes

### Loading States
- **Initial Grid Load**: Full-page spinner while data loads (should be instant since it's bundled)
- **Route Transitions**: Brief loading indicator (spinner or skeleton) when navigating between Pokemon pages
- **Image Loading**: Show gray placeholder box while sprite loads during lazy loading

### Responsive Behavior
- Grid column breakpoints:
  - `sm:` (640px): 2 columns
  - `md:` (768px): 3 columns
  - `lg:` (1024px): 4 columns
- Detail page stacks vertically on mobile
- Search/filter bar adapts to single column on mobile

## Routing

### Routes
1. `/` - Homepage with Pokemon grid
2. `/pokemon/:idOrName` - Pokemon detail page
   - Supports both numeric ID (1-151) and lowercase name
   - Examples: `/pokemon/25`, `/pokemon/pikachu`
   - Invalid routes redirect to `/`

### Navigation Behavior
- Grid card click → Navigate to `/pokemon/:id`
- Counter Pokemon click → Navigate to that Pokemon's page (users can navigate chains)
- Back button works correctly (uses `navigate(-1)` or link to `/`)
- Page titles update: `"Pikachu - Pokedex"`, `"Pokedex"` (homepage)

## Type Effectiveness System

### Calculation Logic
For a Pokemon with types `[type1, type2?]` and an incoming attack of `attackType`:

```typescript
function calculateEffectiveness(attackType: string, defenderTypes: string[]): number {
  let multiplier = 1;

  for (const defenderType of defenderTypes) {
    const effectiveness = typeChart[attackType][defenderType];
    multiplier *= effectiveness; // 0, 0.5, 1, or 2
  }

  return multiplier; // Possible values: 0, 0.25, 0.5, 1, 2, 4
}
```

### Display Format
- Show all 18 types in a grid or list
- Each type shows: "Type Name: Xх" (e.g., "Fire: 2x", "Water: 0.5x")
- Group or sort by effectiveness:
  - Weaknesses first (4x, 2x)
  - Then resistances (0.5x, 0.25x)
  - Then immunities (0x)
  - Neutral last (1x) or hide entirely

### Counter Pokemon Logic

#### Definition
A Pokemon is a "good counter" if it satisfies BOTH conditions:
1. **Resists** the target Pokemon's STAB moves (at least one of target's types deals ≤1x damage)
2. **Hits super-effectively** with its own STAB moves (at least one of counter's types deals ≥2x damage to target)

#### Algorithm
```typescript
function findCounters(targetPokemon: Pokemon, allPokemon: Pokemon[], typeChart: TypeEffectiveness): Pokemon[] {
  const targetTypes = targetPokemon.types;

  return allPokemon.filter(pokemon => {
    if (pokemon.id === targetPokemon.id) return false; // Exclude self

    // Check defensive advantage: resists at least one of target's types
    const resists = targetTypes.some(targetType =>
      pokemon.types.some(pokemonType =>
        calculateEffectiveness(targetType, [pokemonType]) <= 1
      )
    );

    // Check offensive advantage: can hit super-effectively
    const hitsSuper = pokemon.types.some(pokemonType =>
      calculateEffectiveness(pokemonType, targetTypes) >= 2
    );

    return resists && hitsSuper;
  });
}
```

#### Sorting
- No STAB prioritization
- Default sort: Pokedex number order
- All counters shown equally

#### Edge Cases
- If target is Normal-type (e.g., Rattata), few counters may exist (Fighting types)
- If no counters found, display message: "No Pokemon have both resistances and super-effective attacks"

## Build Process

### Build Script (`src/scripts/fetchData.ts`)
```typescript
// Pseudocode structure
async function fetchAllData() {
  // 1. Fetch all 151 Pokemon
  const pokemonPromises = Array.from({ length: 151 }, (_, i) =>
    fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`)
  );

  const pokemonData = await Promise.all(pokemonPromises);

  // 2. Fetch all 18 type relationships
  const types = ['normal', 'fire', 'water', /* ... all 18 types */];
  const typePromises = types.map(type =>
    fetch(`https://pokeapi.co/api/v2/type/${type}`)
  );

  const typeData = await Promise.all(typePromises);

  // 3. Process and save to JSON files
  saveToFile('./src/data/pokemon.json', processedPokemon);
  saveToFile('./src/data/typeChart.json', processedTypeChart);
}
```

### Build Command
```bash
npm run build:data  # Fetch data from PokeAPI
npm run build       # Vite build
```

### Error Handling
- Wrap all fetch calls in try-catch
- If any request fails (network error, 404, rate limit):
  - Log error with URL and status
  - Exit build with non-zero code
  - Display: "Failed to fetch data from PokeAPI: [url]"
- No retry logic or fallback data

## Performance Optimizations

### Image Loading
- **Lazy Loading**: Use Intersection Observer API for grid images
  - Load images only when within viewport + 200px margin
  - Show gray placeholder until loaded
- **Image Format**: PNG from PokeAPI (no conversion needed)
- **Caching**: Browser caching headers from PokeAPI CDN

### Bundle Size
- Code splitting by route (lazy load detail page component)
- Tree-shake unused Tailwind classes with JIT mode
- All Pokemon data bundled (~150KB JSON after compression)
- Total initial bundle target: <500KB

### Runtime Performance
- Memoize counter calculations (useMemo)
- Virtual scrolling NOT needed (151 items manageable)
- Debounce search input (300ms)
- Use React.memo for Pokemon card components

## Accessibility

### Minimum Requirements
- Semantic HTML5 elements (`<header>`, `<main>`, `<nav>`, `<article>`)
- Proper heading hierarchy (h1 → h2 → h3)
- Keyboard navigation:
  - Tab through grid cards
  - Enter/Space to activate links
  - Focus visible states (outline on interactive elements)
- Alt text for all Pokemon sprites: "Pikachu sprite"
- Color contrast meets WCAG 2.1 AA for text (4.5:1 ratio)
- Skip to main content link (optional, nice to have)

### Not Required
- Full WCAG 2.1 AA compliance
- ARIA labels (unless needed for semantic clarity)
- Screen reader testing
- High contrast mode

## Deployment

### Platform: Vercel
- Connect GitHub repository
- Auto-deploy on push to main branch
- Build command: `npm run build:data && npm run build`
- Output directory: `dist`
- Environment: Node.js 18+

### Environment Variables
None required (PokeAPI is public)

### Custom Domain (Optional)
- Configure in Vercel settings if desired
- SSL automatic via Vercel

## File Structure
```
pokemon-pokedex/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── PokemonCard.tsx
│   │   ├── PokemonGrid.tsx
│   │   ├── PokemonDetail.tsx
│   │   ├── TypeBadge.tsx
│   │   ├── SearchBar.tsx
│   │   ├── TypeFilter.tsx
│   │   └── LoadingSpinner.tsx
│   ├── data/
│   │   ├── pokemon.json (generated)
│   │   └── typeChart.json (generated)
│   ├── hooks/
│   │   └── useLazyImage.ts
│   ├── pages/
│   │   ├── Home.tsx
│   │   └── PokemonPage.tsx
│   ├── scripts/
│   │   └── fetchData.ts
│   ├── utils/
│   │   ├── typeEffectiveness.ts
│   │   ├── findCounters.ts
│   │   └── typeColors.ts
│   ├── App.tsx
│   ├── index.css (Tailwind imports)
│   └── main.tsx
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Development Workflow
1. Run `npm run build:data` to fetch Pokemon data (run once, commit the JSON files)
2. Run `npm run dev` for local development
3. Make changes and test in browser
4. Push to GitHub → automatic Vercel deployment

## Testing Strategy
### Manual Testing Checklist
- [ ] All 151 Pokemon display correctly in grid
- [ ] Search filters Pokemon by name (case-insensitive)
- [ ] Type filter shows correct Pokemon
- [ ] Clicking Pokemon card navigates to detail page
- [ ] Type effectiveness displays correct multipliers
- [ ] Counters list shows Pokemon with two-way advantage
- [ ] Clicking counter navigates to that Pokemon
- [ ] Invalid routes redirect to homepage
- [ ] Dark mode switches with system preference
- [ ] Responsive layout works on mobile/tablet/desktop
- [ ] Lazy loading works when scrolling grid
- [ ] Browser back button works correctly
- [ ] Page titles update per Pokemon

### Edge Cases to Test
- Pokemon with single type (e.g., Pikachu - Electric only)
- Pokemon with dual types (e.g., Charizard - Fire/Flying)
- Pokemon with 4x weakness (e.g., Parasect - Bug/Grass weak to Fire)
- Pokemon with 0x immunity (e.g., Ground immune to Electric)
- Pokemon with no counters (verify message displays)
- Pokemon with many counters (verify list scrolls/wraps)
- Very long Pokemon names (verify text doesn't overflow)
- Slow network (verify loading states)

## Success Criteria
1. All 151 Gen 1 Pokemon are viewable
2. Type effectiveness calculations are accurate
3. Counter system correctly identifies two-way advantages
4. Site loads quickly (<3 seconds on 3G)
5. Works on Chrome, Firefox, Safari (latest versions)
6. Mobile-responsive and usable on phones
7. Dark mode adapts to system preference
8. Successfully deployed to Vercel with custom URL

## Future Enhancements (Out of Scope for V1)
- Add Pokemon stats display (HP, Attack, Defense, etc.)
- Team builder (select 6 Pokemon, analyze team weaknesses)
- Compare two Pokemon side-by-side
- Add more generations
- Include move data and coverage analysis
- Ability effects on type matchups
- Evolution chains visualization
- PWA with offline support
- User accounts and favorites
- Battle simulator

## Timeline Estimate
*Note: Per project guidelines, no time estimates provided*

## References
- PokeAPI Documentation: https://pokeapi.co/docs/v2
- Pokemon Type Chart: https://pokemondb.net/type
- Official Pokemon Type Colors: https://github.com/duiker101/pokemon-type-svg-icons
- React Router: https://reactrouter.com/
- Tailwind CSS: https://tailwindcss.com/docs
- Vite: https://vitejs.dev/guide/
