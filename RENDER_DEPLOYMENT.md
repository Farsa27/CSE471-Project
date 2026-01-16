# Render Deployment Guide for Mass Transit Control System

## Prerequisites
- GitHub account with your repository pushed
- Render account (https://render.com)
- MongoDB Atlas account for database
- Stripe account for payments
- Google OAuth credentials

## Step 1: Prepare Your Repository

1. **Ensure all files are committed to Git:**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Verify your `.env.example` is in the repo** (already created)

## Step 2: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user with a strong password
4. Whitelist all IPs (0.0.0.0/0) for Render
5. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/mass-transit-control-system`

## Step 3: Deploy on Render

### Option A: Using render.yaml (Recommended)

1. Go to https://dashboard.render.com/
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the repository containing your project
5. Render will automatically detect `render.yaml` and configure services accordingly
6. Click "Create Web Service"

### Option B: Manual Configuration

If render.yaml doesn't auto-detect, manually configure:

1. **Create Web Service:**
   - Repository: Your GitHub repo
   - Branch: main
   - Runtime: Node
   - Build Command: `npm install && npm --prefix server install && npm --prefix client install && npm --prefix client run build`
   - Start Command: `npm start`
   - Plan: Free (or paid for better performance)

2. **Add Environment Variables:**
   Go to your service's "Environment" tab and add:
   
   ```
   NODE_ENV=production
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mass-transit-control-system
   JWT_SECRET=your_secure_random_string_here
   STRIPE_SECRET_KEY=sk_live_your_key_here
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   PORT=5000
   ```

## Step 4: Configure Client Environment

The client needs to know the API URL. Update the API calls in your client code:

Instead of hardcoded `http://localhost:5000`, use:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
```

Or remove the `proxy` from `client/package.json` and set the API base URL in axios config.

## Step 5: Update Client Build

1. The client build will be served from the server at `/` route
2. Add this to `server/index.js` after all API routes (before the listen):

   ```javascript
   // Serve static files from React build
   app.use(express.static(path.join(__dirname, '../client/build')));

   // Handle React routing - return index.html for non-API routes
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, '../client/build/index.html'));
   });
   ```

## Step 6: Deploy

1. Render will automatically deploy when you push to your main branch
2. Monitor the deployment in the Render dashboard
3. Once complete, you'll get a URL like: `https://mass-transit-xxxxx.onrender.com`

## Step 7: Update External Services

Update these services with your new Render URL:

1. **Google OAuth:** Add `https://mass-transit-xxxxx.onrender.com` to authorized redirect URIs
2. **Stripe:** Update webhook endpoints to `https://mass-transit-xxxxx.onrender.com/api/payments/webhook`
3. **Client:** If using environment variables, update `REACT_APP_API_BASE_URL`

## Troubleshooting

### Cold Start Issues
- Free tier services sleep after 15 minutes of inactivity
- Consider upgrading to Starter plan for consistent performance

### Build Failures
- Check build logs in Render dashboard
- Ensure all dependencies are in package.json
- Verify Node version is >= 20.0.0

### Database Connection Issues
- Verify MongoDB connection string is correct
- Check IP whitelist in MongoDB Atlas (should be 0.0.0.0/0)
- Ensure MONGO_URI env var is set correctly

### Client Not Loading
- Verify the static file serving configuration in server/index.js
- Check that React build files exist in client/build
- Review browser console for API endpoint errors

### API Calls Failing
- Verify CORS is properly configured
- Check that API routes are accessible at `/api/*`
- Review server logs for error details

## Performance Tips

1. **Upgrade from Free Plan:**
   - Free tier has limited resources and sleeps after inactivity
   - Consider Starter ($7/month) or Standard plan for better uptime

2. **Database Optimization:**
   - Use MongoDB indexes appropriately
   - Monitor query performance

3. **Image Optimization:**
   - Compress images before upload
   - Use appropriate formats (WebP when possible)

4. **Caching:**
   - Implement HTTP caching headers
   - Consider CDN for static assets

## Monitoring

1. Access logs and metrics in Render dashboard
2. Set up email alerts for deployment failures
3. Monitor MongoDB Atlas usage
4. Track Stripe API usage

## Next Steps

- Test all features thoroughly on deployed version
- Set up continuous monitoring
- Plan scaling strategy if needed
- Consider backup strategies for database
