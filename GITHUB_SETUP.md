# GitHub Setup Instructions

## Option 1: Create Repository via GitHub Website (Recommended)

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right → "New repository"
3. Repository name: `maintenance-tracker` (or your preferred name)
4. Description: "Simple maintenance tracking system for HOA/Property Management"
5. Choose Public or Private
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

8. After creating, GitHub will show you commands. Run these in your terminal:

```bash
git remote add origin https://github.com/YOUR_USERNAME/maintenance-tracker.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Option 2: Create Repository via GitHub CLI (if you have gh installed)

```bash
gh repo create maintenance-tracker --public --source=. --remote=origin --push
```

## After Pushing

Once pushed, you can:
- Enable GitHub Pages: Go to repository Settings → Pages → Select "main" branch → Save
- Your site will be available at: `https://YOUR_USERNAME.github.io/maintenance-tracker/`

**Important:** Remember to add your `firebase-config.js` file with your actual Firebase credentials after deploying, or set it up as a GitHub Secret if you want to keep it private.


