#!/bin/bash

# n8n-nodes-zep NPM Publish Script
# This script handles the complete workflow for publishing to npm

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}==>${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
print_step "Checking prerequisites..."

if ! command_exists npm; then
    print_error "npm is not installed"
    exit 1
fi

if ! command_exists node; then
    print_error "Node.js is not installed"
    exit 1
fi

if ! command_exists git; then
    print_error "git is not installed"
    exit 1
fi

print_success "Prerequisites check passed"

# Check if logged into npm
print_step "Checking npm authentication..."
if ! npm whoami >/dev/null 2>&1; then
    print_error "You are not logged into npm. Please run 'npm login' first."
    exit 1
fi

npm_user=$(npm whoami)
print_success "Logged in as: $npm_user"

# Check git status
print_step "Checking git status..."
if ! git diff-index --quiet HEAD --; then
    print_error "Working directory is not clean. Please commit or stash your changes."
    exit 1
fi

# Check if we're on the main/master branch
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [[ "$current_branch" != "main" && "$current_branch" != "master" ]]; then
    print_warning "You are on branch '$current_branch', not main/master."
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

print_success "Git status check passed"

# Get current version
current_version=$(node -p "require('./package.json').version")
print_step "Current version: $current_version"

# Ask for version bump type
echo
echo "Select version bump type:"
echo "1) patch (current: $current_version)"
echo "2) minor"
echo "3) major" 
echo "4) prerelease"
echo "5) custom"
echo "6) no change (use current version)"

read -p "Enter your choice (1-6): " version_choice

case $version_choice in
    1)
        new_version=$(npm version patch --no-git-tag-version)
        ;;
    2)
        new_version=$(npm version minor --no-git-tag-version)
        ;;
    3)
        new_version=$(npm version major --no-git-tag-version)
        ;;
    4)
        new_version=$(npm version prerelease --no-git-tag-version --preid=beta)
        ;;
    5)
        read -p "Enter custom version: " custom_version
        new_version=$(npm version $custom_version --no-git-tag-version)
        ;;
    6)
        new_version="v$current_version"
        print_warning "Using current version: $current_version"
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

# Remove 'v' prefix from version
new_version=${new_version#v}

print_success "Version set to: $new_version"

# Sync dist/package.json version
print_step "Synchronizing dist/package.json version..."
if [ -f "dist/package.json" ]; then
    node -e "
        const fs = require('fs');
        const pkg = JSON.parse(fs.readFileSync('dist/package.json', 'utf8'));
        pkg.version = '$new_version';
        fs.writeFileSync('dist/package.json', JSON.stringify(pkg, null, 4));
    "
    print_success "dist/package.json version synchronized"
else
    print_warning "dist/package.json not found, will be created during build"
fi

# Install dependencies
print_step "Installing dependencies..."
npm ci

# Build the project
print_step "Building project..."
npm run build

# Copy package.json to dist with correct version
print_step "Copying package.json to dist..."
node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Ensure the version is correct
    pkg.version = '$new_version';
    
    // Write to dist folder
    fs.writeFileSync('dist/package.json', JSON.stringify(pkg, null, 4));
"

# Run linting
print_step "Running linting..."
npm run lint

# Run any tests if they exist
if npm run | grep -q "test"; then
    print_step "Running tests..."
    npm test
else
    print_warning "No tests found, skipping test step"
fi

# Show what will be published
print_step "Checking package contents..."
cd dist
npm pack --dry-run
cd ..

# Confirmation
echo
print_warning "Ready to publish version $new_version to npm"
echo "Package: $(node -p "require('./package.json').name")"
echo "Version: $new_version"
echo "Registry: $(npm config get registry)"
echo

read -p "Do you want to continue with publishing? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Publication cancelled"
    exit 0
fi

# Publish to npm
print_step "Publishing to npm..."
cd dist

# Check if this is a prerelease
if [[ $new_version == *"beta"* ]] || [[ $new_version == *"alpha"* ]] || [[ $new_version == *"rc"* ]]; then
    npm publish --tag beta
    print_success "Published $new_version with 'beta' tag"
else
    npm publish
    print_success "Published $new_version with 'latest' tag"
fi

cd ..

# Create git tag and commit
print_step "Creating git tag..."
git add package.json dist/package.json
git commit -m "chore: bump version to $new_version"
git tag "v$new_version"

print_success "Git tag v$new_version created"

# Ask about pushing to git
echo
read -p "Do you want to push to git repository? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push
    git push --tags
    print_success "Changes pushed to git repository"
fi

echo
print_success "🎉 Successfully published n8n-nodes-zep@$new_version to npm!"
echo
echo "Next steps:"
echo "• Check the package on npmjs.com: https://www.npmjs.com/package/n8n-nodes-zep"
echo "• Update your README.md with installation instructions"
echo "• Consider creating a GitHub release: https://github.com/mtmsuhail/n8n-nodes-zep/releases"
echo
