# Deployment Guide

## Deploying to Vercel

### Quick Deploy

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Vercel will automatically detect Vite and configure:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

6. Click "Deploy"

The build process will automatically fetch fresh Pokemon data from PokeAPI during deployment.

### Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow Vercel's DNS configuration instructions

### Environment Variables

No environment variables are required. PokeAPI is a public API.

### Build Configuration

If you need to customize the build settings:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "framework": "vite"
}
```

### Troubleshooting

**Build fails with PokeAPI timeout:**
- Retry the deployment. PokeAPI sometimes rate-limits.
- The build script has automatic retry logic for transient failures.

**CSS not loading:**
- Ensure `@tailwindcss/postcss` is in devDependencies
- Clear Vercel cache and redeploy

**Routes not working (404 on refresh):**
- Vercel automatically handles SPA routing for Vite projects
- If issues persist, create `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Deploying to Other Platforms

### Netlify

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### GitHub Pages

1. Install gh-pages: `npm install -D gh-pages`
2. Add to package.json scripts:
   ```json
   "deploy": "npm run build && gh-pages -d dist"
   ```
3. Update `vite.config.ts` to set base path:
   ```typescript
   export default defineConfig({
     base: '/your-repo-name/',
     plugins: [react()],
   })
   ```
4. Run: `npm run deploy`

### Cloudflare Pages

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set build output directory: `dist`
4. Deploy

## Performance Optimization

- Images are lazy-loaded for optimal performance
- Code splitting is enabled by default with Vite
- All Pokemon data is bundled at build time (~30KB compressed)
- Total bundle size: ~80KB gzipped (excluding images)
- Images are served from PokeAPI's CDN

## Monitoring

After deployment, test these scenarios:
- Homepage loads and displays 151 Pokemon
- Search and filter work correctly
- Clicking a Pokemon shows detail page
- Counter Pokemon list generates correctly
- Dark mode switches with system preference
- All routes work (including direct URL access)
- Browser back/forward buttons work
