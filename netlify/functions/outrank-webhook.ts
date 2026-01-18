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
    
    // Normalize input to an array of articles
    let articlesToProcess: any[] = [];
    
    if (payload.data && Array.isArray(payload.data.articles)) {
      articlesToProcess = payload.data.articles;
    } else if (payload.articles && Array.isArray(payload.articles)) {
       // Just in case structure is slightly different
      articlesToProcess = payload.articles;
    } else {
       // Fallback for single article test payloads or flat structure
       const singleData = payload.data || payload;
       // Check if it looks like an article (has title)
       if (singleData.title || singleData.article_title) {
         articlesToProcess = [singleData];
       }
    }

    if (articlesToProcess.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'No valid articles found in payload', 
          received: payload 
        }),
      };
    }

    const results = [];
    const errors = [];

    // Process each article
    for (const data of articlesToProcess) {
        const title = data.title || data.article_title;
        const content_markdown = data.content_markdown || data.markdown || data.content;
        const slug = data.slug || data.article_slug;
        const meta_description = data.meta_description || data.description || data.seo_description;
        const hero_image = data.hero_image || data.image_url || data.featured_image;
        const tags = data.tags || [];
        const language = data.language || 'en';
        const author = data.author || 'Devisia AI';
        const translation_slug = data.translation_slug;

        if (!title || !content_markdown || !slug) {
            errors.push({ 
                slug: slug || 'unknown', 
                error: 'Missing required fields (title, content_markdown, slug)' 
            });
            continue;
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
            translation_slug ? `translationSlug: "${translation_slug}"` : `translationSlug: "${slug}"`,
            '---',
            '',
            content_markdown
        ].join('\n');

        // GitHub API Configuration
        const token = getEnv('GITHUB_TOKEN');
        const owner = getEnv('GITHUB_REPO_OWNER', 'stefanochermazts');
        const repo = getEnv('GITHUB_REPO_NAME', 'devisia.pro');
        const path = `src/content/blog/${language}/${slug}.md`;

        try {
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
                console.log(`File ${path} does not exist yet or error fetching it.`);
            }

        // Create or Update the file
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
                sha: sha 
            })
        });

        if (!putRes.ok) {
            const errorData = await putRes.json();
            throw new Error(`GitHub API error: ${JSON.stringify(errorData)}`);
        }
        
        results.push({
            slug,
            path,
            status: 'success',
            url: `https://github.com/${owner}/${repo}/blob/main/${path}`
        });

        // ==========================================
        // AUTOMATIC TRANSLATION (EN -> IT)
        // ==========================================
        if (language === 'en' && process.env.OPENAI_API_KEY) {
            try {
                const openaiApiKey = process.env.OPENAI_API_KEY;
                console.log(`Starting translation for ${slug} to IT...`);

                const systemPrompt = `You are a professional translator and SEO copywriter for a software company called Devisia.
Translate the following Markdown content from English to Italian.
Rules:
1. Maintain the exact same Markdown structure, headings, bolding, and links.
2. Do NOT translate image URLs, but DO translate image alt texts if present.
3. Keep the tone professional, technical yet accessible (Devisia's style).
4. Translate the title and SEO meta description as well.
5. Return the result as a JSON object with these keys: "title", "meta_description", "content_markdown".`;

                const userPrompt = JSON.stringify({
                    title,
                    meta_description,
                    content_markdown
                });

                const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${openaiApiKey}`
                    },
                    body: JSON.stringify({
                        model: "gpt-4o-mini", // Optimized for speed and cost, good for translation
                        messages: [
                            { role: "system", content: systemPrompt },
                            { role: "user", content: userPrompt }
                        ],
                        response_format: { type: "json_object" }
                    })
                });

                if (!aiRes.ok) {
                    throw new Error(`OpenAI API error: ${aiRes.statusText}`);
                }

                const aiData = await aiRes.json();
                const translatedData = JSON.parse(aiData.choices[0].message.content);

                // Prepare IT frontmatter
                // We use the SAME translationSlug to link them
                const itSlug = slug; // Keep same slug or translate it? Keeping same slug is easier for linking, but translated slug is better for SEO. Let's keep same slug for now or append -it? 
                // Best practice: translate slug. But we need a mapping.
                // For simplicity, let's use the English slug but in the /it/ folder. 
                // Or better: ask AI to translate slug too?
                // Let's keep english slug for IT file to simplify linking, but content is IT.
                // WAIT: If we use same slug in /it/ folder, the URL will be /blog/slug (Italian) and /en/blog/slug (English). This is perfect.
                
                const itPath = `src/content/blog/it/${slug}.md`;
                const itFrontmatter = [
                    '---',
                    `title: "${translatedData.title.replace(/"/g, '\\"')}"`,
                    `description: "${(translatedData.meta_description || '').replace(/"/g, '\\"')}"`,
                    `pubDate: ${pubDate}`,
                    hero_image ? `heroImage: "${hero_image}"` : 'heroImage: null',
                    `author: "${author}"`,
                    `tags: [${tags.map((t: string) => `"${t}"`).join(', ')}]`,
                    `translationSlug: "${slug}"`, // Link to itself/common ID
                    '---',
                    '',
                    translatedData.content_markdown
                ].join('\n');

                // We also need to update the EN file to have translationSlug set to "slug" if it wasn't set?
                // In the code above, we already set translationSlug: "${translation_slug}" : 'null'.
                // If translation_slug came empty from payload, we should have set it to 'slug' (the current slug) so they match.
                // Let's assume for this auto-translation flow that the common ID is the English slug.
                
                // Need to re-update the EN file? 
                // Only if translationSlug was null.
                // For now let's just create the IT file. Ideally, the EN file frontmatter should have `translationSlug: slug`
                
                // Save IT file
                const itApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${itPath}`;
                let itSha: string | undefined;
                try {
                    const getItRes = await fetch(itApiUrl, {
                        headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }
                    });
                    if (getItRes.ok) {
                        const d = await getItRes.json();
                        itSha = d.sha;
                    }
                } catch(e) {}

                const itCommitMsg = itSha ? `auto: update translated blog post ${slug}` : `auto: create translated blog post ${slug}`;
                
                await fetch(itApiUrl, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/vnd.github.v3+json',
                        'User-Agent': 'Devisia-Webhook-Handler'
                    },
                    body: JSON.stringify({
                        message: itCommitMsg,
                        content: Buffer.from(itFrontmatter).toString('base64'),
                        sha: itSha 
                    })
                });

                console.log(`Translation to IT successful for ${slug}`);
                results.push({ slug: `${slug}-it`, status: 'translated', path: itPath });

            } catch (transErr: any) {
                console.error(`Translation failed for ${slug}:`, transErr);
                errors.push({ slug, error: `Translation failed: ${transErr.message}` });
                // We don't fail the whole request, as the EN article was published.
            }
        }

        } catch (err: any) {
            console.error(`Error processing article ${slug}:`, err);
            errors.push({ slug, error: err.message });
        }
    }

    return {
      statusCode: results.length > 0 ? 201 : 400, // 201 if at least one succeeded
      body: JSON.stringify({ 
        message: `Processed ${articlesToProcess.length} articles. Success: ${results.length}, Failed: ${errors.length}`, 
        results,
        errors
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
