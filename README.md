# 🎓 Windsor Dukes — Quantitative Reasoning

A progressive math test application covering Data Sufficiency, Arithmetic & Number Theory, Algebra, Geometry, Probability & Statistics, and Advanced Mixed topics across three difficulty tiers.

---

## Files in this repository

```
windsor-dukes/
├── WindsorDukes.jsx          ← The entire application (144 questions)
├── index.html                ← HTML entry point
├── package.json              ← Dependencies
├── vite.config.js            ← Build config (set your repo name here)
├── tailwind.config.js        ← Tailwind CSS config
├── postcss.config.js         ← PostCSS config
├── .gitignore
├── .github/
│   └── workflows/
│       └── deploy.yml        ← Auto-deploy to GitHub Pages on push
└── src/
    ├── main.jsx              ← React entry point
    └── index.css             ← Tailwind base styles
```

---

## How to deploy to GitHub Pages (recommended)

This is the easiest method. Every time you push to `main`, the site rebuilds and deploys automatically.

### Step 1 — Create a GitHub repository

1. Go to [github.com](https://github.com) and sign in
2. Click **New repository** (the green button, or the **+** in the top right)
3. Name it — for example: `windsor-dukes`
4. Set it to **Public** (GitHub Pages is free for public repos)
5. Leave everything else at defaults and click **Create repository**

### Step 2 — Set the base URL in vite.config.js

Open `vite.config.js` and change the `base` line to match your repo name exactly:

```js
// If your repo is: github.com/yourname/windsor-dukes
base: '/windsor-dukes/',

// If your repo is: github.com/yourname/math-practice
base: '/math-practice/',

// If you're using a custom domain like yourname.github.io
base: '/',
```

### Step 3 — Upload the files to GitHub

**Option A: Using the GitHub website (no Git required)**

1. On your new repo page, click **uploading an existing file**
2. Drag all files and folders from this package into the upload area
   - Make sure to include the `.github/` folder (you may need to show hidden files)
3. Click **Commit changes**

**Option B: Using Git in Terminal**

```bash
# From inside the windsor-dukes folder:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 4 — Enable GitHub Pages

1. In your repo, go to **Settings** → **Pages** (left sidebar)
2. Under **Source**, select **GitHub Actions**
3. Click **Save**

### Step 5 — Wait for deployment

1. Go to the **Actions** tab in your repo
2. You'll see a workflow called **Deploy to GitHub Pages** running
3. When it shows a green ✅, your site is live

### Step 6 — Find your live URL

Your site will be at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

For example: `https://jsmith.github.io/windsor-dukes/`

---

## How to run locally (for testing or editing)

You need [Node.js](https://nodejs.org) installed (version 18 or higher).

```bash
# 1. Open Terminal and navigate to this folder
cd windsor-dukes

# 2. Install dependencies (only needed once)
npm install

# 3. Start the local development server
npm run dev

# 4. Open your browser to the address shown (usually http://localhost:5173)
```

The local dev server supports hot reload — any change you save to `WindsorDukes.jsx` appears instantly in the browser without refreshing.

---

## How to update the application

1. Edit `WindsorDukes.jsx` with your changes
2. If running locally, the browser updates automatically
3. To publish: `git add . && git commit -m "Your description" && git push`
4. GitHub Actions redeploys automatically within ~2 minutes

---

## About the application

**6 progressive tests** — each unlocks after completing the previous one:

| Test | Topic | Questions |
|------|-------|-----------|
| Test 1 | Data Sufficiency | 5 (from bank of 5 slots × 3 variants) |
| Test 2 | Arithmetic & Number Theory | 11 (from bank of 11 slots × 3 variants) |
| Test 3 | Algebra & Equations | 11 (fixed) |
| Test 4 | Geometry & Measurement | 11 (fixed) |
| Test 5 | Probability & Statistics | 11 (fixed) |
| Test 6 | Advanced Mixed Mastery | 11 (fixed) |

**3 difficulty tiers** — Easy 🟢, Medium 🟡, Hard 🔴 — available for Tests 1 and 2. Each slot has 3 variants per tier so questions vary between attempts.

**Features:**
- Step-by-step tutorials available for every question (before submitting)
- Full written solutions with correct answer (after submitting)
- Personal score history and topic mastery tracking
- Shared global leaderboard (uses Claude artifact storage when hosted via claude.ai)
- Score persistence across sessions

---

## Troubleshooting

**The site loads but shows a blank page**
- Check that the `base` in `vite.config.js` exactly matches your repo name, including the slashes

**GitHub Actions workflow fails**
- Go to the **Actions** tab and click the failed run to see the error log
- The most common cause is a typo in a file — check the error message carefully

**"404 Not Found" when visiting the URL**
- Make sure GitHub Pages is set to use **GitHub Actions** as the source (not a branch)
- Wait 2–3 minutes after the Actions workflow completes

**Local `npm install` fails**
- Make sure Node.js 18 or higher is installed: run `node --version` to check
- Download Node.js from [nodejs.org](https://nodejs.org) if needed

---

## Tech stack

- [React 18](https://react.dev) — UI framework
- [Vite 5](https://vitejs.dev) — Build tool and dev server
- [Tailwind CSS 3](https://tailwindcss.com) — Styling
- [Lucide React](https://lucide.dev) — Icons
- GitHub Pages + GitHub Actions — Free hosting and CI/CD
