# Client Deployment Guide - Static Site on Render

## Deploy Client as Static Site

1. Go to https://dashboard.render.com/
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Configure:
   - **Name**: mass-transit-client
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `build`

5. Add environment variables:
   - `REACT_APP_API_BASE_URL`: `https://your-server-url.onrender.com` (copy from your server service)
   - `REACT_APP_GOOGLE_CLIENT_ID`: Your Google OAuth ID
   - `REACT_APP_STRIPE_PUBLIC_KEY`: Your Stripe public key

6. Click "Create Static Site"

## Important: Update Server Configuration

Once you have the client deployed, update your **server** to enable CORS for the client domain:

In `server/index.js`, modify CORS:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-client-url.onrender.com' // Add your client's Render URL
  ],
  credentials: true
}));
```

## Update Client API Calls

Make sure your client is calling the correct API URL. In your client code, use:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
```

Or configure axios/fetch with this base URL.

## Test the Deployment

1. Visit your client URL: `https://mass-transit-client.onrender.com`
2. Verify API calls work (check browser DevTools console)
3. Test login, bookings, and other features
