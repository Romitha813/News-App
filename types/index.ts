export interface NewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

export interface ProcessedArticle extends NewsArticle {
  domain: string;
  reliabilityScore: number;
  isReliable: boolean;
}

export interface SearchResponse {
  reliable: ProcessedArticle[];
  unreliable: ProcessedArticle[];
  totalSources: number;
}
