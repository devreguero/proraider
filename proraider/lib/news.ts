export type NewsItem = {
  slug: string
  href: string
  title: string
  category: string
  date: string
  image: string | null
}

export type ArticleContent = {
  title: string
  date: string
  category: string
  image: string | null
  html: string
}

export async function fetchArcRaidersNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch('https://arcraiders.com/news', {
      next: { revalidate: 300, tags: ['arc-news'] },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    })
    if (!res.ok) return []

    const html = await res.text()
    const items: NewsItem[] = []

    // Each article is an <a href="/news/SLUG"> block (skip /news/tag/ links)
    const articleRe = /<a\s[^>]*href="(\/news\/(?!tag\/)[a-z0-9-]+)"[^>]*>([\s\S]*?)<\/a>/gi
    let m: RegExpExecArray | null

    while ((m = articleRe.exec(html)) !== null) {
      const slug = m[1].replace('/news/', '')
      const inner = m[2]

      // Image: prefer 300x200 variant from <img src="...">
      const imgM =
        inner.match(/src="(https:\/\/storage\.googleapis\.com\/[^"]+300x200[^"]*)"/) ??
        inner.match(/src="(https:\/\/storage\.googleapis\.com\/[^"]+\.(?:png|jpg|webp))"/)
      const image = imgM ? imgM[1] : null

      // Title: <div class="news-article-card_title__...">TEXT</div>
      const titleM = inner.match(/news-article-card_title__[^"]*"[^>]*>([^<]+)/)
      const title = titleM ? titleM[1].trim() : ''
      // Skip empty titles or generic navigation links like "See more articles"
      if (!title || title.toLowerCase().includes('see more') || title.length < 4) continue

      // Date: <div class="news-article-card_date__...">TEXT</div>
      const dateM = inner.match(/news-article-card_date__[^"]*"[^>]*>([^<]+)/)
      const date = dateM ? dateM[1].trim() : ''

      // Category: data-text="Patch Notes"
      const catM = inner.match(/data-text="([^"]+)"/)
      const category = catM ? catM[1] : ''

      items.push({
        slug,
        href: `https://arcraiders.com/news/${slug}`,
        title,
        category,
        date,
        image,
      })

      if (items.length >= 12) break
    }

    return items
  } catch (e) {
    console.error('[news] fetch error:', e)
    return []
  }
}

/** Sanitize HTML: strip scripts, on* attrs, dangerous elements. Keep images/headings/lists/paragraphs. */
function sanitizeHtml(html: string): string {
  return html
    // Remove script/style/noscript blocks
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
    // Remove on* event handlers
    .replace(/\s+on\w+="[^"]*"/gi, '')
    // Remove data-* attributes (noisy)
    .replace(/\s+data-[a-z-]+"[^"]*"/gi, '')
    // Remove class attributes
    .replace(/\s+class="[^"]*"/gi, '')
    // Remove value attribute on <li> (arcraiders.com uses value="1" etc.)
    .replace(/(<li[^>]*)\s+value="\d+"([^>]*>)/gi, '$1$2')
    // Remove <nav>, <footer>, <header> blocks
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    // Remove empty tags
    .replace(/<(span|div|p)[^>]*>\s*<\/\1>/gi, '')
    // Normalize whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/** Extract article body from arcraiders.com article HTML */
function extractArticleBody(html: string): string {
  // Strategy 1: payload-richtext — the exact class arcraiders.com uses for article content
  const richTextIdx = html.indexOf('class="payload-richtext"')
  if (richTextIdx > -1) {
    // Find the opening > of this div
    const openEnd = html.indexOf('>', richTextIdx) + 1
    // Find the closing </div> that matches — track nesting depth
    let depth = 1
    let pos = openEnd
    while (pos < html.length && depth > 0) {
      const nextOpen = html.indexOf('<div', pos)
      const nextClose = html.indexOf('</div>', pos)
      if (nextClose === -1) break
      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++
        pos = nextOpen + 4
      } else {
        depth--
        pos = nextClose + 6
      }
    }
    const body = html.slice(openEnd, pos - 6)
    const cleaned = sanitizeHtml(body)
    if (cleaned.length > 100) return cleaned
  }

  // Strategy 2: article_article__ CSS module class (outer container)
  const articleDivIdx = html.search(/class="article_article__[^"]*"/)
  if (articleDivIdx > -1) {
    // Cut off at the "other articles" section
    const otherIdx = html.search(/news-article-page_otherArticlesContainer|More articles:|Related articles/i)
    const endIdx = otherIdx > articleDivIdx ? otherIdx : articleDivIdx + 30000
    const body = html.slice(articleDivIdx, endIdx)
    const cleaned = sanitizeHtml(body)
    if (cleaned.length > 100) return cleaned
  }

  // Strategy 3: find the <h1>, extract until "other articles" container
  const h1Idx = html.search(/<h1[\s>]/i)
  if (h1Idx > -1) {
    const afterH1 = html.indexOf('>', h1Idx) + 1
    const cutPatterns = [
      /news-article-page_otherArticlesContainer/,
      /class="[^"]*otherArticles[^"]*"/i,
      /<footer[\s>]/i,
    ]
    let endIdx = h1Idx + 30000
    for (const p of cutPatterns) {
      const idx = html.search(p)
      if (idx > afterH1 && idx < endIdx) endIdx = idx
    }
    const body = html.slice(h1Idx, endIdx)
    const cleaned = sanitizeHtml(body)
    if (cleaned.length > 100) return cleaned
  }

  return ''
}

export async function fetchArticleContent(slug: string): Promise<ArticleContent | null> {
  try {
    const res = await fetch(`https://arcraiders.com/news/${slug}`, {
      next: { revalidate: 300, tags: ['arc-news'] },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    })
    if (!res.ok) return null

    const html = await res.text()

    // Title: look for <h1>
    const titleM = html.match(/<h1[^>]*>([^<]+)<\/h1>/i)
    const title = titleM ? titleM[1].trim() : slug.replace(/-/g, ' ')

    // Hero image: first large storage.googleapis.com image
    const imageM =
      html.match(/src="(https:\/\/storage\.googleapis\.com\/[^"]+(?:1200x|1920x|960x|800x|hero)[^"]*)"/) ??
      html.match(/src="(https:\/\/storage\.googleapis\.com\/[^"]+\.(?:png|jpg|webp))"/)
    const image = imageM ? imageM[1] : null

    // Date: look for ISO date string or readable date near the top
    const dateM =
      html.match(/<time[^>]*datetime="([^"]+)"/) ??
      html.match(/news-article[^"]*date[^"]*"[^>]*>([^<]+)/) ??
      html.match(/(\w+ \d{1,2},\s*\d{4})/)
    const date = dateM ? dateM[1].trim() : ''

    // Category
    const catM = html.match(/data-text="([^"]+)"/)
    const category = catM ? catM[1] : ''

    let body = extractArticleBody(html)
    // Strip the first <h1> (page renders its own title)
    body = body.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, '').trim()
    // Strip the first image block (already shown as hero above the body)
    body = body.replace(/^(\s*<div[^>]*>\s*)?<img[^>]*\/>(\s*<\/div>)?/i, '').trim()

    return { title, date, category, image, html: body }
  } catch (e) {
    console.error('[news] article fetch error:', e)
    return null
  }
}
