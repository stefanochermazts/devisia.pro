# Devisia Website

> A modern, fast, and SEO-optimized website built with Astro and Decap CMS, deployed on Netlify.

[![Built with Astro](https://astro.badg.es/v2/built-with-astro/tiny.svg)](https://astro.build)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

## 🚀 Project Overview

This is the official website for Devisia, a technology consulting firm specializing in digital transformation and custom software development. The site features:

- **Static Site Generation** with Astro for optimal performance
- **Content Management** via Decap CMS (formerly Netlify CMS)
- **Git-based Workflow** for content versioning and collaboration
- **SEO Optimization** with proper meta tags and Open Graph support
- **Netlify Forms** for contact form submissions with automatic double email system (thank-you email to user + notification to site manager)
- **Responsive Design** that works on all devices
- **TypeScript** for type safety and better developer experience

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Local Development](#local-development)
- [Project Structure](#project-structure)
- [Content Management](#content-management)
- [Deploying to Netlify](#deploying-to-netlify)
- [Netlify Configuration](#netlify-configuration)
- [Scripts](#scripts)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or higher (specified in `.nvmrc`)
- **npm** 8.x or higher
- **Git** for version control
- A **GitHub** account for repository hosting
- A **Netlify** account for deployment

### Using the Correct Node Version

This project uses Node.js 20.x. If you have `nvm` (Node Version Manager) installed:

```bash
nvm use
```

This will automatically switch to the Node version specified in `.nvmrc`.

## 🏁 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/stefanochermazts/devisia.pro.git
cd devisia.pro
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

The site will be available at `http://localhost:4321`

### 4. Build for Production

```bash
npm run build
```

The built site will be in the `dist/` directory.

### 5. Preview Production Build

```bash
npm run preview
```

## 💻 Local Development

### Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at `localhost:4321` |
| `npm run build` | Build production site to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run lint` | Lint code with ESLint |

### Hot Reload

Astro includes hot module replacement (HMR), so changes to your code will be reflected immediately in the browser without a full page reload.

## 📁 Project Structure

```
devisia.pro/
├── public/                  # Static assets
│   ├── admin/              # Decap CMS admin panel
│   │   ├── config.yml      # CMS configuration
│   │   └── index.html      # Admin entry point
│   ├── uploads/            # User-uploaded images (gitignored)
│   └── favicon.svg         # Site favicon
├── src/
│   ├── content/            # Content collections
│   │   ├── config.ts       # Content schemas
│   │   ├── pages/          # Page content (MD)
│   │   │   ├── home.md
│   │   │   ├── about.md
│   │   │   ├── services.md
│   │   │   └── contact.md
│   │   └── blog/           # Blog posts (MD)
│   ├── layouts/
│   │   └── Layout.astro    # Base layout component
│   └── pages/              # Route pages
│       ├── index.astro     # Home page
│       ├── about.astro     # About page
│       ├── services.astro  # Services page
│       ├── contact.astro   # Contact page with form
│       └── blog/
│           ├── index.astro     # Blog listing
│           └── [slug].astro    # Individual blog posts
├── .nvmrc                  # Node version specification
├── astro.config.ts         # Astro configuration
├── netlify.toml            # Netlify deployment config
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md              # This file
```

## 📝 Content Management

### Accessing the CMS

1. **Local Development**: Navigate to `http://localhost:4321/admin`
2. **Production**: Navigate to `https://devisia.pro/admin`

### First-Time Setup

The CMS is configured to use **Netlify Identity** for authentication and **Git Gateway** for content management. See the [Deploying to Netlify](#deploying-to-netlify) section for setup instructions.

### Content Types

#### Pages
Static pages like Home, About, Services, and Contact. Each page has:
- Title
- Description (optional)
- Hero Image (optional)
- Markdown content

#### Blog Posts
Blog articles with:
- Title
- Description
- Publication Date
- Author
- Hero Image (optional)
- Tags (optional)
- Markdown content

### Editing Content

1. Log in to `/admin` using your Netlify Identity credentials
2. Select the content type (Pages or Blog Posts)
3. Click on an existing item to edit or "New [Type]" to create
4. Make your changes
5. Click "Save" (draft) or "Publish" (live)
6. Changes are committed to GitHub and trigger a rebuild

### Editorial Workflow

The CMS is configured with **editorial workflow** enabled, which provides:
- **Drafts**: Work-in-progress content
- **In Review**: Content ready for review
- **Ready**: Approved content ready to publish

## 🚀 Deploying to Netlify

### Step 1: Connect to GitHub

1. Push your code to GitHub:
```bash
git push origin main
```

### Step 2: Import to Netlify

1. Log in to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub and authorize Netlify
4. Select the `devisia.pro` repository
5. Netlify will auto-detect the build settings from `netlify.toml`
6. Click "Deploy site"

### Step 3: Enable Netlify Identity

1. In your Netlify site dashboard, go to **Identity**
2. Click "Enable Identity"
3. Under **Settings & usage**, configure:
   - **Registration**: Invite only (recommended)
   - **External providers**: Enable if desired (Google, GitHub, etc.)
4. Under **Services**, enable **Git Gateway**

### Step 4: Invite Users

1. Go to **Identity** → **Invite users**
2. Enter email addresses for content editors
3. Users will receive an invitation email
4. They can set their password and access `/admin`

### Step 5: Configure Git Gateway

1. In Netlify, go to **Settings** → **Identity** → **Services**
2. Under **Git Gateway**, click "Enable Git Gateway"
3. This allows the CMS to commit directly to your GitHub repository

### Step 6: Test the CMS

1. Visit your deployed site at `https://your-site.netlify.app/admin`
2. Log in with your Netlify Identity credentials
3. Try creating or editing a blog post
4. Verify that changes appear on the site after rebuild

## ⚙️ Netlify Configuration

The `netlify.toml` file configures:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 20
- **Redirects**: `/admin/*` → `/admin/index.html` (SPA mode)
- **Headers**: Security and caching headers
- **Deploy contexts**: Production, preview, and branch deploys

### Environment Variables

No environment variables are required for basic operation. If you add custom functionality, you can set them in:

**Netlify Dashboard** → **Site settings** → **Environment variables**

## 🛠️ Scripts

### Development

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Quality

```bash
npm run format       # Format code with Prettier
npm run format:check # Check formatting without changes
npm run lint         # Lint code with ESLint
```

## 🐛 Troubleshooting

### Build Fails on Netlify

**Problem**: Build fails with "Module not found" or similar errors.

**Solution**:
- Ensure `package.json` dependencies are up to date
- Check that `NODE_VERSION` in `netlify.toml` matches `.nvmrc`
- Clear Netlify cache: **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

### CMS Login Not Working

**Problem**: Can't log in to `/admin`.

**Solution**:
- Verify **Netlify Identity** is enabled in your Netlify dashboard
- Check that **Git Gateway** is enabled under Identity → Services
- Ensure you've been invited as a user (check email)
- Try logging out and back in
- Clear browser cache and cookies

### Forms Not Submitting

**Problem**: Contact form submissions aren't appearing in Netlify.

**Solution**:
- Verify the form has `data-netlify="true"` attribute
- Check that the `form-name` hidden input matches the form `name`
- Look for submissions in **Netlify Dashboard** → **Forms**
- Ensure the site has been deployed at least once (Netlify detects forms during build)

### Contact Form Email System

The contact form uses a **double email system**:
1. **Thank-you email** sent to the user who submitted the form (in their language: IT/EN)
2. **Notification email** sent to the site manager with form details

**Configuration Required**:
- See `ENV_VARS.md` for required environment variables
- Configure SMTP settings (Mailtrap recommended for testing)
- Set environment variables in Netlify Dashboard for production

**Testing Locally**:
- Use `netlify dev` instead of `npm run dev` to test Netlify Functions
- Configure `.env` file with Mailtrap credentials
- Mailtrap sandbox captures emails without sending them (perfect for testing)

**Troubleshooting Email Issues**:
- Check Netlify Function logs: **Netlify Dashboard** → **Functions** → **contact-email**
- Verify all environment variables are set correctly
- Ensure SMTP credentials are valid
- Check that `FROM_EMAIL` and `SITE_MANAGER_EMAIL` are correct

### Content Changes Not Appearing

**Problem**: Edited content doesn't show on the live site.

**Solution**:
- Check that you clicked "Publish" (not just "Save") in the CMS
- Verify the deployment succeeded in **Netlify Dashboard** → **Deploys**
- Check GitHub for the commit from Decap CMS
- Clear browser cache or try an incognito window

### Local CMS Not Working

**Problem**: CMS doesn't work at `localhost:4321/admin`.

**Solution**:
- The CMS requires Git Gateway, which only works in production
- For local testing, you can use the [Decap CMS Proxy Server](https://decapcms.org/docs/beta-features/#working-with-a-local-git-repository)
- Alternatively, test CMS functionality in a Netlify deploy preview

## 📚 Learn More

### Astro

- [Documentation](https://docs.astro.build)
- [Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro Discord](https://astro.build/chat)

### Decap CMS

- [Documentation](https://decapcms.org/docs/)
- [Widgets Reference](https://decapcms.org/docs/widgets/)
- [GitHub](https://github.com/decaporg/decap-cms)

### Netlify

- [Documentation](https://docs.netlify.com)
- [Netlify Forms](https://docs.netlify.com/forms/setup/)
- [Netlify Identity](https://docs.netlify.com/visitor-access/identity/)

## 📄 License

MIT © Devisia

---

## ✅ Deployment Checklist

Use this checklist when deploying for the first time or after major changes:

### Pre-Deployment
- [ ] `npm install` completes successfully
- [ ] `npm run build` completes without errors
- [ ] `npm run preview` shows the site correctly
- [ ] All content is committed to Git
- [ ] `.nvmrc` specifies Node 20.x

### Netlify Setup
- [ ] Repository connected to Netlify
- [ ] Build settings match `netlify.toml`
- [ ] Site deploys successfully
- [ ] Site URL is accessible

### CMS Setup
- [ ] Netlify Identity is enabled
- [ ] Git Gateway is enabled
- [ ] At least one user is invited
- [ ] Can log in to `/admin`
- [ ] Can create/edit content via CMS
- [ ] Content changes trigger rebuilds

### Forms Setup
- [ ] Contact form appears on `/contact`
- [ ] Test submission works
- [ ] Submission appears in Netlify Forms dashboard
- [ ] Email notifications configured (optional)

### Final Checks
- [ ] All pages load correctly
- [ ] Navigation works on all pages
- [ ] Blog posts display properly
- [ ] Images load correctly
- [ ] Mobile responsive design works
- [ ] SEO meta tags present (view page source)
- [ ] Site appears in Google Search Console (optional)

---

**Built with ❤️ by Devisia**
