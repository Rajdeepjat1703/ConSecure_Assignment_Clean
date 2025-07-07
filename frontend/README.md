# Threat Dashboard Frontend

## Overview
This is the frontend for the Threat Dashboard project—a modern, responsive React application for real-time cybersecurity threat analysis and monitoring. It connects to the backend API and provides a user-friendly interface for all features.

## Features
- **Dashboard:** Visual summary of threat statistics, categories, and severity.
- **Threats List:** Browse, search, and filter all threats in the system.
- **Threat Analysis:** Analyze new threat descriptions using a machine learning model (modal dialog interface).
- **Live Activity Feed:** Real-time updates when any user analyzes a threat (WebSocket-powered).
- **Authentication:** Register, login, and logout with JWT-based session management.
- **Responsive UI:** Works on desktop and mobile.

## Technology Stack
- **React** (with Hooks and functional components)
- **TypeScript** (type safety and maintainability)
- **Tailwind CSS** (utility-first styling)
- **socket.io-client** (real-time WebSocket communication)

## Setup & Installation

### 1. Install Dependencies
```sh
cd frontend
npm install
```

### 2. Environment Variables
- Create a `.env` file if you want to override the backend API URL:
  ```env
  REACT_APP_API_URL=http://localhost:5000/api
  ```

### 3. Run the Frontend
```sh
npm start
```
- The app will be available at [http://localhost:3000](http://localhost:3000)

### 4. Build for Production
```sh
npm run build
```

## UI Components & Screenshots
You can paste screenshots or images of the following UI components here:
- **Dashboard** (main summary and charts)
- **Threats List** (table or list view)
- **Threat Analysis Modal** (textarea, result display)
- **Live Activity Feed** (real-time updates)
- **Login/Register** (auth forms)

Example:
```
![Dashboard Screenshot](./screenshots/dashboard.png)
![Threats List Screenshot](./screenshots/threats.png)
```

## How It Works
- The frontend communicates with the backend API for all data and authentication.
- WebSocket connection is established to receive real-time analysis events.
- All state is managed with React hooks and context.

## Customization
- You can easily add new pages or components in `src/components/`.
- To change the theme or styles, edit `tailwind.config.js` and `index.css`.

## Contact
For questions or issues, please open an issue in the main project repository or contact the maintainer.

---
