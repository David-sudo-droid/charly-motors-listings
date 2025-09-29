import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, X, Eye, Trash2 } from "lucide-react";
import { useComparison } from "@/hooks/useComparison";

const ComparisonBar = () => {
  const { 
    comparisonItems, 
    removeFromComparison, 
    clearComparison, 
    openComparison, 
    count,
    maxItems 
  } = useComparison();

  if (count === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[9999] animate-in slide-in-from-bottom-2" style={{zIndex: 9999}}>
      <Card className="shadow-2xl border-2 border-primary/20 bg-background/95 backdrop-blur-sm max-w-4xl">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                <Scale className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-sm">Compare Listings</div>
                <div className="text-xs text-muted-foreground">
                  {count} of {maxItems} items selected
                </div>
              </div>
            </div>

            {/* Items preview */}
            <div className="flex items-center gap-2">
              {comparisonItems.slice(0, 3).map((item) => (
                <div 
                  key={item.id} 
                  className="relative group"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-border bg-muted">
                    {item.images[0] ? (
                      <img 
                        src={item.images[0]} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Scale className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <button
                      onClick={() => removeFromComparison(item.id)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
              {count > 3 && (
                <Badge variant="secondary" className="ml-1">
                  +{count - 3}
                </Badge>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              {count >= 2 && (
                <Button 
                  onClick={openComparison}
                  size="sm"
                  className="h-9"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Compare
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearComparison}
                className="h-9"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 rounded-full"
                style={{ width: `${(count / maxItems) * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {count}/{maxItems}
            </span>
          </div>
          
          {count < 2 && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Add at least 2 items to compare
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparisonBar;
