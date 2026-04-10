'use client';

import { useEffect, useState } from 'react';
import NewsCard from '@/components/NewsCard';
import { NewsArticle, ProcessedArticle } from '@/types';
import { getDomainReliability } from '@/lib/reliability';
import styles from './page.module.css';

export default function Home() {
  const [articles, setArticles] = useState<ProcessedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTopNews() {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GNEWS_API_KEY;
        if (!apiKey) throw new Error("Missing NEXT_PUBLIC_GNEWS_API_KEY in .env.local");

        const url = `https://gnews.io/api/v4/top-headlines?category=general&lang=en&max=10&apikey=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.errors) throw new Error(data.errors[0] || 'GNews API Error');
        if (data.articles) {
          const processed: ProcessedArticle[] = data.articles.map((article: NewsArticle) => {
            const sourceUrl = article.source.url;
            const parsedUrl = new URL(sourceUrl);
            const domain = parsedUrl.hostname.replace(/^www\./, '').toLowerCase();
            const reliabilityScore = getDomainReliability(domain);
            return {
              ...article,
              domain,
              reliabilityScore,
              isReliable: reliabilityScore >= 3.0
            };
          });
          setArticles(processed);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch latest news.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchTopNews();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <h1 className={styles.title}>Latest Famous News</h1>
        <p className={styles.subtitle}>
          Stay updated with the world&apos;s trending topics.
          Sources are graded for transparency.
        </p>
      </header>
      
      {loading && (
        <div className={styles.loaderContainer}>
          <div className={styles.loader}></div>
          <p>Analyzing sources...</p>
        </div>
      )}

      {error && !loading && (
        <div className={styles.errorCard}>
          <h3>⚠️ API Configuration Needed</h3>
          <p>{error}</p>
          <div className={styles.errorSub}>
            Please add your free GNews API key to the <pre className={styles.preCode}>.env.local</pre> file 
            and restart the development server.
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className={styles.grid}>
          {articles.map((article, idx) => (
            <NewsCard key={idx} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
