# Pokemon Pokedex

A Gen 1 Pokemon Pokedex website built with React, TypeScript, and Tailwind CSS. View Pokemon stats and determine type matchups and counters.

## Features

- Browse all 151 Gen 1 Pokemon in a responsive grid
- Search Pokemon by name
- Filter by type
- View detailed Pokemon information
- See type effectiveness (weaknesses, resistances, immunities)
- Find counter Pokemon based on type advantages
- Dark mode support (automatic based on system preference)
- Lazy-loaded images for optimal performance

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- PokeAPI

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Fetch Pokemon data from PokeAPI:
   ```bash
   npm run build:data
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser to the URL shown (typically http://localhost:5173)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build:data` - Fetch Pokemon data from PokeAPI
- `npm run build` - Build for production (fetches data first)
- `npm run preview` - Preview production build

## Deployment

This project is configured for deployment to Vercel:

1. Push to GitHub
2. Import project in Vercel
3. Vercel will automatically detect Vite and use the correct build settings
4. Deploy!

The build process automatically fetches fresh data from PokeAPI during deployment.

## Project Structure

```
pokemon-pokedex/
├── src/
│   ├── components/      # React components
│   ├── data/           # Generated Pokemon data (JSON)
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── scripts/        # Build scripts
│   ├── utils/          # Utility functions
│   ├── types.ts        # TypeScript interfaces
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
├── public/             # Static assets
└── README.md
```

## License

MIT
