# Yieldmaker Frontend

This is the frontend application for Yieldmaker, an AI-powered DeFi yield investing platform.

## Features

- **Landing Page**: Beautiful, responsive landing page explaining the platform
- **AI Chat Interface**: Conversational AI for DeFi investment advice
- **Dashboard**: Portfolio overview and investment tracking
- **Portfolio Management**: View and manage DeFi investments
- **Security Analysis**: Protocol security scores and risk assessment
- **Settings**: User preferences and profile management
- **Web3 Integration**: Wallet connection and blockchain interaction

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Web3**: Wagmi + RainbowKit for wallet integration
- **UI Components**: Custom components with Lucide React icons
- **State Management**: React hooks and context

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Dashboard page with navigation
│   ├── chat/             # AI chat interface
│   ├── portfolio/        # Portfolio management
│   ├── security/         # Security analysis
│   ├── settings/         # User settings
│   ├── layout.tsx        # Root layout with Web3 provider
│   └── page.tsx          # Landing page
├── components/            # React components
│   ├── Chat/             # AI chat components
│   ├── Dashboard/        # Dashboard components
│   ├── Layout/           # Layout components
│   ├── Navigation/       # App navigation
│   ├── Providers/        # Context providers
│   ├── Web3/             # Web3-related components
│   └── landingpage/      # Landing page components
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
# Create .env.local file
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Key Components

### Web3Provider

Wraps the app with Wagmi and RainbowKit for Web3 functionality.

### AppNavigation

Provides navigation between different sections of the app with a responsive sidebar.

### AIChat

Conversational interface for getting DeFi investment advice.

### MainDashboard

Main dashboard showing portfolio overview and quick actions.

## Development

### Adding New Pages

1. Create a new folder in `src/app/`
2. Add `page.tsx` for the page content
3. Add `layout.tsx` if you need the app navigation
4. Update the navigation in `AppNavigation.tsx`

### Adding New Components

1. Create the component in the appropriate folder under `src/components/`
2. Export it from an index file if needed
3. Import and use it in your pages

### Styling

- Use Tailwind CSS classes for styling
- Follow the existing design system
- Use the utility functions in `src/utils/` for common operations

## Build and Deploy

```bash
# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Environment Variables

- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: WalletConnect project ID for wallet connections

## Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript for all new code
3. Add proper error handling and loading states
4. Test wallet connections and Web3 functionality
5. Ensure responsive design for mobile devices

## Notes

- The landing page is already implemented and should not be modified
- All authenticated pages require wallet connection
- Use mock data for development (replace with real API calls later)
- Follow DeFi security best practices in the UI
