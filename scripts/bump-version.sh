#!/bin/bash

# Script usage
# ./scripts/bump-version.sh (patch bump: 0.2.2 → 0.2.3)
# ./scripts/bump-version.sh minor (minor bump: 0.2.2 → 0.3.0)
# ./scripts/bump-version.sh major (major bump: 0.2.2 → 1.0.0)

# File paths
PACKAGE_FILE="package.json"
PACKAGE_LOCK_FILE="package-lock.json"
MANIFEST_FILE="packages/thunderbird-extension/public/manifest.json"

# Extract current version from package.json
CURRENT_VERSION=$(grep '"version"' $PACKAGE_FILE | head -1 | sed 's/.*"version": "\([^"]*\)".*/\1/')

echo "Current version: $CURRENT_VERSION"

# Parse version parts
IFS='.' read -ra VERSION_PARTS <<<"$CURRENT_VERSION"
MAJOR=${VERSION_PARTS[0]}
MINOR=${VERSION_PARTS[1]}
PATCH=${VERSION_PARTS[2]}

# Determine bump type (patch, minor, major)
BUMP_TYPE=${1:-patch}

case $BUMP_TYPE in
"major")
  NEW_VERSION="$((MAJOR + 1)).0.0"
  ;;
"minor")
  NEW_VERSION="$MAJOR.$((MINOR + 1)).0"
  ;;
"patch" | *)
  NEW_VERSION="$MAJOR.$MINOR.$((PATCH + 1))"
  ;;
esac

echo "New version: $NEW_VERSION"

# Update package.json
sed -i '' "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" $PACKAGE_FILE

# Update manifest.json
sed -i '' "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" $MANIFEST_FILE

# Update package-lock.json
npm i >/dev/null

echo "Version bumped from $CURRENT_VERSION to $NEW_VERSION"
echo "Updated files:"
echo "  - $PACKAGE_FILE"
echo "  - $PACKAGE_LOCK_FILE"
echo "  - $MANIFEST_FILE"
