
# Netlify + Railway Deployment Setup

## Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Add to **Authorized JavaScript origins**:
   - `http://localhost:3000` (local dev)
   - `https://695c972b948bf4e13e44a7bb--masstransitcontrolsystem.netlify.app` (Netlify)

3. In **Netlify** → **Site settings** → **Build & deploy** → **Environment**:
   - Add: `REACT_APP_GOOGLE_CLIENT_ID` = your-client-id

## Railway Backend Deployment

Your backend is deployed on Railway at a URL like: `https://your-service.up.railway.app`

Once deployed, all API calls will automatically use the production backend URL.

