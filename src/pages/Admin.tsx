import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Edit, Trash2, Car, Home, Shield } from 'lucide-react';
import Header from '@/components/Header';

interface Listing {
  id: string;
  title: string;
  price: number;
  type: 'car' | 'property';
  location: string;
  images: string[];
  description: string;
  whatsapp_number: string;
  featured: boolean;
  created_at: string;
}

const Admin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loadingListings, setLoadingListings] = useState(false);
  
  // New listing form state
  const [newListing, setNewListing] = useState({
    title: '',
    price: '',
    type: 'car' as 'car' | 'property',
    location: '',
    description: '',
    whatsapp_number: '',
    images: [''],
    featured: false
  });

  // Check admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc('get_current_user_admin_status');
        setIsAdmin(!error && data === true);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  // Fetch listings
  const fetchListings = async () => {
    setLoadingListings(true);
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings((data || []).map(item => ({
        ...item,
        type: item.type as 'car' | 'property'
      })));
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch listings",
        variant: "destructive"
      });
    } finally {
      setLoadingListings(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchListings();
    }
  }, [isAdmin]);

  // Add new listing
  const handleAddListing = async () => {
    if (!newListing.title || !newListing.price || !newListing.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase.from('listings').insert({
        title: newListing.title,
        price: parseFloat(newListing.price),
        type: newListing.type,
        location: newListing.location,
        description: newListing.description,
        whatsapp_number: newListing.whatsapp_number,
        images: newListing.images.filter(img => img.trim() !== ''),
        featured: newListing.featured,
        currency: 'KES'
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Listing added successfully"
      });

      // Reset form
      setNewListing({
        title: '',
        price: '',
        type: 'car',
        location: '',
        description: '',
        whatsapp_number: '',
        images: [''],
        featured: false
      });

      // Refresh listings
      fetchListings();
    } catch (error) {
      console.error('Error adding listing:', error);
      toast({
        title: "Error",
        description: "Failed to add listing",
        variant: "destructive"
      });
    }
  };

  // Delete listing
  const handleDeleteListing = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Listing deleted successfully"
      });

      fetchListings();
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast({
        title: "Error",
        description: "Failed to delete listing",
        variant: "destructive"
      });
    }
  };

  // Toggle featured status
  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ featured: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Listing ${!currentStatus ? 'featured' : 'unfeatured'} successfully`
      });

      fetchListings();
    } catch (error) {
      console.error('Error updating listing:', error);
      toast({
        title: "Error",
        description: "Failed to update listing",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>Please sign in to access the admin panel</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => window.location.href = '/auth'}>
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Admin Access Required
              </CardTitle>
              <CardDescription>You don't have permission to access this area</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => window.location.href = '/'}>
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Manage your listings and content</p>
        </div>

        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="listings">Manage Listings</TabsTrigger>
            <TabsTrigger value="add">Add New Listing</TabsTrigger>
          </TabsList>

          {/* Manage Listings Tab */}
          <TabsContent value="listings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">All Listings</h2>
              <Button onClick={fetchListings} disabled={loadingListings}>
                {loadingListings && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Refresh
              </Button>
            </div>

            {loadingListings ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="grid gap-4">
                {listings.map((listing) => (
                  <Card key={listing.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {listing.type === 'car' ? (
                              <Car className="h-4 w-4" />
                            ) : (
                              <Home className="h-4 w-4" />
                            )}
                            <h3 className="font-semibold">{listing.title}</h3>
                            {listing.featured && (
                              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            KSH {listing.price.toLocaleString()} • {listing.location}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {listing.description}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleFeatured(listing.id, listing.featured)}
                          >
                            {listing.featured ? 'Unfeature' : 'Feature'}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteListing(listing.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Add New Listing Tab */}
          <TabsContent value="add" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Listing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title *</label>
                    <Input
                      value={newListing.title}
                      onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                      placeholder="Enter listing title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price (KSH) *</label>
                    <Input
                      type="number"
                      value={newListing.price}
                      onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                      placeholder="Enter price"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Type *</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={newListing.type}
                      onChange={(e) => setNewListing({ ...newListing, type: e.target.value as 'car' | 'property' })}
                    >
                      <option value="car">Car</option>
                      <option value="property">Property</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Location *</label>
                    <Input
                      value={newListing.location}
                      onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                      placeholder="Enter location"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">WhatsApp Number</label>
                    <Input
                      value={newListing.whatsapp_number}
                      onChange={(e) => setNewListing({ ...newListing, whatsapp_number: e.target.value })}
                      placeholder="+254712345678"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newListing.featured}
                        onChange={(e) => setNewListing({ ...newListing, featured: e.target.checked })}
                      />
                      <span className="text-sm font-medium">Featured Listing</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    className="w-full p-2 border rounded-md h-20"
                    value={newListing.description}
                    onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                    placeholder="Enter description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <Input
                    value={newListing.images[0]}
                    onChange={(e) => setNewListing({ ...newListing, images: [e.target.value] })}
                    placeholder="Enter image URL"
                  />
                </div>

                <Button onClick={handleAddListing} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Listing
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
