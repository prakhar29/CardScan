# EventAssist - Business Card Scanner 📇

A modern web application that uses AI to extract contact information from business card images and automatically saves it to Google Sheets. Features email integration and WhatsApp quick actions.

## Features

- 📸 **AI-Powered OCR**: Uses Google Gemini AI to extract text from business cards
- 📊 **Auto-Save to Google Sheets**: Automatically stores contacts in your spreadsheet
- 📧 **Gmail Integration**: Send follow-up emails directly from the app
- 💬 **WhatsApp Quick Actions**: One-click WhatsApp messaging
- 📱 **Mobile-Friendly**: Fully responsive, works great on phones and tablets
- 🎨 **Modern UI**: Beautiful dark mode support

## Quick Deploy to Vercel (5 minutes)

1. **Get your API keys ready**:
   - [Gemini API Key](https://aistudio.google.com/app/apikey)
   - [Google Cloud Console](https://console.cloud.google.com) (for OAuth & Service Account)

2. **Push to GitHub**:
   ```bash
   cd frontend
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

3. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repo
   - Set root directory to `frontend`
   - Add environment variables (see below)
   - Click "Deploy"

4. **Add Environment Variables in Vercel**:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
   NEXTAUTH_SECRET=run: openssl rand -base64 32
   NEXTAUTH_URL=https://your-app.vercel.app
   GOOGLE_SHEET_ID=your_google_sheet_id
   GOOGLE_SERVICE_ACCOUNT_JSON=paste_entire_credentials_json_here
   ```

5. **Update OAuth Redirect URI** in Google Cloud Console:
   - Add: `https://your-app.vercel.app/api/auth/callback/google`

That's it! Share the link with your team 🚀

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `credentials.json` in the frontend folder (Google Service Account key)

3. Create `.env.local` with:
   ```
   GEMINI_API_KEY=your_key
   GOOGLE_CLIENT_ID=your_id
   GOOGLE_CLIENT_SECRET=your_secret
   NEXTAUTH_SECRET=your_secret
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_SHEET_ID=your_sheet_id
   ```

4. Run the dev server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Add to Mobile Home Screen

Users can install this as a PWA:
- **iOS**: Safari → Share → "Add to Home Screen"
- **Android**: Chrome → Menu → "Add to Home Screen"

## Detailed Setup Guide

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions including Google Cloud setup.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **AI**: Google Gemini 2.5 Flash
- **Auth**: NextAuth.js
- **APIs**: Google Sheets API, Gmail API
- **Deployment**: Vercel

## Need Help?

Check out the [DEPLOYMENT.md](./DEPLOYMENT.md) guide for troubleshooting and detailed setup instructions.
