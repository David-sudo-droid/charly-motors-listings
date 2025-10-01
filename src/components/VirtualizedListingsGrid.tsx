import React, { useState, useMemo, useCallback } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import ListingCard from './ListingCard';
import { type Listing } from '@/hooks/useListings';
import { useWindowSize } from '@/hooks/useWindowSize';

interface VirtualizedListingsGridProps {
  listings: Listing[];
  onViewDetails: (listing: Listing) => void;
}

// Custom hook for window size (create if doesn't exist)
const useWindowSizeHook = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  React.useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

interface GridCellProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: {
    listings: Listing[];
    columnsCount: number;
    onViewDetails: (listing: Listing) => void;
  };
}

const GridCell = React.memo(({ columnIndex, rowIndex, style, data }: GridCellProps) => {
  const { listings, columnsCount, onViewDetails } = data;
  const listingIndex = rowIndex * columnsCount + columnIndex;
  const listing = listings[listingIndex];

  if (!listing) {
    return <div style={style} />;
  }

  return (
    <div style={style}>
      <div style={{ padding: '8px' }}>
        <ListingCard listing={listing} onViewDetails={onViewDetails} />
      </div>
    </div>
  );
});

GridCell.displayName = 'GridCell';

const VirtualizedListingsGrid = ({ listings, onViewDetails }: VirtualizedListingsGridProps) => {
  const windowSize = useWindowSizeHook();
  
  // Calculate grid dimensions based on screen size
  const { columnsCount, cardWidth, cardHeight } = useMemo(() => {
    const padding = 32; // Container padding
    const gap = 16; // Gap between cards
    const availableWidth = windowSize.width - padding;
    
    let columns: number;
    let width: number;
    
    if (windowSize.width >= 1024) {
      // Desktop: 3 columns
      columns = 3;
      width = (availableWidth - gap * (columns - 1)) / columns;
    } else if (windowSize.width >= 768) {
      // Tablet: 2 columns
      columns = 2;
      width = (availableWidth - gap * (columns - 1)) / columns;
    } else {
      // Mobile: 1 column
      columns = 1;
      width = availableWidth;
    }
    
    return {
      columnsCount: columns,
      cardWidth: Math.max(width, 280), // Minimum card width
      cardHeight: 420, // Fixed card height for better performance
    };
  }, [windowSize.width]);

  const rowsCount = Math.ceil(listings.length / columnsCount);
  const gridHeight = Math.min(windowSize.height - 200, rowsCount * cardHeight); // Max height with some buffer

  const itemData = useMemo(() => ({
    listings,
    columnsCount,
    onViewDetails,
  }), [listings, columnsCount, onViewDetails]);

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl text-muted-foreground mb-4">🔍</div>
        <h3 className="text-xl font-semibold mb-2">No listings found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Grid
        columnCount={columnsCount}
        columnWidth={cardWidth + 16} // Add gap
        height={gridHeight}
        rowCount={rowsCount}
        rowHeight={cardHeight + 16} // Add gap
        itemData={itemData}
        overscanRowCount={1} // Pre-render 1 row above/below viewport
        overscanColumnCount={0}
        width="100%"
      >
        {GridCell}
      </Grid>
    </div>
  );
};

export default VirtualizedListingsGrid;
