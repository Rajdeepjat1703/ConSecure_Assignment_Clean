# Threat Dashboard Frontend

A modern, responsive React application for monitoring and analyzing cybersecurity threats.

## Features

- **Dashboard View**: Displays threat statistics with visual charts and metrics
- **Threats View**: Comprehensive threat listing with search, filtering, and pagination
- **Threat Details**: Detailed modal view for individual threats
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- React 18 with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Lucide React for icons
- Axios for API communication

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm 
- Backend API running on `http://localhost:5000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (not recommended)

## API Integration

The frontend communicates with the backend API through the `api.ts` service. Make sure the backend is running on `http://localhost:5000` or update the `API_BASE_URL` in the service file.

## Features Overview

### Dashboard
- Total threat count
- High severity threat count
- Threat categories breakdown
- Severity distribution charts
- Real-time statistics

### Threats List
- Paginated threat listing
- Search functionality
- Category filtering
- Severity indicators
- Quick view actions

### Threat Details
- Comprehensive threat information
- IOCs display
- Keywords and entities
- Predicted threats and suggested actions
- Modal-based detailed view

## Styling

The application uses Tailwind CSS for styling with custom component classes defined in `index.css`. The design is responsive and follows modern UI/UX principles.

## Development

The application is built with TypeScript for better type safety and developer experience. All components are functional components using React hooks for state management. 