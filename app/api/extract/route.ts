import { NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'URL parameter is required.' }, { status: 400 });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.status}`);
    }

    const html = await response.text();
    const doc = new JSDOM(html, { url: targetUrl });
    const reader = new Readability(doc.window.document);
    const article = reader.parse();

    if (!article) {
      return NextResponse.json({ text: null, error: 'Could not extract article content.' });
    }

    return NextResponse.json({
      title: article.title,
      text: article.textContent,
      length: article.length
    });
  } catch (error: any) {
    console.error('Error extracting article:', error);
    return NextResponse.json({ error: error.message || 'Failed to extract content' }, { status: 500 });
  }
}
