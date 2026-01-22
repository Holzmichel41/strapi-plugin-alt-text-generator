# Contributing to strapi-plugin-alt-text-generator

Thank you for your interest in contributing to the **strapi-plugin-alt-text-generator** project!  
We welcome contributions of all kinds — bug reports, documentation improvements, ideas, and pull requests — and appreciate your time and effort.

---

## Table of Contents

1. [How to Get Started](#how-to-get-started)  
2. [Development Workflow](#development-workflow)  
3. [Coding Guidelines](#coding-guidelines)  
4. [Documentation Changes](#documentation-changes)  
5. [Submitting Pull Requests](#submitting-pull-requests)  
6. [Issues and Feature Requests](#issues-and-feature-requests)  
7. [Review Process](#review-process)  
8. [Code of Conduct](#code-of-conduct)

---

## How to Get Started

### Fork the Repository

1. Click the **Fork** button at the top right of this repository.
2. Clone your fork locally:

```bash
git clone https://github.com/<your-username>/strapi-plugin-alt-text-generator.git
cd strapi-plugin-alt-text-generator
```

---

## Development Workflow (Local Strapi Plugin Development)

To develop this Strapi plugin locally, follow Strapi’s recommended process for working with plugins:

### 1. Set up or use an existing Strapi project

You need a Strapi project where you can link and test your plugin. If you don’t have one yet, create it:

```bash
npx create-strapi-app@latest my-strapi-app
cd my-strapi-app
```

### 2. Link your plugin to the project

If your plugin is external to the Strapi app (not in `src/plugins`), you can link it for development:

1. Install `yalc` globally (if not already installed):

```bash
npm install -g yalc
```

2. From your plugin directory, add a link:

```bash
yalc publish
```

3. In your Strapi project, add the plugin locally:

```bash
cd /path/to/my-strapi-app
yalc add @strapix/strapi-plugin-alt-text-generator --link
npm install
```

Because the plugin is installed in `node_modules`, you usually **don’t need to manually edit the Strapi config**, but if you do, ensure the plugin is enabled (see below).

### 3. Enable the plugin (if required)

In your Strapi project’s config (create if missing):

**config/plugins.js**

```js
module.exports = {
  '@strapix/strapi-plugin-alt-text-generator': {
    enabled: true,
    resolve: './node_modules/@strapix/strapi-plugin-alt-text-generator'
  }
};
```

This tells Strapi where the plugin lives locally.

### 4. Start Strapi in development mode

From your Strapi project root:

```bash
npm run develop -- --watch-admin
```

The `--watch-admin` flag enables hot-reloading of admin UI files when you modify the plugin’s admin code.  
Server code changes (backend) usually require a restart of the Strapi server to take effect. :contentReference[oaicite:0]{index=0}

### 5. Edit and test changes

With the plugin linked and the Strapi server running:

- Modify backend logic (`/server/*`) to update APIs, controllers, services
- Modify admin UI (`/admin/*`) for UI changes
- Use Strapi’s APIs to interact with content and plugin UI

As you make changes:

- Backend changes often require restarting Strapi
- Admin UI changes can hot-reload with `--watch-admin`

### 6. Building for verification and publishing

When ready to package your plugin for publishing:

```bash
npm run build
npm run verify
```

These tasks generate production artifacts and validate the plugin for npm publishing. :contentReference[oaicite:1]{index=1}

---

## Coding Guidelines

To maintain a clean and consistent codebase:

- Follow the existing coding style.
- Choose descriptive names for variables and functions.
- Comment non-obvious parts of the code.
- Keep pull requests focused and concise.

If a linter or formatter is included, please run it before submitting your work.

---

## Documentation Changes

Accuracy in documentation is important. If your contribution introduces:

- New configuration options
- New features
- Changes in behavior

then update the README and any relevant docs to reflect this.

Explain how new items should be used in real scenarios.

---

## Submitting Pull Requests

### Push Your Branch

Push your feature branch to your fork:

```bash
git push origin feature/your-feature-name
```

### Open a Pull Request

1. On GitHub, open a pull request from your branch to this repository’s `main` branch.
2. Provide a clear title and description.
3. Reference any related issues (e.g., “Closes #123”).

---

### Pull Request Checklist

Include the following in your PR description:

- **Summary** — What this PR does
- **Related Issue** — If applicable
- **How to Review/Test** — Any steps reviewers need

Example:

```
## Summary
Add support for automatic alt text previews.

## Related Issue
Closes #45

## How to Test
1. Install plugin in a Strapi instance
2. Upload an image and verify alt text generation
```

Also check:

- [ ] Code changes follow the project’s style
- [ ] New behavior is documented
- [ ] No unrelated changes included

---

## Issues and Feature Requests

Use GitHub Issues for reporting bugs or suggesting features.

When opening an issue, please include:

- What you expected to happen
- What actually happened
- Steps to reproduce the problem (if applicable)

---

## Review Process

Once submitted, a maintainer will review your pull request.

You might be asked to make improvements before merging.  
Feedback is not criticism — it ensures the plugin stays reliable and understandable.

---

## Code of Conduct

By participating in this project, you agree to follow the project’s Code of Conduct.  
Be respectful, constructive, and inclusive in all interactions.

---

## Thank You!

Your contributions help make this plugin better for everyone—thank you! 🎉
