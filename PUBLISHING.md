# Publishing Guide: strapi-plugin-alt-text-generator

This guide walks you through publishing the plugin to npm.

## Prerequisites

1. **npm Account**: Create an account at [npmjs.com](https://www.npmjs.com/signup) if you don't have one
2. **npm CLI**: Ensure you have npm installed (comes with Node.js)
3. **Authentication**: You need to be logged in to npm

## Step-by-Step Publishing Process

### Step 1: Verify npm Authentication

Check if you're logged in to npm:

```bash
npm whoami
```

If you're not logged in, authenticate:

```bash
npm login
```

Enter your npm username, password, and email when prompted.

### Step 2: Update Package Version

Update the version in `package.json`. Use semantic versioning:

- **Patch** (bug fixes): `0.0.1`, `0.0.2`, etc.
- **Minor** (new features, backward compatible): `0.1.0`, `0.2.0`, etc.
- **Major** (breaking changes): `1.0.0`, `2.0.0`, etc.

For the first release, update from `0.0.0` to `0.1.0` or `1.0.0`:

```bash
npm version 1.0.0
```

This command will:
- Update `package.json` version
- Create a git commit (if in a git repo)
- Create a git tag

Alternatively, manually edit `package.json` and change:
```json
"version": "1.0.0"
```

### Step 3: Build the Plugin

Build the plugin to generate the `dist` folder:

```bash
npm run build
```

Verify the build was successful by checking that the `dist` folder exists and contains:
- `dist/admin/` (with compiled admin code)
- `dist/server/` (with compiled server code)

### Step 4: Verify Package Contents

Check what files will be published:

```bash
npm pack --dry-run
```

This shows what will be included in the package. The `files` field in `package.json` controls what gets published (currently set to `["dist"]`).

### Step 5: Check Package Name Availability

Verify the package name is available (or that you own it):

```bash
npm view @strapix/strapi-plugin-alt-text-generator
```

If the package doesn't exist, you'll get a 404 error, which means the name is available.

**Note:** Since this is a scoped package (`@strapix/...`), you need to ensure you have access to publish under the `@strapix` organization on npm. If you don't own this organization, you'll need to either:
- Create/join the `@strapix` organization on npm
- Use a different scope you own (e.g., `@your-username/strapi-plugin-alt-text-generator`)

### Step 6: Publish to npm

**For public release:**

Since this is a scoped package, you need to publish with `--access public`:

```bash
npm publish --access public
```

**Important:** Always use `--access public` for scoped packages. Without this flag, scoped packages are published as **private** by default (which requires a paid npm account).

**Verify it's public after publishing:**

1. Check the package page - it should be publicly accessible without login
2. Run: `npm view @strapix/strapi-plugin-alt-text-generator` - should work without authentication
3. The package page URL should be accessible: `https://www.npmjs.com/package/@strapix/strapi-plugin-alt-text-generator`

**For testing (publish as beta/alpha):**

```bash
npm publish --access public --tag beta
# or
npm publish --access public --tag alpha
```

Users can then install with:
```bash
npm install @strapix/strapi-plugin-alt-text-generator@beta
```

### Step 7: Verify Publication

After publishing, verify the package is available:

```bash
npm view @strapix/strapi-plugin-alt-text-generator
```

Visit the package page:
```
https://www.npmjs.com/package/@strapix/strapi-plugin-alt-text-generator
```

### Step 8: Test Installation

Test installing the published package in a fresh Strapi project:

```bash
cd /path/to/test-strapi-project
npm install @strapix/strapi-plugin-alt-text-generator
```

Verify it installs correctly and the plugin appears in Strapi.

## Updating the Package

For subsequent releases:

1. Make your changes
2. Update version: `npm version patch|minor|major`
3. Build: `npm run build`
4. Publish: `npm publish --access public` (always include `--access public` for scoped packages)

## Deleting/Unpublishing Packages

### Unpublishing a Specific Version

You can unpublish a specific version within 72 hours of publishing:

```bash
npm unpublish @strapix/strapi-plugin-alt-text-generator@1.0.0
```

### Unpublishing All Versions

**⚠️ Warning:** This permanently removes the package from npm. Use with caution!

```bash
npm unpublish @strapix/strapi-plugin-alt-text-generator --force
```

**Important Notes:**
- You can only unpublish packages within **72 hours** of publishing
- After 72 hours, you must contact npm support to unpublish
- If the package has more than 300 downloads or is older than 72 hours, you'll need to use `--force` flag and npm may require additional verification
- Unpublishing can break projects that depend on your package - consider deprecating instead

### Deprecating Instead of Unpublishing

If you want to prevent new installs but keep existing ones working, deprecate instead:

```bash
npm deprecate @strapix/strapi-plugin-alt-text-generator "This package is deprecated. Please use @strapix/new-package-name instead."
```

To deprecate a specific version:

```bash
npm deprecate @strapix/strapi-plugin-alt-text-generator@1.0.0 "This version has a critical bug. Please upgrade."
```

## Ensuring Package is Public (Not Private)

### Check if Package is Public

1. **Via npm CLI:**
   ```bash
   npm view @strapix/strapi-plugin-alt-text-generator
   ```
   If you get a 404 or permission error without being logged in, it might be private.

2. **Via Web:**
   - Visit: `https://www.npmjs.com/package/@strapix/strapi-plugin-alt-text-generator`
   - If you can see it without logging in, it's public
   - If it shows "private package" or requires login, it's private

3. **Check package.json:**
   ```bash
   npm view @strapix/strapi-plugin-alt-text-generator --json | grep private
   ```
   Should return `null` or not exist for public packages.

### Making a Private Package Public

If you accidentally published as private, you can't change it directly. You need to:

1. Unpublish the private version (within 72 hours)
2. Republish with `--access public`:
   ```bash
   npm publish --access public
   ```

### Setting Default Access for Scoped Packages

To avoid forgetting `--access public`, configure npm to publish scoped packages as public by default:

```bash
npm config set @strapix:registry https://registry.npmjs.org/
npm config set @strapix:access public
```

Or add to your `.npmrc` file in the project root:

```
@strapix:registry=https://registry.npmjs.org/
@strapix:access=public
```

This ensures all packages under `@strapix` scope are published as public by default.

## Troubleshooting

### Error: "You do not have permission to publish"

- Ensure you're logged in: `npm whoami`
- Verify you own the package name or it's available
- If the package exists under a different account, you'll need to use a different name or contact npm support

### Error: "Package name too similar"

- The package name might be too similar to an existing package
- Since you're already using a scoped package, ensure you have access to the `@strapix` organization
- If you don't have access, create your own scope or use `@your-username/strapi-plugin-alt-text-generator`

### Build Errors

- Ensure all dependencies are installed: `npm install`
- Check TypeScript compilation errors
- Verify Strapi SDK version compatibility

### Version Already Exists

- If you try to publish the same version twice, npm will reject it
- Bump the version: `npm version patch`

## Optional: Add Repository and Homepage

Consider adding these fields to `package.json` for better npm page presentation:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/strapi-plugin-alt-text-generator.git"
  },
  "homepage": "https://github.com/your-username/strapi-plugin-alt-text-generator#readme",
  "bugs": {
    "url": "https://github.com/your-username/strapi-plugin-alt-text-generator/issues"
  }
}
```

## Publishing Checklist

Before publishing, ensure:

- [ ] Version number is updated
- [ ] Plugin builds successfully (`npm run build`)
- [ ] README.md is up to date
- [ ] All tests pass (if applicable)
- [ ] Package name is correct
- [ ] You're logged in to npm (`npm whoami`)
- [ ] `dist` folder contains all necessary files
- [ ] No sensitive data in published files
- [ ] **Using `--access public` flag** (for scoped packages)
- [ ] Verified package is public after publishing (check npm page)
