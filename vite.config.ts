import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    // Detect if running in Replit environment
    const isReplit = process.env.REPL_ID || process.env.REPLIT_DEPLOYMENT;
    
    // Configure for environment-specific settings
    const host = env.VITE_HOST || (isReplit ? '0.0.0.0' : 'localhost');
    const port = Number(env.VITE_PORT || 5000);
    
    return {
      server: {
        port: port,
        host: host,
        open: !isReplit, // Only auto-open browser in local development
        allowedHosts: isReplit ? true : undefined,
        hmr: {
          port: port,
          ...(isReplit && { clientPort: 443 })
        }
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(process.env.GEMINI_API_KEY || ''),
        'process.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY || '')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
