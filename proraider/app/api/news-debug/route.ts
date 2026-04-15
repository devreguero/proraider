import { NextResponse } from 'next/server'

export async function GET() {
  const res = await fetch('https://arcraiders.com/news/patch-notes-1-24-0', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
    cache: 'no-store',
  })
  const html = await res.text()

  // Check for RSC payload scripts
  const rscScripts: string[] = []
  const rscRe = /<script[^>]*>\s*self\.__next_f\.push\(([\s\S]*?)\)\s*<\/script>/g
  let m: RegExpExecArray | null
  while ((m = rscRe.exec(html)) !== null) {
    rscScripts.push(m[1].slice(0, 300))
    if (rscScripts.length >= 5) break
  }

  // Check for regular paragraph content in HTML
  const paragraphs: string[] = []
  const pRe = /<p[^>]*>([^<]{20,})<\/p>/g
  while ((m = pRe.exec(html)) !== null) {
    paragraphs.push(m[1])
    if (paragraphs.length >= 10) break
  }

  // Check for list items
  const listItems: string[] = []
  const liRe = /<li[^>]*>([^<]{10,})<\/li>/g
  while ((m = liRe.exec(html)) !== null) {
    listItems.push(m[1])
    if (listItems.length >= 10) break
  }

  // Raw HTML around h1
  const h1Idx = html.search(/<h1[\s>]/i)
  const aroundH1 = h1Idx > -1 ? html.slice(h1Idx, h1Idx + 3000) : null

  return NextResponse.json({
    htmlLength: html.length,
    hasRscPayload: rscScripts.length > 0,
    rscScriptCount: rscScripts.length,
    rscSamples: rscScripts,
    paragraphs,
    listItems,
    aroundH1,
  })
}
