'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ProcessedArticle } from '@/types';
import styles from './NewsCard.module.css';

export default function NewsCard({ article }: { article: ProcessedArticle }) {
  const [expanded, setExpanded] = useState(false);
  const [fullText, setFullText] = useState<string | null>(null);
  const [isLoadingFull, setIsLoadingFull] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const handleExpand = async () => {
    if (!expanded && !fullText && !fetchError) {
      setIsLoadingFull(true);
      try {
        const res = await fetch(`/api/extract?url=${encodeURIComponent(article.url)}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        if (data.text) {
          setFullText(data.text);
        } else {
          throw new Error('No content returned from source');
        }
      } catch (err: any) {
        setFetchError('Failed to extract full article. ' + (err.message || ''));
      } finally {
        setIsLoadingFull(false);
      }
    }
    setExpanded(!expanded);
  };

  const isReliable = article.isReliable;
  const score = isReliable ? '✅ Reliable' : '⚠️ Unreliable';
  const badgeClass = isReliable ? styles.reliableBadge : styles.unreliableBadge;

  const date = new Date(article.publishedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <article className={`${styles.card} animate-fade-in`}>
      {article.image && (
        <div className={styles.imageContainer}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={article.image} 
            alt={article.title}
            className={styles.image}
            loading="lazy"
          />
        </div>
      )}
      
      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.domain}>{article.domain}</span>
          <span className={styles.dot}>•</span>
          <span className={styles.date}>{date}</span>
        </div>
        
        <h3 className={styles.title}>
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
        </h3>
        
        <div className={styles.contentWrapper}>
          <p className={styles.snippet}>{article.description}</p>
          
          {expanded && (
            <div className={`${styles.expandedContent} animate-fade-in`}>
              <strong>Full Web Article:</strong>
              {isLoadingFull && <p style={{fontStyle: 'italic'}}>Extracting content from source...</p>}
              {fetchError && <p style={{color: 'var(--unreliable-color)'}}>{fetchError}</p>}
              {fullText && (
                <div style={{ whiteSpace: 'pre-wrap', marginTop: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
                  {fullText}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className={styles.footer}>
          <span className={`${styles.badge} ${badgeClass}`}>
            {score} {(article.reliabilityScore).toFixed(1)}
          </span>
          
          <div className={styles.actions}>
            <button 
              className={styles.actionButton} 
              onClick={() => {
                const textToDownload = fullText || article.content;
                const md = `# ${article.title}\n\n**Source:** ${article.domain} | **Score:** ${article.reliabilityScore.toFixed(1)}\n**Date:** ${date}\n\n${textToDownload}\n\n[Original Article](${article.url})`;
                const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${article.domain}_article.md`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
            >
              ↓ .MD
            </button>

            <button 
              className={styles.actionButton}
              onClick={handleExpand}
            >
              {expanded ? '▲ Less' : '▼ Read Full'}
            </button>
            
            <a href={article.url} target="_blank" rel="noopener noreferrer" className={styles.readMore}>
              Original →
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
