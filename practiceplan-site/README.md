# PracticePlan Landing Page - Setup Instructions

## What's in this folder:
- `index.html` - Your landing page
- `api/submit.js` - The serverless function that sends form data to Close CRM

## How to Deploy (Step-by-Step):

### Step 1: Get Your Close API Key
1. Log into Close CRM
2. Go to **Settings** → **API Keys**
3. Click **"Add a new API key"**
4. Name it something like "Landing Page Form"
5. Copy the API key (you'll need it in Step 4)

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and log in
2. Click **"Add New..."** → **"Project"**
3. Choose **"Import Third-Party Git Repository"** or drag/drop this entire folder
4. If dragging, just drag the whole `practiceplan-site` folder onto the page

### Step 3: Configure Your API Key (IMPORTANT!)
After deploying, you need to add your Close API key:
1. In Vercel, go to your project
2. Click **"Settings"** tab
3. Click **"Environment Variables"** in the left sidebar
4. Add a new variable:
   - **Name:** `CLOSE_API_KEY`
   - **Value:** (paste your Close API key here)
5. Click **"Save"**

### Step 4: Redeploy
After adding the environment variable:
1. Go to the **"Deployments"** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**

### Step 5: Test It!
1. Visit your Vercel URL
2. Fill out the form with test data
3. Check Close CRM - you should see a new lead!

## Connecting a Custom Domain (Optional):
1. In Vercel, go to your project → **Settings** → **Domains**
2. Add your domain (e.g., `report.practiceplan.io`)
3. Follow Vercel's instructions to add DNS records

## Troubleshooting:
- **Form not submitting?** Check that the CLOSE_API_KEY environment variable is set
- **No lead in Close?** Check your API key is correct and has permissions to create leads
- **Need help?** Check Vercel's deployment logs under the "Functions" tab

