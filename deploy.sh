#!/bin/bash
# Deploy script: push naar GitHub + trigger Vercel deployment

echo "Pushing naar GitHub..."
git add -A
git commit -m "${1:-Update}" 2>/dev/null || echo "(niets om te committen)"
git push

echo "Deploying naar Vercel..."
curl -X POST "https://api.vercel.com/v1/integrations/deploy/prj_myB975HIwWOTuoYEmTPGGbojZhQv/MgoPS9BBTo" --silent

echo "✓ Klaar! Vercel deploy is gestart."
