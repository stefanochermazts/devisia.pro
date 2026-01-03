# Development Plan: Devisia Astro + Decap CMS Project

## Project Overview
Initialize a professional Astro website for Devisia with Decap CMS (formerly Netlify CMS) and Netlify deployment. Create a complete project structure with TypeScript, content collections in src/content, admin panel at /admin, minimal content collections (pages: home, about, services, contact; blog posts), SEO-ready pages, Netlify Forms contact form, and production-ready configuration.

---

## Step 1: Initialize Astro Project with TypeScript

### Action
Initialize a new Git repository and scaffold an Astro project with TypeScript support.

### Reasoning
This creates the foundation of the codebase, ensures version control from day 1, and sets up Astro in the preferred language (TypeScript) as required by the code rules.

### Implementation Details
- Run `npm create astro@latest -- --template basics` in the folder `devisia.pro`.
- When prompted, choose **TypeScript** as the language.
- Initialize Git: `git init` and create an initial commit.
- Add a remote placeholder (e.g., GitHub) if desired: `git remote add origin <repo-url>`.
- Install any needed dev dependencies: `npm i -D @astrojs/netlify`.

### Error Handling
- If `npm create astro` fails, ensure Node ≥ 18 and npm ≥ 8 are installed.
- Verify that the selected template generated a `tsconfig.json`; if missing, create one using `npx tsc --init` and adjust to Astro's defaults.

### Testing
- Run `npm run dev` and confirm the default Astro starter renders at `http://localhost:4321`.
- Verify that `npm run build` completes without errors and produces a `dist/` directory.

---

## Step 2: Configure Project Files

### Action
Configure project-level files to satisfy the code‑rule conventions and enable content collections.

### Reasoning
Astro's configuration must be TypeScript‑friendly, enforce the folder layout, and activate the Content Collections API which will drive the CMS and static pages.

### Implementation Details
- Rename `astro.config.mjs` to `astro.config.ts` (TypeScript is required by the rules).
- Inside `astro.config.ts`, export the config with Netlify adapter.
- Ensure `tsconfig.json` includes `"allowJs": true` and `"moduleResolution": "node"`.
- Create a `src/content` directory with subfolders `pages` and `blog`.

### Error Handling
- If Astro fails to read the TypeScript config, check that `ts-node` is installed and that `package.json` has `"type": "module"`.

### Testing
- Run `npm run dev` again; the server should start without configuration errors.
- Verify that `astro info` lists the Netlify adapter and content collections enabled.

---

## Step 3: Define Content Collection Schemas

### Action
Define Content Collection schemas for pages and blog posts in `src/content/config.ts`.

### Reasoning
Schemas enforce type safety, give Decap CMS the structure it needs, and provide validation for static generation.

### Implementation Details
- Create `src/content/config.ts` with Zod schemas for pages and blog collections.
- Page schema: title, description, heroImage fields.
- Blog schema: title, description, pubDate, heroImage, author, tags fields.
- Place markdown files for each page under `src/content/pages/`.
- Place blog posts under `src/content/blog/`.

### Error Handling
- Ensure each markdown file contains valid frontmatter; otherwise Astro will throw schema validation errors during build.

### Testing
- Run `npm run dev` and inspect collections loading.
- Add an intentionally malformed frontmatter entry to verify that the build fails with a clear schema error.

---

## Step 4: Create Base Layout

### Action
Create the base layout component `src/layouts/Layout.astro` with SEO‑friendly `<head>` handling.

### Reasoning
All pages will share a common layout that injects meta tags, site navigation, and a content slot, satisfying the SEO requirement and keeping UI consistent.

### Implementation Details
- File: `src/layouts/Layout.astro` (PascalCase, per naming rule).
- Include SEO meta tags: title, description, og:image.
- Add simple navigation: Home, About, Services, Blog, Contact.
- Add footer with copyright.

### Error Handling
- Verify that the component imports correctly and that the props types align with page data.

### Testing
- Create a temporary page that uses the Layout and confirm the generated HTML contains the correct tags.

---

## Step 5: Implement Static Pages

### Action
Implement static pages (Home, About, Services, Contact) using the layout and content collections.

### Reasoning
Pages must pull their content from the defined collections, render via the shared layout, and be SEO‑ready.

### Implementation Details
- Create Astro files: `index.astro`, `about.astro`, `services.astro`, `contact.astro`.
- Each page loads content from the corresponding markdown file in `src/content/pages/`.
- Use the shared Layout component.
- Render markdown body with proper formatting.

### Error Handling
- If a page cannot find its markdown entry, fallback to a default title/description and log a friendly console warning.

### Testing
- Start the dev server and navigate to each route; verify that the page content matches the markdown files.
- View page source to confirm `<title>` and meta tags are correctly injected.

---

## Step 6: Add Netlify Forms Contact Form

### Action
Add a Netlify Forms-enabled contact form to `src/pages/contact.astro`.

### Reasoning
Netlify Forms provides serverless handling of submissions without extra backend code, fulfilling the requirement for a functional contact form.

### Implementation Details
- Add form with `netlify` attribute and honeypot protection.
- Include fields: name, email, message.
- Add hidden `form-name` field.
- Style minimally.

### Error Handling
- If the form does not appear, verify that the HTML is not being stripped by Astro's markdown processing.
- On Netlify, check the "Forms" dashboard to confirm the form is registered after the first deployment.

### Testing
- Run the site locally, submit the form, and check the network request.
- Deploy a preview to Netlify and confirm the form appears in the Netlify Forms list after submission.

---

## Step 7: Build Blog Section

### Action
Build the blog section: list page (`src/pages/blog/index.astro`) and slug page (`src/pages/blog/[slug].astro`).

### Reasoning
The blog must be statically generated, list all posts, and render individual posts with SEO metadata.

### Implementation Details
- Create blog index page that lists all posts sorted by date.
- Create dynamic `[slug].astro` page for individual posts.
- Display post metadata: title, date, description, hero image.
- Render markdown content.

### Error Handling
- If a slug does not resolve, display a 404 page.

### Testing
- Add two sample markdown files under `src/content/blog/` and verify the list page shows them and each individual post renders correctly.
- Check that each post page includes proper `<title>` and `<meta>` tags.

---

## Step 8: Set Up Decap CMS Admin Panel

### Action
Set up Decap CMS (formerly Netlify CMS) admin panel in `public/admin`.

### Reasoning
The admin UI must be reachable at `/admin`, load the YAML configuration, and integrate with the Git-based workflow on Netlify.

### Implementation Details
- Create `public/admin/index.html` with Decap CMS scripts.
- Create `public/admin/config.yml` with:
  - Backend: git-gateway
  - Media folder: public/uploads
  - Collections: pages and blog with proper fields
- Add `public/uploads` folder for images.

### Error Handling
- If the admin UI fails to load, verify that `config.yml` is reachable and that the Netlify Identity widget is available.

### Testing
- Navigate to `http://localhost:4321/admin` and confirm the login screen appears.
- After logging in, try creating a new page and verify that a new markdown file appears.

---

## Step 9: Configure Netlify Identity & Git Gateway

### Action
Configure Netlify Identity and Git Gateway for Decap CMS authentication.

### Reasoning
These services enable non‑technical users to log in to `/admin` and commit content via the Git workflow.

### Implementation Details
- Enable Identity in Netlify dashboard.
- Enable Git Gateway and connect GitHub repository.
- Add Identity widget script to admin UI.
- Document setup steps in README.

### Error Handling
- If Git Gateway cannot connect, verify permissions and branch configuration.

### Testing
- After enabling Identity, log in on `/admin` and create a content entry to confirm it appears as a new commit on GitHub.

---

## Step 10: Create netlify.toml

### Action
Create `netlify.toml` with build settings, redirects, and Netlify Forms handling.

### Reasoning
Netlify needs explicit instructions for building the Astro site, serving the admin UI, and handling form submissions.

### Implementation Details
- Build command: `npm run build`
- Publish directory: `dist`
- Redirect `/admin` to `/admin/index.html` (200)
- Add security headers.

### Error Handling
- If the build fails on Netlify, check the build logs for missing dependencies or TypeScript errors.

### Testing
- Run `netlify build` locally to verify the build completes.
- Deploy a preview and confirm the `/admin` URL resolves correctly.

---

## Step 11: Update package.json Scripts

### Action
Update `package.json` scripts, add any optional dev dependencies, and ensure linting/formatting align with the code rules.

### Reasoning
Convenient scripts simplify development and enforce the project's coding standards.

### Implementation Details
- Add scripts: dev, build, preview, format, lint.
- Add dev dependencies: prettier, eslint, @astrojs/netlify.
- Create `.prettierrc` with 2-space indentation.
- Create `.eslintrc.cjs` with Astro config.

### Error Handling
- If linting fails due to naming, rename files to follow kebab-case.

### Testing
- Run `npm run format` and `npm run lint` to ensure no violations.

---

## Step 12: Write Comprehensive README

### Action
Write a comprehensive `README.md` covering setup, local development, CMS configuration, Netlify deployment, and a deployment checklist.

### Reasoning
The README satisfies documentation rules and serves as a guide for future contributors and the non‑technical content editors.

### Implementation Details
- Sections: Overview, Prerequisites, Installation, Local Development, Content Management, Netlify Deployment, Netlify Forms, Deployment Checklist, Troubleshooting.
- Add code blocks for command snippets.

### Error Handling
- Verify relative links work in the GitHub rendered README.

### Testing
- Render the README locally to ensure markdown formatting is correct.

---

## Step 13: Final End-to-End Verification

### Action
Perform a final end‑to‑end verification: build the site, deploy to Netlify (preview), test CMS editing, and confirm Netlify Forms capture submissions.

### Reasoning
Ensures the entire setup works as a cohesive, production‑ready solution before handing over the repository.

### Implementation Details
- Run `npm run build` – confirm no errors.
- Deploy preview to Netlify.
- Visit the preview URL, navigate to each page.
- Access `/admin`, create a new blog post.
- Submit the contact form and check Netlify Forms dashboard.

### Error Handling
- If the preview does not rebuild after a CMS commit, ensure the Identity and Git Gateway webhooks are active.

### Testing
- Record a short checklist and tick each item as verified.

---

## Technology Stack

- **Languages**: TypeScript, JavaScript, HTML, CSS
- **Frameworks**: Astro (latest), Decap CMS
- **Tools**: npm, Git
- **Platforms**: Netlify, GitHub

## Code Rules

- Use TypeScript for all configuration files
- Use 2-space indentation
- Use kebab-case for file names
- Use PascalCase for component names
- Content collections in src/content directory
- Pages in src/pages directory
- Layouts in src/layouts directory
- Admin files in public/admin directory
- Uploads in public/uploads directory
