# Skill Share Platform

A full-stack MERN application for skill sharing and learning.

## Deployment Instructions

### Backend Deployment (Render.com)

1. Create a new account on [Render.com](https://render.com)
2. Click on "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: skill-share-platform-api
   - Root Directory: server
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables from `.env`:
   - MONGODB_URI
   - JWT_SECRET
   - NODE_ENV (set to "production")

### Frontend Deployment (Vercel)

1. Create a new account on [Vercel](https://vercel.com)
2. Install Vercel CLI: `npm i -g vercel`
3. Navigate to the client directory
4. Run `vercel` and follow the prompts
5. Add environment variables:
   - VITE_API_URL: Your Render.com backend URL
   - VITE_GOOGLE_MAPS_API_KEY

## Local Development

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## Environment Variables

### Backend (.env)
- MONGODB_URI: MongoDB connection string
- JWT_SECRET: Secret key for JWT
- PORT: Server port (default: 3001)
- NODE_ENV: development/production

### Frontend (.env)
- VITE_API_URL: Backend API URL
- VITE_GOOGLE_MAPS_API_KEY: Google Maps API key
