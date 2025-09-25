# MediMinder AI - Project Documentation

## Overview
MediMinder AI is a smart medicine reminder and compliance system designed for patients and hospitals. The application features an AI-powered virtual assistant to answer patient queries and helps manage medication compliance across different user roles.

## Project Status
**Status**: Successfully imported and configured for Replit environment
**Date**: September 25, 2025

## Project Architecture

### Technology Stack
- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS (via CDN)
- **AI Integration**: Google Gemini AI (@google/genai)
- **Development Server**: Vite dev server on port 5000

### Project Structure
```
/
├── components/          # React components
│   ├── AIChat.tsx      # AI chat functionality
│   ├── Dashboard.tsx   # Main dashboard component
│   ├── LoginScreen.tsx # Authentication UI
│   └── ...            # Other UI components
├── hooks/              # Custom React hooks
│   └── useTheme.tsx   # Theme management
├── services/           # External service integrations
│   └── geminiService.ts # Google Gemini AI service
├── App.tsx            # Main application component
├── index.tsx          # Application entry point
├── index.html         # HTML template
├── vite.config.ts     # Vite configuration
├── package.json       # Dependencies and scripts
└── tsconfig.json      # TypeScript configuration
```

### User Roles
The application supports multiple user roles:
- **Super Admin**: System-wide administration
- **Hospital Admin**: Hospital-level management
- **Doctor**: Medical professional interface
- **Patient**: Patient portal and medication tracking

## Development Environment

### Replit Configuration
- **Port**: 5000 (configured for Replit's proxy system)
- **Host**: 0.0.0.0 (allows external connections)
- **Workflow**: Frontend development server using `npm run dev`

### Key Configuration Changes Made
1. Updated Vite config to use port 5000 instead of 3000
2. Configured HMR (Hot Module Replacement) for port 5000
3. Removed CDN import maps in favor of npm packages
4. Set up proper host configuration for Replit's proxy environment

### Environment Variables
The application expects a `GEMINI_API_KEY` environment variable for AI functionality.

### Development Commands
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## Deployment Configuration
- **Target**: Autoscale (stateless web application)
- **Build**: `npm run build`
- **Run**: Vite preview server on port 5000

## Recent Changes
- **2025-09-25**: Initial import and Replit environment setup
  - Installed Node.js 20 and npm dependencies
  - Configured Vite for Replit environment (port 5000)
  - Removed CDN dependencies in favor of npm packages
  - Set up development workflow
  - Configured deployment settings
  - Fixed TypeScript compilation issues

## Features
- Multi-role authentication system
- AI-powered chat assistant using Google Gemini
- Medicine compliance tracking and calendar
- Dark/light theme support
- Responsive design with Tailwind CSS
- Mock data system for development/demo

## Notes
- Application uses mock data for demonstration purposes
- AI chat functionality requires valid Gemini API key
- Theme switching is implemented with Tailwind's dark mode
- All dependencies are locally installed via npm (no CDN dependencies)