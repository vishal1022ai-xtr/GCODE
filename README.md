# MediMinder AI - Professional Medical Platform

A comprehensive medical platform for managing patient medication compliance, featuring AI-powered assistance and multi-role dashboards.

## 🚀 Quick Start for VSCode

### Prerequisites
- Node.js 18+ installed
- VSCode with recommended extensions (auto-suggested when opening project)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-github-repo-url>
   cd mediminder-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

### VSCode Setup

The project includes VSCode configuration files that will:
- Enable TypeScript IntelliSense
- Format code on save
- Auto-organize imports
- Provide debugging configuration
- Suggest essential extensions

**Recommended Extensions** (auto-prompted):
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- Auto Rename Tag
- Path Intellisense

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # TypeScript type checking
npm run lint         # Check for TypeScript errors
npm run clean        # Clean build artifacts
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── SuperAdminDashboard.tsx
│   ├── DoctorDashboard.tsx
│   ├── PatientDashboard.tsx
│   └── ...
├── database/           # Mock database
├── hooks/              # Custom React hooks
├── services/           # API services
├── types.ts           # TypeScript type definitions
├── constants.ts       # Application constants
└── App.tsx           # Main application component
```

## 🎯 Features

- **Multi-Role Dashboards**: SuperAdmin, Hospital Admin, Doctor, and Patient interfaces
- **AI-Powered Chat**: Integrated Gemini AI for medical assistance
- **Medication Management**: Complete medication tracking and compliance monitoring
- **Professional UI**: Enterprise-grade design with dark/light mode
- **Real-time Updates**: Live medication tracking and notifications
- **Advanced Search**: Comprehensive filtering and search capabilities
- **Data Visualization**: Charts and analytics for compliance tracking

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini AI API key | Yes |

## 🔧 Troubleshooting

### Common Issues

1. **TypeScript Errors**
   ```bash
   npm run type-check
   ```

2. **Missing Dependencies**
   ```bash
   npm install
   ```

3. **Port Already in Use**
   - Change port in `vite.config.ts` or kill existing process

4. **AI Chat Not Working**
   - Verify `VITE_GEMINI_API_KEY` is set correctly
   - Check browser console for API errors

### VSCode Issues

1. **Extensions Not Loading**
   - Open Command Palette (Ctrl+Shift+P)
   - Run "Extensions: Show Recommended Extensions"
   - Install suggested extensions

2. **TypeScript Not Working**
   - Open Command Palette
   - Run "TypeScript: Restart TS Server"

3. **Import Errors**
   - Ensure all dependencies are installed
   - Restart TypeScript language server

## 📱 Usage

### Login Credentials (Demo)
- **Super Admin**: admin@mediminder.com / admin123
- **Hospital Admin**: hospital@mediminder.com / hospital123  
- **Doctor**: doctor@mediminder.com / doctor123
- **Patient**: patient@mediminder.com / patient123

### Key Functionalities

1. **Patient Dashboard**
   - Track daily medication schedule
   - Mark medications as taken
   - View compliance charts
   - Chat with AI assistant

2. **Doctor Dashboard**
   - Monitor patient compliance
   - Review patient lists
   - Access patient medical histories
   - Schedule appointments

3. **Admin Dashboards**
   - Manage hospitals and medical staff
   - View system-wide analytics
   - Monitor compliance across facilities

## 🛠️ Development

### Code Quality
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Automatic import organization

### Testing
```bash
npm run type-check    # TypeScript validation
npm run lint         # Code quality check
```

## 📝 License

This project is for educational and demonstration purposes.

---

**Note**: This is a demo application with mock data. Do not use in production medical environments without proper validation and compliance measures.
