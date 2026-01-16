# Render Deployment Checklist

## Before Deployment

- [ ] All code is committed and pushed to GitHub
- [ ] `.env.example` file is in repository (not actual `.env`)
- [ ] No sensitive credentials in code or repository
- [ ] Node version requirement set to >= 20.0.0 in package.json ✓

## Required External Services Setup

### MongoDB Atlas
- [ ] Create free MongoDB Atlas account
- [ ] Create a cluster (free tier available)
- [ ] Create database user with username/password
- [ ] Whitelist all IPs (0.0.0.0/0) for Render access
- [ ] Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/mass-transit-control-system`

### Google OAuth (if using social login)
- [ ] Create Google Cloud project
- [ ] Set up OAuth 2.0 credentials
- [ ] Add authorized redirect URIs:
  - [ ] `https://your-app-name.onrender.com`
  - [ ] `https://your-app-name.onrender.com/callback`
- [ ] Get CLIENT_ID and CLIENT_SECRET

### Stripe (if using payments)
- [ ] Create Stripe account
- [ ] Get API keys (test keys for testing, live keys for production)
- [ ] Set up webhook endpoint: `https://your-app-name.onrender.com/api/payments/webhook`
- [ ] Get STRIPE_SECRET_KEY and STRIPE_PUBLIC_KEY

## Render Deployment Steps

1. [ ] Go to https://render.com and sign up with GitHub
2. [ ] Grant Render access to your GitHub repository
3. [ ] Click "New +" and select "Web Service"
4. [ ] Select your mass-transit-control-system repository
5. [ ] Render will auto-detect render.yaml - confirm settings
6. [ ] Environment Variables to add:
   - [ ] `NODE_ENV` = `production`
   - [ ] `MONGO_URI` = `mongodb+srv://username:password@...`
   - [ ] `JWT_SECRET` = Generate a long random string
   - [ ] `GOOGLE_CLIENT_ID` = Your Google OAuth ID
   - [ ] `GOOGLE_CLIENT_SECRET` = Your Google OAuth secret
   - [ ] `STRIPE_SECRET_KEY` = Your Stripe secret key
   - [ ] `STRIPE_PUBLIC_KEY` = Your Stripe public key
   - [ ] `PORT` = `5000`

7. [ ] Review build command: `npm install && npm --prefix server install && npm --prefix client install && npm --prefix client run build`
8. [ ] Review start command: `npm start`
9. [ ] Click "Create Web Service"
10. [ ] Wait for deployment to complete (usually 5-10 minutes)

## Post-Deployment

- [ ] Test the deployed application at `https://your-app-name.onrender.com`
- [ ] Verify all API endpoints work
- [ ] Test user authentication
- [ ] Test payments (use Stripe test cards)
- [ ] Check server logs for errors: Dashboard → Logs tab
- [ ] Update Google OAuth redirect URIs if needed
- [ ] Update Stripe webhook endpoints if needed
- [ ] Test file uploads (if applicable)

## Troubleshooting

If deployment fails:
1. Check the "Logs" tab in Render dashboard
2. Common issues:
   - Missing environment variables → Add them in Environment settings
   - MongoDB connection error → Verify MONGO_URI and IP whitelist
   - Build failure → Check Node modules are properly installed
   - Missing React build → Ensure build script completes

If app doesn't load:
1. Check browser console for errors
2. Verify API calls point to correct endpoint
3. Check server logs for API errors
4. Verify CORS settings if frontend/backend are separated

## Performance Tips

- Free tier services sleep after 15 minutes - consider upgrading to Starter plan ($7/month)
- Set up monitoring alerts in Render dashboard
- Monitor database usage on MongoDB Atlas
- Optimize database queries as your user base grows

## Updating Your App

For future deployments:
1. Make changes locally
2. Commit and push to GitHub: `git push origin main`
3. Render automatically redeploys on push
4. Monitor deployment in Render dashboard

Done! 🚀
