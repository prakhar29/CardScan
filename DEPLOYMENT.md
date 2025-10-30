# Deployment Guide - EventAssist Business Card Scanner

This guide will help you deploy the app to Vercel so your team can access it on any device.

## Prerequisites

You'll need:
1. A GitHub account
2. A Vercel account (free - sign up at [vercel.com](https://vercel.com))
3. Google Cloud Project with APIs enabled
4. Gemini API key

## Step 1: Set Up Google Cloud Project

### For Google Sheets Access (Service Account):
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable these APIs:
   - Google Sheets API
   - Gmail API
4. Create a **Service Account**:
   - Go to "IAM & Admin" → "Service Accounts"
   - Click "Create Service Account"
   - Give it a name (e.g., "eventassist-sheets")
   - Click "Create and Continue"
   - Grant role: "Editor" (or just Google Sheets access)
   - Click "Done"
5. Create a key for the service account:
   - Click on the service account email
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose JSON format
   - Download the file and save it as `credentials.json` in the `frontend` folder

### For OAuth (Email Sending):
1. In the same Google Cloud project, go to "APIs & Credentials" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Configure the consent screen if prompted:
   - User Type: External
   - Add your email as a test user
   - Scopes: Add Gmail API send scope
4. Application type: "Web application"
5. Add authorized redirect URIs:
   - For local: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://your-app-name.vercel.app/api/auth/callback/google` (you'll add this after deploying)
6. Save and copy the **Client ID** and **Client Secret**

### Create Google Sheet:
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)
4. Share the sheet with your service account email (the one from credentials.json)
   - Give it "Editor" access

## Step 2: Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Get API Key" or "Create API Key"
3. Copy the API key

## Step 3: Push Your Code to GitHub

1. Initialize git in your frontend folder (if not already done):
```bash
cd frontend
git init
git add .
git commit -m "Initial commit"
```

2. Create a new repository on GitHub

3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

**IMPORTANT**: Make sure `credentials.json` and `.env` files are NOT pushed to GitHub (they should be in `.gitignore`)

## Step 4: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Root Directory**: `frontend` (if deploying from the root of your repo)
   - Keep other settings as default

5. Add Environment Variables (click "Environment Variables"):
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   NEXTAUTH_SECRET=generate_a_random_string_here
   GOOGLE_SHEET_ID=your_google_sheet_id
   GOOGLE_SHEET_NAME=Sheet1
   ```

   To generate NEXTAUTH_SECRET, run this in terminal:
   ```bash
   openssl rand -base64 32
   ```

6. **Important**: For the `credentials.json` file:
   - After deployment, go to your Vercel project
   - Click "Settings" → "Environment Variables"
   - Create a new variable called `GOOGLE_SERVICE_ACCOUNT_JSON`
   - Paste the ENTIRE contents of your `credentials.json` file as the value
   - Then you'll need to update your `upload/route.ts` to read from this env variable instead of the file

7. Click "Deploy"

8. Once deployed, copy your deployment URL (e.g., `https://your-app.vercel.app`)

9. **Update Google OAuth Redirect URI**:
   - Go back to Google Cloud Console → Credentials
   - Edit your OAuth 2.0 Client ID
   - Add: `https://your-app.vercel.app/api/auth/callback/google`
   - Save

10. **Update NEXTAUTH_URL**:
    - Go to Vercel project settings
    - Update `NEXTAUTH_URL` to your deployment URL
    - Redeploy (or it will auto-redeploy)

### Option B: Deploy via Vercel CLI

```bash
npm install -g vercel
cd frontend
vercel login
vercel
```

Follow the prompts and add environment variables when asked.

## Step 5: Test Your Deployment

1. Visit your deployed URL
2. Upload a business card image
3. Test the Google Sheets integration
4. Test the email functionality by signing in with Google

## Step 6: Share with Your Team

Simply share the URL! The app is fully responsive and works great on mobile browsers.

For easy mobile access, users can:
- **iOS**: Open in Safari → Tap Share → "Add to Home Screen"
- **Android**: Open in Chrome → Tap Menu (⋮) → "Add to Home Screen"

This creates an app-like icon on their phone!

## Troubleshooting

### Issue: "GEMINI_API_KEY is not configured"
- Make sure you added the environment variable in Vercel
- Redeploy after adding env variables

### Issue: "Failed to read credentials.json"
- You need to modify the code to read from environment variable
- See the note in Step 4.6 above

### Issue: OAuth redirect error
- Make sure you added the correct redirect URI in Google Cloud Console
- Format: `https://your-app.vercel.app/api/auth/callback/google`

### Issue: Google Sheets permission denied
- Make sure you shared the sheet with the service account email
- Check that the service account has Editor permissions

## Need Help?

- Vercel Documentation: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Google Cloud Console: https://console.cloud.google.com

## Updating the App

Whenever you push changes to your GitHub repository, Vercel will automatically rebuild and redeploy your app!

