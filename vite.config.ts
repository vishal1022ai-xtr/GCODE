import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    // Detect if running in Replit environment
    const isReplit = process.env.REPL_ID || process.env.REPLIT_DEPLOYMENT;
    
    // Configure for environment-specific settings
    const host = env.VITE_HOST || (isReplit ? '0.0.0.0' : 'localhost');
    const port = Number(env.VITE_PORT || (isReplit ? 5000 : 5173));
    
    return {
      server: {
        port: port,
        host: host,
        open: !isReplit, // Only auto-open browser in local development
        allowedHosts: isReplit ? true : undefined,
        strictPort: false, // Allow Vite to try next port if current is busy
        hmr: {
          port: port,
          ...(isReplit && { clientPort: 443 })
        },
        // Handle CORS for local development
        cors: true,
        // Clear screen on restart
        clearScreen: false
      },
      plugins: [
        react({
          // Handle JSX in JS files
          include: "**/*.{jsx,tsx,js,ts}",
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.API_KEY || ''),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.API_KEY || ''),
        // Define NODE_ENV for proper environment detection
        'process.env.NODE_ENV': JSON.stringify(mode)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
          // Add common aliases for better module resolution
          '~': path.resolve(__dirname, '.'),
          'src': path.resolve(__dirname, '.'),
        },
        // Handle different file extensions
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
      },
      // Optimize dependencies for better performance
      optimizeDeps: {
        include: [
          'react',
          'react-dom',
          '@google/genai'
        ],
        // Force pre-bundling of these packages
        force: mode === 'development'
      },
      // Build configuration for production
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: mode === 'development',
        // Disable minification in development for easier debugging
        minify: mode === 'production',
        // Handle large assets
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
          output: {
            // Better chunk splitting
            manualChunks: {
              vendor: ['react', 'react-dom'],
              ai: ['@google/genai']
            }
          }
        }
      },
      // Environment-specific CSS handling
      css: {
        devSourcemap: true,
        // PostCSS configuration for Tailwind
        postcss: {
          plugins: []
        }
      },
      // Handle environment variables
      envPrefix: ['VITE_', 'GEMINI_'],
      envDir: '.'
    };
});
