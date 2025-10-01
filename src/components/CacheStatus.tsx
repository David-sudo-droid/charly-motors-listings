import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  Trash2, 
  Database, 
  Clock, 
  HardDrive,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useCacheManager } from '@/hooks/useCacheManager';

interface CacheStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const CacheStatus: React.FC<CacheStatusProps> = ({ 
  className = '', 
  showDetails = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    clearAllCache,
    clearExpiredCache,
    refreshListings,
    getCacheStats,
    isCached,
  } = useCacheManager();

  const stats = getCacheStats();
  const hasFeaturedCache = isCached('featured');
  const hasAllListingsCache = isCached('all');

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await refreshListings();
      // Small delay to show the refresh action
      setTimeout(() => setIsLoading(false), 500);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleClearCache = () => {
    clearAllCache();
    // Force a small delay to show the action completed
    setTimeout(() => window.location.reload(), 100);
  };

  if (!showDetails && !stats.hasCache) {
    return null;
  }

  return (
    <div className={`bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">Cache Status</span>
          {stats.hasCache && (
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
              Active
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {stats.hasCache && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="h-7 px-2 text-xs"
              >
                <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearCache}
                className="h-7 px-2 text-xs text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </>
          )}
          
          {showDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-7 px-2"
            >
              {isExpanded ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Quick Status Indicators */}
      <div className="flex items-center gap-2 mt-2">
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${hasFeaturedCache ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span className="text-xs text-gray-600">Featured</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${hasAllListingsCache ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span className="text-xs text-gray-600">Listings</span>
        </div>
        {stats.hasCache && (
          <div className="flex items-center gap-1 ml-auto">
            <HardDrive className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-500">{stats.formattedSize}</span>
          </div>
        )}
      </div>

      {/* Expanded Details */}
      {isExpanded && showDetails && (
        <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-500">Total Entries:</span>
              <span className="ml-1 font-medium">{stats.totalEntries}</span>
            </div>
            <div>
              <span className="text-gray-500">Cache Size:</span>
              <span className="ml-1 font-medium">{stats.formattedSize}</span>
            </div>
          </div>
          
          {stats.oldestEntry && (
            <div className="text-xs">
              <span className="text-gray-500">Oldest Entry:</span>
              <div className="text-gray-700 font-mono text-xs mt-1">
                {stats.oldestEntry}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearExpiredCache}
              className="h-7 text-xs flex-1"
            >
              <Clock className="h-3 w-3 mr-1" />
              Clear Expired
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCache}
              className="h-7 text-xs flex-1 text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CacheStatus;
