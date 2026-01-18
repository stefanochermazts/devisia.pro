import type { Handler } from '@netlify/functions';

/**
 * Webhook handler for Outrank.so / Artiforge
 * Automatically creates a new blog post in the repository.
 * 
 * Expected payload (approximate):
 * {
 *   "title": "Article Title",
 *   "content_markdown": "# Markdown Content",
 *   "slug": "article-slug",
 *   "meta_description": "SEO description",
 *   "hero_image": "https://...",
 *   "tags": ["tag1", "tag2"],
 *   "language": "it" | "en",
 *   "author": "Author Name"
 * }
 */

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

export const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Basic security check (Bearer token)
  const authHeader = event.headers['authorization'];
  const secret = process.env.OUTRANK_SECRET;
  
  if (secret && authHeader !== `Bearer ${secret}`) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  try {
    const rawBody = event.body || '{}';
    console.log('Received webhook payload:', rawBody);
    
    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (e) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid JSON payload', received: rawBody.substring(0, 100) }),
      };
    }
    
    // Extract data from payload (handle both direct and potentially nested under 'data')
    const data = payload.data || payload;
    
    const title = data.title || data.article_title;
    const content_markdown = data.content_markdown || data.markdown || data.content;
    const slug = data.slug || data.article_slug;
    const meta_description = data.meta_description || data.description || data.seo_description;
    const hero_image = data.hero_image || data.image_url || data.featured_image;
    const tags = data.tags || [];
    const language = data.language || 'it';
    const author = data.author || 'Devisia AI';
    const translation_slug = data.translation_slug;

    if (!title || !content_markdown || !slug) {
      const missing = [];
      if (!title) missing.push('title');
      if (!content_markdown) missing.push('content_markdown');
      if (!slug) missing.push('slug');

      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: `Missing required fields: ${missing.join(', ')}`,
          received_keys: Object.keys(data)
        }),
      };
    }

    // Prepare frontmatter
    const pubDate = new Date().toISOString();
    const frontmatter = [
      '---',
      `title: "${title.replace(/"/g, '\\"')}"`,
      `description: "${(meta_description || '').replace(/"/g, '\\"')}"`,
      `pubDate: ${pubDate}`,
      hero_image ? `heroImage: "${hero_image}"` : 'heroImage: null',
      `author: "${author}"`,
      `tags: [${tags.map((t: string) => `"${t}"`).join(', ')}]`,
      translation_slug ? `translationSlug: "${translation_slug}"` : 'translationSlug: null',
      '---',
      '',
      content_markdown
    ].join('\n');

    // GitHub API Configuration
    const token = getEnv('GITHUB_TOKEN');
    const owner = getEnv('GITHUB_REPO_OWNER', 'stefanochermazts');
    const repo = getEnv('GITHUB_REPO_NAME', 'devisia.pro');
    const path = `src/content/blog/${language}/${slug}.md`;

    // 1. Check if file already exists to get its SHA (if we want to update it)
    // For now, we'll just try to create it. If it exists, we'll get an error or we could overwrite it.
    
    const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    
    // Try to get existing file to obtain SHA (for updates)
    let sha: string | undefined;
    try {
      const getFileRes = await fetch(githubApiUrl, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      if (getFileRes.ok) {
        const fileData = await getFileRes.json();
        sha = fileData.sha;
      }
    } catch (e) {
      console.log('File does not exist yet or error fetching it.');
    }

    // 2. Create or Update the file
    const commitMessage = sha ? `auto: update blog post ${slug}` : `auto: create blog post ${slug}`;
    const putRes = await fetch(githubApiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Devisia-Webhook-Handler'
      },
      body: JSON.stringify({
        message: commitMessage,
        content: Buffer.from(frontmatter).toString('base64'),
        sha: sha // If sha is provided, it's an update
      })
    });

    if (!putRes.ok) {
      const errorData = await putRes.json();
      throw new Error(`GitHub API error: ${JSON.stringify(errorData)}`);
    }

    return {
      statusCode: 201,
      body: JSON.stringify({ 
        message: 'Article published successfully', 
        path,
        url: `https://github.com/${owner}/${repo}/blob/main/${path}`
      }),
    };

  } catch (error: any) {
    console.error('Webhook error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error', details: error.message }),
    };
  }
};
