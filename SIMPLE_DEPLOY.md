# 🚀 Simple Deployment Guide - Contacts Only (No Email)

Since you only want to scan business cards and save to Google Sheets (no email sending), deployment is simpler!

## What You Need

1. **Gemini API Key** - For AI text extraction
2. **Google Service Account** - For saving to Google Sheets

**You DON'T need**: Google OAuth credentials (those were for email)

---

## Step 1: Get Gemini API Key (2 minutes)

1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key - you'll need it for Vercel

---

## Step 2: Set Up Google Sheets Access (5 minutes)

### Create Service Account:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or use existing)
3. Enable **Google Sheets API**:
   - Click "Enable APIs and Services"
   - Search "Google Sheets API"
   - Click "Enable"
4. Create Service Account:
   - Go to "IAM & Admin" → "Service Accounts"
   - Click "Create Service Account"
   - Name: `cardscan-sheets` (or any name)
   - Click "Create and Continue"
   - Skip permissions (click "Continue" then "Done")
5. Create JSON Key:
   - Click on your new service account
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose "JSON"
   - Save the downloaded file (you'll paste its contents into Vercel)

### Create Google Sheet:

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Copy the **Sheet ID** from URL:
   ```
   https://docs.google.com/spreadsheets/d/THIS_IS_THE_SHEET_ID/edit
   ```
4. **Important**: Share the sheet with your service account:
   - Click "Share" button
   - Paste the service account email (from the JSON file: `client_email`)
   - Give it "Editor" permissions
   - Click "Send"

---

## Step 3: Deploy to Vercel (5 minutes)

### 3.1: Go to Vercel

1. Visit [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Import `prakhar29/CardScan`

### 3.2: Configure Project

- **Framework**: Next.js (auto-detected)
- **Root Directory**: Leave blank (or `./`)
- Keep other defaults

### 3.3: Add Environment Variables

Click "Environment Variables" and add these **3 required variables**:

```
GEMINI_API_KEY
```
Paste your Gemini API key

```
GOOGLE_SHEET_ID
```
Paste your Google Sheet ID (from URL)

```
GOOGLE_SERVICE_ACCOUNT_JSON
```
Open the downloaded JSON file, copy ENTIRE contents, paste here

**Optional** (has defaults):
```
GOOGLE_SHEET_NAME=Sheet1
```
Only change if your sheet tab has a different name

### 3.4: Deploy!

Click "Deploy" button and wait 2-3 minutes ☕

---

## Step 4: Test It Out! 📱

1. Visit your Vercel URL (e.g., `https://card-scan-xyz.vercel.app`)
2. Upload a business card image
3. See the magic! ✨
4. Check your Google Sheet - the contact should be there!

---

## Step 5: Share with Your Team

Just send them the Vercel URL!

### For Mobile Users:

They can "install" it like an app:

**iPhone:**
1. Open the link in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"
4. Tap "Add"

**Android:**
1. Open the link in Chrome
2. Tap the menu (⋮)
3. Tap "Add to Home Screen"
4. Tap "Add"

Now they have an icon on their home screen! 📱

---

## Troubleshooting

### "GEMINI_API_KEY is not configured"
- Make sure you added it in Vercel Environment Variables
- Redeploy: Go to Vercel → Deployments → click "..." → "Redeploy"

### "Failed to append to Google Sheet"
- Check that you shared the sheet with service account email
- Make sure the service account has "Editor" permissions
- Verify the GOOGLE_SHEET_ID is correct

### Sheet not updating?
- Open your Google Sheet
- Check if the service account email appears in the "Share" list
- Try uploading a test business card again

---

## What Features Work?

✅ Upload business card image  
✅ AI extracts contact info  
✅ Saves to Google Sheets automatically  
✅ WhatsApp quick action (opens WhatsApp with contact)  
✅ Works perfectly on mobile  
❌ Email sending (removed - not needed)

---

## Need the Email Feature Later?

If you change your mind and want email sending:
1. Set up Google OAuth credentials
2. Add environment variables:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
3. The email feature will automatically activate!

---

## That's It! 🎉

Your team can now scan business cards on their phones and automatically save contacts to your shared Google Sheet!

