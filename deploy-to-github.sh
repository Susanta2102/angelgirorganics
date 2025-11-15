#!/bin/bash

echo "======================================"
echo "🚀 Angel Organics - Deploy to GitHub"
echo "======================================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
fi

# Add all files
echo "📝 Adding files to Git..."
git add .

# Get commit message from user
echo ""
echo "Enter commit message (or press Enter for default):"
read commit_message

if [ -z "$commit_message" ]; then
    commit_message="Update website files for deployment"
fi

# Commit changes
echo "💾 Committing changes..."
git commit -m "$commit_message"

# Check if remote exists
if ! git remote | grep -q origin; then
    echo ""
    echo "🔗 Setting up GitHub remote..."
    echo "Your repo: Susanta2102/angelgirorganics"
    git remote add origin https://github.com/Susanta2102/angelgirorganics.git
fi

# Push to GitHub
echo ""
echo "⬆️ Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "======================================"
echo "✅ Code pushed to GitHub successfully!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Go to https://render.com"
echo "2. Follow DEPLOYMENT-CHECKLIST.md"
echo "3. Deploy backend + frontend"
echo ""
echo "📖 Read DEPLOYMENT-GUIDE.md for details"
echo "======================================"
