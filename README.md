# Threat Dashboard

## Overview
Threat Dashboard is a full-stack web application for real-time cybersecurity threat analysis and monitoring. It allows users to:
- View threat statistics and categories
- Analyze new threat descriptions using a machine learning model
- See real-time activity updates via WebSockets
- Register, log in, and access protected features

## Features Implemented
- **User Authentication** (register, login, JWT-protected routes)
- **Threat Management** (view, search, filter, and analyze threats)
- **Machine Learning Integration**: Logistic Regression model predicts threat category from description
- **Real-Time Activity Feed**: WebSocket-powered live updates when new threats are analyzed
- **Modern React Frontend**: Responsive UI with dashboard, analysis modal, and live feed
- **Dockerized Full Stack**: Easy setup for backend, frontend, and Postgres database
- **Comprehensive Testing** (backend and frontend, if test files are present)

## Technology Stack & Justification
- **Frontend**: React + TypeScript (modern, component-based, great ecosystem)
- **Backend**: Node.js (Express) + TypeScript (robust, scalable, async-friendly)
- **Database**: PostgreSQL (reliable, open-source, supports complex queries)
- **ORM**: Prisma (type-safe, easy migrations)
- **Machine Learning**: Python (scikit-learn, pandas; industry standard for ML)
- **WebSockets**: socket.io (real-time, easy integration with Express/React)
- **Docker**: For reproducible, portable, and easy-to-deploy environments

## Setup & Installation

### Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop) installed
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) (for local dev)
- [Python 3.8+](https://www.python.org/) (for ML scripts)

### 1. Clone the Repository
```sh
git clone <your-repo-url>
cd threat-dashboard
```

### 2. Environment Variables
- Copy `.env.example` to `.env` in `backend/` and fill in any secrets (e.g., JWT secret).
- Example for backend `.env`:
  ```env
  DATABASE_URL=postgres://postgres:postgres@db:5432/threatdb
  JWT_SECRET=your_jwt_secret
  ```

### 3. Build & Run with Docker (Recommended)
From the project root:
```sh
docker-compose up --build
```
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Postgres**: port 5433

### 4. Manual Local Development (Optional)
#### Backend
```sh
cd backend
npm install
npx prisma migrate dev
npm run dev
```
#### Frontend
```sh
cd frontend
npm install
npm start
```
#### Database
- Ensure Postgres is running and matches your `.env` config.

### 5. Data Ingestion
- You can use scripts in `backend/src/scripts/` or import CSVs to populate the database.
- Example:
  ```sh
  npx ts-node backend/src/scripts/csv.ts
  ```

### 6. Machine Learning Model Training
- Ensure your database has threat data (with `Cleaned_Threat_Description` and `Threat_Category`).
- Install Python dependencies:
  ```sh
  pip install pandas psycopg2-binary scikit-learn
  ```
- Train the model:
  ```sh
  python backend/ml/train_model.py
  ```
- This will generate `vectorizer.pkl` and `model.pkl` in `backend/ml/`.



## Running Tests
### Backend
```sh
cd backend
npm test
```
### Frontend
```sh
cd frontend
npm test
```

## Docker Commands
- **Start all services:**
  ```sh
  docker-compose up --build
  ```
- **Stop all services:**
  ```sh
  docker-compose down
  ```
- **Remove all data (dangerous!):**
  ```sh
  docker-compose down -v
  ```

## Project Structure
```
threat-dashboard/
  backend/
    src/
    ml/
    prisma/
    ...
  frontend/
    src/
    ...
  docker-compose.yml
  README.md
```

## Real-Time Features
- The backend uses socket.io to broadcast new analysis events.
- The frontend listens for these events and updates the "Live Activity Feed" in real time.

## Contact & Collaboration
- Please invite the reviewers as collaborators on your private GitHub/GitLab repo.
- For any issues, see the code comments or open an issue in your repository.


