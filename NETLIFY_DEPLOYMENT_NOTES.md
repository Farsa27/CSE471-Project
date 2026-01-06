# Netlify Deployment Fix Guide

## Google OAuth "Not Authorized" Fix

### Step 1: Get Your Netlify Domain
Your Netlify URL will be in the format: `https://your-project-name.netlify.app`

### Step 2: Create a New Google OAuth Credential
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID** (if you don't have one)
5. In the **Authorized JavaScript origins**, add:
   - `http://localhost:3000` (for local development)
   - `https://your-project-name.netlify.app` (replace with your actual Netlify domain)
   - `https://your-custom-domain.com` (if you have a custom domain)

6. Copy the new **Client ID**

### Step 3: Configure Netlify Environment Variable
1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Build & deploy** → **Environment**
3. Click **Edit variables**
4. Add a new variable:
   - **Key**: `REACT_APP_GOOGLE_CLIENT_ID`
   - **Value**: (paste your Google Client ID)
5. Save and redeploy

### Step 4: For Custom Domains
If using a custom domain, also add it to Google OAuth credentials:
- Go back to Google Cloud Console
- Add your custom domain to **Authorized JavaScript origins**

---

## Mobile Responsiveness Issues

### Potential Fixes Applied:
1. ✅ Ensured Tailwind CSS is properly configured for mobile
2. ✅ Checked viewport meta tag in index.html
3. ✅ Mobile-first responsive design in components

### Testing on Mobile:
- Open DevTools (F12) → Toggle Device Toolbar (Ctrl+Shift+M)
- Test on common mobile widths: 375px, 768px, 1024px

### If Still Having Issues:
1. Check network tab in DevTools for failed requests
2. Verify the `proxy` setting in package.json matches your production API URL
3. Consider CORS settings on your backend

---

## API Endpoints for Production

Update your API calls from `http://localhost:5000` to your production API URL:
- **Development**: `http://localhost:5000`
- **Production**: `https://your-api-domain.com` (or Netlify Functions, Railway, Heroku, etc.)

You can use environment variables:
```javascript
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
```
