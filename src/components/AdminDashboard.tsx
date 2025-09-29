import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Car, 
  Home, 
  Eye, 
  MessageCircle, 
  TrendingUp, 
  Users,
  Star,
  Calendar,
  DollarSign,
  Activity
} from 'lucide-react';
import { getListingAnalytics, getTotalUsersCount } from '@/lib/supabase-helpers';

interface DashboardStats {
  totalListings: number;
  carsCount: number;
  propertiesCount: number;
  featuredCount: number;
  totalViews: number;
  totalInquiries: number;
  totalUsers: number;
  recentListings: number;
}

interface PopularListing {
  id: string;
  title: string;
  type: 'car' | 'property';
  view_count: number;
  inquiry_count: number;
  price: number;
  currency: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [popularListings, setPopularListings] = useState<PopularListing[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch basic stats
      const [listingsResult, analytics, totalUsers] = await Promise.all([
        supabase.from('listings').select('*'),
        getListingAnalytics(),
        getTotalUsersCount()
      ]);

      if (listingsResult.error) throw listingsResult.error;

      const listings = listingsResult.data || [];

      // Calculate stats from analytics
      const totalViews = analytics.reduce((sum: number, item: any) => sum + (item.view_count || 0), 0);
      const totalInquiries = analytics.reduce((sum: number, item: any) => sum + (item.inquiry_count || 0), 0);
      
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const recentListings = listings.filter(listing => 
        new Date(listing.created_at) > oneWeekAgo
      ).length;

      setStats({
        totalListings: listings.length,
        carsCount: listings.filter(l => l.type === 'car').length,
        propertiesCount: listings.filter(l => l.type === 'property').length,
        featuredCount: listings.filter(l => l.featured).length,
        totalViews,
        totalInquiries,
        totalUsers: totalUsers,
        recentListings
      });

      // Get popular listings with analytics
      const popularListingsQuery = await supabase
        .from('listings')
        .select('id, title, type, price, currency')
        .order('created_at', { ascending: false })
        .limit(5);

      if (popularListingsQuery.data) {
        const popularData = popularListingsQuery.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          type: item.type,
          price: item.price,
          currency: item.currency,
          view_count: analytics.find((a: any) => a.listing_id === item.id)?.view_count || 0,
          inquiry_count: analytics.find((a: any) => a.listing_id === item.id)?.inquiry_count || 0,
        }));
        setPopularListings(popularData);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    change, 
    loading 
  }: { 
    title: string; 
    value: string | number; 
    icon: any; 
    change?: string; 
    loading?: boolean; 
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {change && (
              <p className="text-xs text-muted-foreground mt-1">
                {change}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <StatCard 
              key={i}
              title="Loading..."
              value=""
              icon={Activity}
              loading={true}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Listings"
          value={stats?.totalListings || 0}
          icon={Activity}
          change={`+${stats?.recentListings || 0} this week`}
        />
        
        <StatCard
          title="Cars"
          value={stats?.carsCount || 0}
          icon={Car}
          change={`${Math.round(((stats?.carsCount || 0) / (stats?.totalListings || 1)) * 100)}% of total`}
        />
        
        <StatCard
          title="Properties"
          value={stats?.propertiesCount || 0}
          icon={Home}
          change={`${Math.round(((stats?.propertiesCount || 0) / (stats?.totalListings || 1)) * 100)}% of total`}
        />
        
        <StatCard
          title="Featured Listings"
          value={stats?.featuredCount || 0}
          icon={Star}
          change={`${Math.round(((stats?.featuredCount || 0) / (stats?.totalListings || 1)) * 100)}% featured`}
        />
        
        <StatCard
          title="Total Views"
          value={formatNumber(stats?.totalViews || 0)}
          icon={Eye}
          change="All time views"
        />
        
        <StatCard
          title="Total Inquiries"
          value={formatNumber(stats?.totalInquiries || 0)}
          icon={MessageCircle}
          change="WhatsApp contacts"
        />
        
        <StatCard
          title="Registered Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          change="Total platform users"
        />
        
        <StatCard
          title="Conversion Rate"
          value={`${stats?.totalViews && stats?.totalInquiries ? 
            Math.round((stats.totalInquiries / stats.totalViews) * 100) : 0}%`}
          icon={TrendingUp}
          change="Inquiries per view"
        />
      </div>

      {/* Popular Listings */}
      {popularListings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Most Popular Listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularListings.map((listing, index) => (
                <div key={listing.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium line-clamp-1">{listing.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {listing.type === 'car' ? (
                          <Car className="h-3 w-3" />
                        ) : (
                          <Home className="h-3 w-3" />
                        )}
                        <span className="capitalize">{listing.type}</span>
                        <span>•</span>
                        <span>{listing.currency} {listing.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3 text-muted-foreground" />
                      <span>{listing.view_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3 text-muted-foreground" />
                      <span>{listing.inquiry_count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Recent Activity</h4>
              <p className="text-sm text-muted-foreground">
                {stats?.recentListings || 0} new listings added this week
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Performance</h4>
              <p className="text-sm text-muted-foreground">
                {stats?.totalViews ? Math.round(stats.totalViews / (stats.totalListings || 1)) : 0} average views per listing
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Engagement</h4>
              <p className="text-sm text-muted-foreground">
                {stats?.totalInquiries ? Math.round(stats.totalInquiries / (stats.totalListings || 1)) : 0} average inquiries per listing
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
