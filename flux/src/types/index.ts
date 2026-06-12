/**
 * Unified Article type representing a single item from an RSS/Atom feed.
 */
export interface Article {
  id: string; // Deterministic hash of link/title for deduplication
  title: string;
  excerpt: string;
  content?: string;
  author?: string;
  publishedAt: Date;
  sourceFeedId: string;
  url: string;
  thumbnailUrl?: string;
  isRead: boolean;
  isBookmarked: boolean;
}

/**
 * Feed metadata representing a subscription.
 */
export interface Feed {
  id: string;
  url: string;
  title: string;
  category: string;
  iconUrl?: string;
  lastFetchedAt: Date;
  status: 'healthy' | 'stale' | 'error';
}

/**
 * User preference settings for the Flux experience.
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  layout: 'list' | 'grid' | 'compact';
  refreshInterval: number; // in minutes
}
