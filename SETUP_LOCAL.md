# Local Development Setup for MediMinder AI

This guide helps you run the MediMinder AI project on your local PC with VSCode.

## Quick Setup (Automated)

Simply run the Python setup script that will handle everything automatically:

```bash
python setup_dev.py
```

The script will:
- ✅ Check and install Node.js (18+ required)
- ✅ Install all project dependencies 
- ✅ Handle port conflicts automatically
- ✅ Configure the project for local development
- ✅ Start the development server and open your browser

## What the Script Does

### 1. Node.js Installation
- **Windows**: Uses `winget` or `chocolatey` 
- **macOS**: Uses `Homebrew`
- **Linux**: Uses `apt`, `dnf`, or `pacman`

### 2. Port Management
- Prefers port 5173 (Vite default) or 5000
- If busy, offers to kill the process or use a different port
- Automatically finds the next available port

### 3. Dependency Installation
- Uses `npm ci` for reproducible builds (if package-lock.json exists)
- Falls back to `npm install` if needed
- Handles peer dependency conflicts with `--legacy-peer-deps`

### 4. Configuration
- Backs up your current `vite.config.ts`
- Updates configuration for localhost development
- Sets proper HMR (Hot Module Replacement) settings

### 5. Server Launch
- Starts the development server on the chosen port
- Automatically opens your browser to the application
- Streams live server logs to your terminal

## Manual Setup (If Needed)

If the automated script fails, you can set up manually:

### Prerequisites
- Node.js 18 or later ([Download here](https://nodejs.org/))
- npm (comes with Node.js)

### Steps
1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open browser:**
   - Navigate to `http://localhost:5173` (or the port shown in terminal)

## Troubleshooting

### Common Issues

**Port 5173 already in use:**
- The script will automatically handle this
- Or manually change port: `npm run dev -- --port 3000`

**Node.js not found:**
- Install from [nodejs.org](https://nodejs.org/)
- Restart your terminal after installation

**Permission errors (Linux/macOS):**
- Don't use `sudo` with npm
- Consider using [nvm](https://github.com/nvm-sh/nvm) instead

**Dependencies won't install:**
- Clear cache: `npm cache clean --force`
- Delete node_modules and try again: `rm -rf node_modules && npm install`

### Environment Variables

The application supports these optional environment variables:

- `GEMINI_API_KEY`: For AI chat functionality
- `VITE_HOST`: Override host (default: localhost)
- `VITE_PORT`: Override port (default: 5173)

Create a `.env` file in the project root:
```
GEMINI_API_KEY=your_api_key_here
VITE_PORT=3000
```

## VSCode Setup

### Recommended Extensions
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer

### VSCode Settings
Add to your `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## Project Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Check TypeScript types
- `npm run lint` - Run linting

## Need Help?

If you encounter any issues:
1. Check the terminal output for error messages
2. Ensure Node.js 18+ is installed: `node --version`
3. Try deleting `node_modules` and running the setup script again
4. Check if any antivirus software is blocking the installation