#!/usr/bin/env bash
# Builds the site for GitHub Pages and force-pushes dist/ to the gh-pages branch.
# Usage: scripts/deploy-gh-pages.sh <owner/repo>
set -euo pipefail
REPO="${1:?usage: scripts/deploy-gh-pages.sh owner/repo}"
NAME="${REPO#*/}"
cd "$(dirname "$0")/.."
BASE_PATH="/${NAME}/" npm run build
touch dist/.nojekyll
cd dist
rm -rf .git
git init -q
git checkout -q -b gh-pages
git add -A
git -c user.name="deploy" -c user.email="deploy@local" commit -q -m "Deploy $(date -u +%Y-%m-%dT%H:%MZ)" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
git -c credential.helper='!gh auth git-credential' push -f "https://github.com/${REPO}.git" gh-pages
cd .. && rm -rf dist/.git
echo "Pushed dist/ to ${REPO}#gh-pages"
