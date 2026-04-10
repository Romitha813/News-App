// Reliability mock database and scoring logic

export const reliabilityScores: Record<string, number> = {
  // Reliable
  "reuters.com": 4.8,
  "apnews.com": 4.8,
  "bbc.com": 4.5,
  "bbc.co.uk": 4.5,
  "npr.org": 4.6,
  "nytimes.com": 4.0,
  "wsj.com": 4.0,
  "theguardian.com": 3.9,
  "washingtonpost.com": 3.9,
  "bloomberg.com": 4.2,
  "ft.com": 4.3,

  // Mixed/Opinion
  "buzzfeed.com": 2.8,
  "buzzfeednews.com": 3.2,
  "huffpost.com": 2.8,
  "foxnews.com": 2.5,
  "cnn.com": 3.5,

  // Unreliable
  "breitbart.com": 1.5,
  "infowars.com": 1.0,
  "naturalnews.com": 1.0,
  "thegatewaypundit.com": 1.1,

  // Satire
  "theonion.com": 0,
  "babylonbee.com": 0,
};

export function getDomainReliability(url: string | null): number {
  if (!url) return 2.5; // Default unknown

  try {
    let domainPattern = url;
    // Extract base domain
    if (url.startsWith('http')) {
      const parsed = new URL(url);
      domainPattern = parsed.hostname;
    }

    // Strip www.
    domainPattern = domainPattern.replace(/^www\./, '').toLowerCase();

    // Direct match
    if (reliabilityScores[domainPattern] !== undefined) {
      return reliabilityScores[domainPattern];
    }

    // Attempt partial match (e.g., matching en.wikipedia.org to wikipedia.org)
    const domainParts = domainPattern.split('.');
    if (domainParts.length > 2) {
      const rootDomain = domainParts.slice(-2).join('.');
      if (reliabilityScores[rootDomain] !== undefined) {
        return reliabilityScores[rootDomain];
      }
    }

    // Default for unknown sources
    return 2.5; 
  } catch (e) {
    return 2.5;
  }
}
