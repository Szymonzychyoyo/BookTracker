# BookTrackerPL

This repository contains a React client and a Node.js backend.

## Quick start with Docker

Ensure you have Docker and Docker Compose installed, then run:

```bash
docker-compose up --build
```

This command will build the images and start MongoDB, the backend and the React application. The client will be available at [http://localhost:3000](http://localhost:3000) and the API at [http://localhost:5001](http://localhost:5001).

## Manual setup

### Prerequisites

- Node.js 18 or newer
- Running MongoDB instance (local or Docker)

### Backend

```bash
cd server
copy envExample .env
npm install
npm start
```

The server uses the variables `PORT`, `MONGODB_URI` and `JWT_SECRET` from the `.env` file.

### Frontend

```bash
cd client
npm install
npm start
```
