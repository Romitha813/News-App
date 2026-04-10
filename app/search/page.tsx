'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { NewsArticle, ProcessedArticle, SearchResponse } from '@/types';
import { ReliableList, UnreliableDropdown } from '@/components/SearchResults';
import { downloadAsMarkdown, downloadAsPDF } from '@/lib/export';
import { getDomainReliability } from '@/lib/reliability';
import styles from './page.module.css';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    async function doSearch() {
      setLoading(true);
      setError('');
      try {
        const apiKey = process.env.NEXT_PUBLIC_GNEWS_API_KEY;
        if (!apiKey) throw new Error("Missing NEXT_PUBLIC_GNEWS_API_KEY in .env.local");

        const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query!)}&lang=en&max=20&apikey=${apiKey}`;
        const res = await fetch(url);
        const dataJson = await res.json();
        
        if (dataJson.errors) throw new Error(dataJson.errors[0] || 'GNews API Error');
        
        const articles: NewsArticle[] = dataJson.articles || [];
        const reliable: ProcessedArticle[] = [];
        const unreliable: ProcessedArticle[] = [];

        articles.forEach(article => {
          let domain = "unknown.com";
          try {
            const sourceUrl = article.source.url;
            const parsedUrl = new URL(sourceUrl);
            domain = parsedUrl.hostname.replace(/^www\./, '').toLowerCase();
          } catch (e) {
            domain = article.source.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
          }
          
          const reliabilityScore = getDomainReliability(domain);
          const isReliable = reliabilityScore >= 3.0;

          const processedArticle: ProcessedArticle = {
            ...article,
            domain,
            reliabilityScore,
            isReliable
          };

          if (isReliable) {
            reliable.push(processedArticle);
          } else {
            unreliable.push(processedArticle);
          }
        });

        setData({
          reliable,
          unreliable,
          totalSources: articles.length
        });
      } catch (err: any) {
        setError(err.message || 'Error executing search.');
      } finally {
        setLoading(false);
      }
    }
    
    doSearch();
  }, [query]);

  if (!query) {
    return <div className={styles.container}>Please enter a search term above.</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            Results for <span className={styles.highlight}>&quot;{query}&quot;</span>
          </h1>
          <p className={styles.subtitle}>
            Analyzed {data?.totalSources || 0} sources across the internet
          </p>
        </div>
        
        {data && data.totalSources > 0 && (
          <div className={styles.actions}>
            <button 
              className={`${styles.button} ${styles.mdButton}`}
              onClick={() => downloadAsMarkdown(query, data)}
            >
              ↓ Download .MD
            </button>
            <button 
              className={`${styles.button} ${styles.pdfButton}`}
              onClick={downloadAsPDF}
            >
              ↓ Download .PDF
            </button>
          </div>
        )}
      </header>

      {loading && (
        <div className={styles.loaderContainer}>
          <div className={styles.loader}></div>
          <p>Scouring the web and analyzing reliability...</p>
        </div>
      )}

      {error && !loading && (
        <div className={styles.errorCard}>
          <h3>⚠️ API Configuration Needed</h3>
          <p>{error}</p>
          <div className={styles.errorSub}>
            Please add your free GNews API key to the <pre className={styles.preCode}>.env.local</pre> file.
          </div>
        </div>
      )}

      {!loading && !error && data && (
        <>
          <ReliableList articles={data.reliable} />
          <UnreliableDropdown articles={data.unreliable} />
          
          {data.totalSources === 0 && (
            <div className={styles.noResults}>
              <span className={styles.emptyIcon}>🔍</span>
              <p>No news found for &quot;{query}&quot;.</p>
              <p>Try using different keywords or simpler terms.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className={styles.container}>
        <div className={styles.loaderContainer}>
          <div className={styles.loader}></div>
        </div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
