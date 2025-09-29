import { useComparison } from "@/hooks/useComparison";
import { Badge } from "@/components/ui/badge";

const ComparisonDebug = () => {
  const { comparisonItems, count } = useComparison();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] bg-red-500 text-white p-2 rounded">
      <div>Comparison Debug:</div>
      <div>Count: {count}</div>
      <div>Items: {comparisonItems.map(item => item.title).join(', ')}</div>
    </div>
  );
};

export default ComparisonDebug;
