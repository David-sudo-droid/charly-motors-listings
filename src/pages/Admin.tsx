import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Edit, Trash2, Car, Home, Upload, AlertCircle, ArrowLeft, Star, Eye, Calendar, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import ImageUpload from '@/components/ImageUpload';
import LocalImageUpload from '@/components/LocalImageUpload';

interface Listing {
  id: string;
  type: 'car' | 'property';
  title: string;
  price: number;
  currency: string;
  location: string;
  images: string[];
  description: string | null;
  features: string[];
  specifications: any;
  whatsapp_number: string;
  featured: boolean;
  created_at: string;
}

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  
  // Check admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const { data, error } = await supabase.rpc('get_current_user_admin_status');
        if (error || !data) {
          navigate('/');
          toast({
            title: "Access Denied",
            description: "You don't have admin privileges.",
            variant: "destructive"
          });
        } else {
          setIsAdmin(true);
        }
      } else if (!authLoading) {
        navigate('/auth?redirect=admin');
      }
    };

    checkAdminStatus();
  }, [user, navigate, toast, authLoading]);
  
  // Form state
  const [formData, setFormData] = useState({
    type: 'car' as 'car' | 'property',
    title: '',
    price: '',
    location: '',
    images: [] as string[],
    description: '',
    features: '',
    specifications: '',
    whatsapp_number: '',
    featured: false,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchListings();
    }
  }, [user]);

  const fetchListings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch listings",
        variant: "destructive",
      });
    } else {
      setListings((data as Listing[]) || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      type: 'car',
      title: '',
      price: '',
      location: '',
      images: [],
      description: '',
      features: '',
      specifications: '',
      whatsapp_number: '',
      featured: false,
    });
    setEditingListing(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast({
        title: "Validation Error",
        description: "Price must be a positive number",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (!formData.whatsapp_number.trim()) {
      toast({
        title: "Validation Error",
        description: "WhatsApp number is required",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Validate JSON specifications
    let specifications = {};
    if (formData.specifications.trim()) {
      try {
        specifications = JSON.parse(formData.specifications);
      } catch (error) {
        toast({
          title: "Validation Error",
          description: "Specifications must be valid JSON format",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
    }

    const listingData = {
      type: formData.type,
      title: formData.title.trim(),
      price: parseFloat(formData.price),
      location: formData.location.trim(),
      images: formData.images,
      description: formData.description.trim() || null,
      features: formData.features ? formData.features.split(',').map(f => f.trim()).filter(f => f) : [],
      specifications,
      whatsapp_number: formData.whatsapp_number.trim(),
      featured: formData.featured,
      created_by: user?.id,
    };

    let error;
    if (editingListing) {
      const { error: updateError } = await supabase
        .from('listings')
        .update(listingData)
        .eq('id', editingListing.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('listings')
        .insert([listingData]);
      error = insertError;
    }

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Listing ${editingListing ? 'updated' : 'created'} successfully!`,
      });
      resetForm();
      fetchListings();
    }
    setLoading(false);
  };

  const handleEdit = (listing: Listing) => {
    setFormData({
      type: listing.type,
      title: listing.title,
      price: listing.price.toString(),
      location: listing.location,
      images: listing.images,
      description: listing.description || '',
      features: listing.features.join(', '),
      specifications: JSON.stringify(listing.specifications),
      whatsapp_number: listing.whatsapp_number,
      featured: listing.featured,
    });
    setEditingListing(listing);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Listing deleted successfully!",
      });
      fetchListings();
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5">
      <div className="max-w-7xl mx-auto p-4">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link 
              to="/" 
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-200 bg-background/50 backdrop-blur-sm px-4 py-2 rounded-full border hover:border-primary/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="px-4 py-2 bg-primary/10 border-primary/20">
                <Car className="w-4 h-4 mr-2" />
                Admin Access
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Eye className="w-4 h-4 mr-2" />
                {listings.length} Listings
              </Badge>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Manage your premium automotive and property listings with our advanced admin tools
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-200/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Listings</p>
                    <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">{listings.length}</p>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-full">
                    <Car className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-200/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Featured</p>
                    <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                      {listings.filter(l => l.featured).length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-500/20 rounded-full">
                    <Star className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-purple-200/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Properties</p>
                    <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                      {listings.filter(l => l.type === 'property').length}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-500/20 rounded-full">
                    <Home className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Alert className="mb-6 bg-primary/5 border-primary/20">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              <strong className="text-primary">Pro Tip:</strong> Upload high-quality images directly from your device. 
              Our system automatically optimizes and hosts them for you. Support for drag & drop, multiple selection, and instant preview.
            </AlertDescription>
          </Alert>
        </div>

        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-background/50 backdrop-blur-sm border border-border/50">
            <TabsTrigger value="create" className="flex items-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              {editingListing ? 'Edit' : 'Create'} Listing
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Manage Listings ({listings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <Card className="bg-background/50 backdrop-blur-sm border-border/50 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center">
                      {editingListing ? (
                        <>
                          <Edit className="w-5 h-5 mr-2 text-primary" />
                          Edit Listing
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5 mr-2 text-primary" />
                          Create New Listing
                        </>
                      )}
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                      {editingListing ? 'Update the listing information and save changes' : 'Add a premium car or property listing to your inventory'}
                    </CardDescription>
                  </div>
                  {editingListing && (
                    <Badge variant="outline" className="px-3 py-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      Editing
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <Select value={formData.type} onValueChange={(value: 'car' | 'property') => setFormData(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="car">Car</SelectItem>
                          <SelectItem value="property">Property</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., 2019 Toyota Camry"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Price (KES)</label>
                      <Input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="2800000"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Location</label>
                      <Input
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Nairobi, Kenya"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">WhatsApp Number</label>
                      <Input
                        value={formData.whatsapp_number}
                        onChange={(e) => setFormData(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                        placeholder="+254712345678"
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      />
                      <label htmlFor="featured" className="text-sm font-medium">Featured Listing</label>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="space-y-4">
                      <Label>Images</Label>
                      
                      {/* Enhanced image upload with tabs */}
                      <div className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center gap-4 text-sm">
                          <Badge variant="outline">Option 1: Upload Local Files</Badge>
                          <span className="text-muted-foreground">or</span>
                          <Badge variant="outline">Option 2: Image URLs</Badge>
                        </div>
                        
                        {/* Local Image Upload */}
                        <LocalImageUpload
                          images={formData.images}
                          onImagesChange={(newImages) => setFormData({...formData, images: newImages})}
                          maxImages={10}
                        />
                        
                        {/* URL Upload (fallback) */}
                        <div className="pt-4 border-t">
                          <Label className="text-sm text-muted-foreground">Or add image URLs manually:</Label>
                          <ImageUpload
                            images={formData.images}
                            onImagesChange={(newImages) => setFormData({...formData, images: newImages})}
                          />
                        </div>
                      </div>
                     </div>
                   </div>

                   <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Detailed description of the listing..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Features (comma-separated)</label>
                    <Textarea
                      value={formData.features}
                      onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                      placeholder="Air Conditioning, Power Windows, Bluetooth"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Specifications (JSON format)</label>
                    <Textarea
                      value={formData.specifications}
                      onChange={(e) => setFormData(prev => ({ ...prev, specifications: e.target.value }))}
                      placeholder={formData.type === 'car' 
                        ? '{"year": "2019", "mileage": "45,000 km", "engine": "2.5L", "transmission": "Automatic"}' 
                        : '{"bedrooms": "3", "bathrooms": "2", "area": "1500 sqft", "parking": "2 cars"}'
                      }
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter specifications as JSON. For cars: year, mileage, engine, etc. For properties: bedrooms, bathrooms, area, etc.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {editingListing ? 'Update' : 'Create'} Listing
                    </Button>
                    {editingListing && (
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage">
            <div className="space-y-6">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading listings...</p>
                  </div>
                </div>
              ) : listings.length === 0 ? (
                <Card className="bg-background/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Car className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start by creating your first car or property listing
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {listings.map((listing) => (
                    <Card key={listing.id} className="bg-background/50 backdrop-blur-sm border-border/50 shadow-md hover:shadow-lg transition-all duration-200 group">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                          {/* Image Preview */}
                          <div className="flex-shrink-0">
                            <div className="w-full lg:w-32 h-32 bg-muted rounded-lg overflow-hidden border">
                              {listing.images && listing.images.length > 0 ? (
                                <img
                                  src={listing.images[0]}
                                  alt={listing.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    target.nextElementSibling!.classList.remove('hidden');
                                  }}
                                />
                              ) : null}
                              <div className={`${listing.images && listing.images.length > 0 ? 'hidden' : ''} w-full h-full flex items-center justify-center`}>
                                {listing.type === 'car' ? (
                                  <Car className="h-8 w-8 text-muted-foreground" />
                                ) : (
                                  <Home className="h-8 w-8 text-muted-foreground" />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3 flex-wrap">
                                {listing.type === 'car' ? (
                                  <Car className="h-5 w-5 text-primary flex-shrink-0" />
                                ) : (
                                  <Home className="h-5 w-5 text-primary flex-shrink-0" />
                                )}
                                <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                                  {listing.title}
                                </h3>
                                {listing.featured && (
                                  <Badge variant="secondary" className="bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 text-yellow-700 border-yellow-300/20">
                                    <Star className="w-3 h-3 mr-1" />
                                    Featured
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3 text-sm">
                              <p className="font-semibold text-lg text-primary">
                                KSH {listing.price.toLocaleString()}
                              </p>
                              <p className="text-muted-foreground flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {listing.location}
                              </p>
                            </div>
                            
                            {listing.description && (
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                {listing.description}
                              </p>
                            )}

                            {listing.features.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-4">
                                {listing.features.slice(0, 4).map((feature, index) => (
                                  <Badge key={index} variant="outline" className="text-xs bg-muted/50">
                                    {feature}
                                  </Badge>
                                ))}
                                {listing.features.length > 4 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{listing.features.length - 4} more
                                  </Badge>
                                )}
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                {new Date(listing.created_at).toLocaleDateString()}
                                {listing.images && listing.images.length > 0 && (
                                  <>
                                    <span>•</span>
                                    <span>{listing.images.length} image{listing.images.length !== 1 ? 's' : ''}</span>
                                  </>
                                )}
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(listing)}
                                  className="hover:bg-primary/10 hover:border-primary/20 hover:text-primary transition-colors"
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete(listing.id)}
                                  className="hover:bg-destructive/90"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;