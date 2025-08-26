# Publishing to NPM

This guide explains how to publish the `n8n-nodes-zep` package to npm.

## Prerequisites

1. **npm account**: You need an npm account with publishing permissions
2. **npm login**: Run `npm login` to authenticate with npm
3. **Clean repository**: Ensure all changes are committed
4. **Node.js**: Version 20.15 or higher

## Quick Start

The easiest way to publish is using the automated publish script:

```bash
npm run publish:patch
```

This will automatically:
- ✅ Check prerequisites (npm login, clean git status)
- ✅ Build the project
- ✅ Run linting and tests
- ✅ Bump version
- ✅ Synchronize package.json files
- ✅ Publish to npm
- ✅ Create git tags
- ✅ Push to repository (optional)

## Available Scripts

### Publishing Scripts

- `npm run publish:patch` - Interactive publish (recommended)
- `npm run publish:minor` - Interactive publish 
- `npm run publish:major` - Interactive publish
- `npm run publish:beta` - Interactive publish

All publish scripts use the same interactive flow where you can choose the version bump type.

### Version Management

- `npm run version:patch` - Bump patch version (1.0.0 → 1.0.1)
- `npm run version:minor` - Bump minor version (1.0.0 → 1.1.0)
- `npm run version:major` - Bump major version (1.0.0 → 2.0.0)
- `npm run version:beta` - Create beta version (1.0.0 → 1.0.1-beta.0)

### Package Inspection

- `npm run package:check` - Preview what files will be published
- `npm run package:size` - Check package size and file count

## Manual Publishing Process

If you prefer to publish manually:

```bash
# 1. Build the project
npm run build

# 2. Run linting
npm run lint

# 3. Check package contents
npm run package:check

# 4. Version bump (choose one)
npm run version:patch
# or npm run version:minor
# or npm run version:major

# 5. Publish from dist folder
cd dist
npm publish
cd ..

# 6. Create git tag and push
git add .
git commit -m "chore: publish v$(node -p "require('./package.json').version")"
git tag "v$(node -p "require('./package.json').version")"
git push && git push --tags
```

## Version Types

- **patch** (1.0.0 → 1.0.1): Bug fixes, small improvements
- **minor** (1.0.0 → 1.1.0): New features, backwards compatible
- **major** (1.0.0 → 2.0.0): Breaking changes
- **beta** (1.0.0 → 1.0.1-beta.0): Pre-release versions

## What Gets Published

The npm package includes only the `dist/` folder contents:
- ✅ Compiled JavaScript files
- ✅ Type definition files (.d.ts)
- ✅ Icon files (.svg)
- ✅ package.json
- ❌ TypeScript source files
- ❌ Development tools and configs
- ❌ Scripts and documentation

## Beta Releases

For beta releases:

1. Use `npm run publish:beta` or select "prerelease" option
2. Beta versions are published with the `beta` tag
3. Install beta versions with: `npm install n8n-nodes-zep@beta`

## Troubleshooting

### Common Issues

**"You are not logged into npm"**
```bash
npm login
```

**"Working directory is not clean"**
```bash
git status
git add .
git commit -m "your changes"
```

**"Package already exists"**
- Version was not bumped properly
- Check current version: `npm view n8n-nodes-zep version`
- Bump to a higher version

### Rollback a Release

If you need to rollback a release:

```bash
# Deprecate the problematic version
npm deprecate n8n-nodes-zep@1.0.1 "Deprecated due to critical bug"

# Or completely unpublish (only within 72 hours)
npm unpublish n8n-nodes-zep@1.0.1
```

## Package Information

- **Package Name**: `n8n-nodes-zep`
- **npm Registry**: https://www.npmjs.com/package/n8n-nodes-zep
- **Repository**: https://github.com/mtmsuhail/n8n-nodes-zep

## Support

For issues with publishing:
1. Check the [npm documentation](https://docs.npmjs.com/)
2. Verify your npm permissions
3. Check the repository issues for similar problems
