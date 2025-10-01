interface CacheData<T> {
  data: T;
  timestamp: number;
  version: string;
}

interface CacheEntry {
  key: string;
  data: any;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

export class ListingsCache {
  private static readonly CACHE_PREFIX = 'charly_listings_';
  private static readonly CACHE_VERSION = '1.0.0';
  private static readonly DEFAULT_TTL = 30 * 60 * 1000; // 30 minutes
  private static readonly MAX_CACHE_SIZE = 50; // Maximum number of cache entries

  // Cache keys
  static readonly KEYS = {
    FEATURED_LISTINGS: 'featured_listings',
    ALL_LISTINGS: 'all_listings',
    LISTING_DETAILS: 'listing_details_',
    LISTINGS_METADATA: 'listings_metadata',
  } as const;

  /**
   * Store data in localStorage with timestamp and TTL
   */
  static set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    try {
      const cacheEntry: CacheEntry = {
        key,
        data,
        timestamp: Date.now(),
        ttl,
      };

      const cacheData: CacheData<CacheEntry> = {
        data: cacheEntry,
        timestamp: Date.now(),
        version: this.CACHE_VERSION,
      };

      localStorage.setItem(
        `${this.CACHE_PREFIX}${key}`,
        JSON.stringify(cacheData)
      );

      // Clean up old entries to prevent localStorage bloat
      this.cleanupOldEntries();
    } catch (error) {
      console.warn('Failed to cache data:', error);
      // If localStorage is full, try to clear some space
      this.clearExpiredEntries();
    }
  }

  /**
   * Get data from localStorage with expiration check
   */
  static get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(`${this.CACHE_PREFIX}${key}`);
      if (!item) return null;

      const cacheData: CacheData<CacheEntry> = JSON.parse(item);
      
      // Check version compatibility
      if (cacheData.version !== this.CACHE_VERSION) {
        this.remove(key);
        return null;
      }

      const { data: cacheEntry } = cacheData;
      const now = Date.now();

      // Check if cache entry has expired
      if (now - cacheEntry.timestamp > cacheEntry.ttl) {
        this.remove(key);
        return null;
      }

      return cacheEntry.data as T;
    } catch (error) {
      console.warn('Failed to retrieve cached data:', error);
      this.remove(key);
      return null;
    }
  }

  /**
   * Remove specific cache entry
   */
  static remove(key: string): void {
    try {
      localStorage.removeItem(`${this.CACHE_PREFIX}${key}`);
    } catch (error) {
      console.warn('Failed to remove cache entry:', error);
    }
  }

  /**
   * Check if data exists and is valid
   */
  static has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Clear all cache entries
   */
  static clear(): void {
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.CACHE_PREFIX)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  /**
   * Clear only expired entries
   */
  static clearExpiredEntries(): void {
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.CACHE_PREFIX)) {
          const cacheKey = key.replace(this.CACHE_PREFIX, '');
          if (!this.has(cacheKey)) {
            keysToRemove.push(key);
          }
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.warn('Failed to clear expired entries:', error);
    }
  }

  /**
   * Clean up old entries if we exceed max cache size
   */
  private static cleanupOldEntries(): void {
    try {
      const cacheEntries: Array<{ key: string; timestamp: number }> = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.CACHE_PREFIX)) {
          try {
            const item = localStorage.getItem(key);
            if (item) {
              const cacheData: CacheData<CacheEntry> = JSON.parse(item);
              cacheEntries.push({
                key,
                timestamp: cacheData.data.timestamp,
              });
            }
          } catch {
            // Remove corrupted entries
            localStorage.removeItem(key);
          }
        }
      }

      // If we exceed max cache size, remove oldest entries
      if (cacheEntries.length > this.MAX_CACHE_SIZE) {
        cacheEntries
          .sort((a, b) => a.timestamp - b.timestamp)
          .slice(0, cacheEntries.length - this.MAX_CACHE_SIZE)
          .forEach(entry => localStorage.removeItem(entry.key));
      }
    } catch (error) {
      console.warn('Failed to cleanup old entries:', error);
    }
  }

  /**
   * Get cache statistics
   */
  static getStats(): {
    totalEntries: number;
    totalSize: number;
    oldestEntry: number | null;
    newestEntry: number | null;
  } {
    let totalEntries = 0;
    let totalSize = 0;
    let oldestEntry: number | null = null;
    let newestEntry: number | null = null;

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.CACHE_PREFIX)) {
          const item = localStorage.getItem(key);
          if (item) {
            totalEntries++;
            totalSize += item.length;

            try {
              const cacheData: CacheData<CacheEntry> = JSON.parse(item);
              const timestamp = cacheData.data.timestamp;
              
              if (oldestEntry === null || timestamp < oldestEntry) {
                oldestEntry = timestamp;
              }
              if (newestEntry === null || timestamp > newestEntry) {
                newestEntry = timestamp;
              }
            } catch {
              // Skip corrupted entries
            }
          }
        }
      }
    } catch (error) {
      console.warn('Failed to get cache stats:', error);
    }

    return { totalEntries, totalSize, oldestEntry, newestEntry };
  }

  /**
   * Cache listings with smart deduplication
   */
  static cacheListings(key: string, listings: any[], ttl?: number): void {
    if (!listings || listings.length === 0) return;

    // Remove duplicates and ensure data quality
    const uniqueListings = listings.filter((listing, index, arr) => 
      listing && listing.id && arr.findIndex(l => l.id === listing.id) === index
    );

    this.set(key, uniqueListings, ttl);
  }

  /**
   * Get cached listings with fallback
   */
  static getCachedListings(key: string): any[] | null {
    const cached = this.get<any[]>(key);
    return cached && Array.isArray(cached) ? cached : null;
  }

  /**
   * Cache individual listing details
   */
  static cacheListingDetails(listingId: string, details: any, ttl?: number): void {
    if (!details || !listingId) return;
    this.set(`${this.KEYS.LISTING_DETAILS}${listingId}`, details, ttl);
  }

  /**
   * Get cached listing details
   */
  static getCachedListingDetails(listingId: string): any | null {
    return this.get(`${this.KEYS.LISTING_DETAILS}${listingId}`);
  }
}

export default ListingsCache;
