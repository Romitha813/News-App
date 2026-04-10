'use client';

import { useState } from 'react';
import NewsCard from '@/components/NewsCard';
import { ProcessedArticle } from '@/types';
import styles from './SearchResults.module.css';

export function ReliableList({ articles }: { articles: ProcessedArticle[] }) {
  if (articles.length === 0) return null;
  
  return (
    <div className={styles.reliableSection}>
      <h2 className={styles.sectionTitle}>
        ✅ Reliable Results <span className={styles.count}>({articles.length})</span>
      </h2>
      <div className={styles.grid}>
        {articles.map((article, idx) => (
          <NewsCard key={`rel-${idx}`} article={article} />
        ))}
      </div>
    </div>
  );
}

export function UnreliableDropdown({ articles }: { articles: ProcessedArticle[] }) {
  const [expanded, setExpanded] = useState(false);
  
  if (articles.length === 0) return null;

  return (
    <div className={styles.unreliableSection}>
      <button 
        className={styles.dropdownToggle} 
        onClick={() => setExpanded(!expanded)}
      >
        <span className={styles.warningIcon}>⚠️</span>
        <span className={styles.dropdownText}>
          Unreliable Sources Found ({articles.length}) - <em>Click to {expanded ? 'collapse' : 'expand'}</em>
        </span>
        <span className={`${styles.chevron} ${expanded ? styles.rotated : ''}`}>▼</span>
      </button>
      
      <div className={`${styles.dropdownContent} ${expanded ? styles.open : ''}`}>
        <div className={styles.grid}>
          {articles.map((article, idx) => (
            <NewsCard key={`unrel-${idx}`} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
}
