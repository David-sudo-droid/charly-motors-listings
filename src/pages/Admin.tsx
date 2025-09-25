import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Edit, Trash2, Car, Home } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Badge } from '@/components/ui/badge';

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
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    type: 'car' as 'car' | 'property',
    title: '',
    price: '',
    location: '',
    images: '',
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
      images: '',
      description: '',
      features: '',
      specifications: '',
      whatsapp_number: '',
      featured: false,
    });
    setEditingListing(null);
    setUploadedImageUrls([]);
    setDragActive(false);
  };

  const handleFilesSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    setIsUploadingImages(true);
    try {
      const bucket = 'listing-images';
      const newUrls: string[] = [];
      for (const file of files) {
        const filePath = `${user?.id || 'anon'}/${uuidv4()}-${file.name}`;
        const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });
        if (uploadError) {
          throw uploadError;
        }
        const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
        if (publicUrlData?.publicUrl) {
          newUrls.push(publicUrlData.publicUrl);
        }
      }
      setUploadedImageUrls(prev => [...prev, ...newUrls]);
      // Reflect in the textarea fallback so submit works without extra logic
      setFormData(prev => ({
        ...prev,
        images: [...new Set([...(prev.images ? prev.images.split(',').map(s => s.trim()).filter(Boolean) : []), ...newUrls])].join(', '),
      }));
      toast({ title: 'Upload complete', description: `${files.length} image(s) uploaded.` });
    } catch (err: any) {
      toast({ title: 'Image upload failed', description: err?.message || 'Please try again', variant: 'destructive' });
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFilesSelected(e.dataTransfer.files);
  };

  const removeUploadedUrl = (url: string) => {
    setUploadedImageUrls(prev => prev.filter(u => u !== url));
    setFormData(prev => ({
      ...prev,
      images: prev.images
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .filter(u => u !== url)
        .join(', '),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const listingData = {
      type: formData.type,
      title: formData.title,
      price: parseFloat(formData.price),
      location: formData.location,
      images: formData.images ? formData.images.split(',').map(img => img.trim()) : [],
      description: formData.description || null,
      features: formData.features ? formData.features.split(',').map(f => f.trim()) : [],
      specifications: formData.specifications ? JSON.parse(formData.specifications) : {},
      whatsapp_number: formData.whatsapp_number,
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
      images: listing.images.join(', '),
      description: listing.description || '',
      features: listing.features.join(', '),
      specifications: JSON.stringify(listing.specifications),
      whatsapp_number: listing.whatsapp_number,
      featured: listing.featured,
    });
    setUploadedImageUrls(listing.images || []);
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

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your listings</p>
        </div>

        <Tabs defaultValue="create">
          <TabsList>
            <TabsTrigger value="create">
              <Plus className="w-4 h-4 mr-2" />
              {editingListing ? 'Edit' : 'Create'} Listing
            </TabsTrigger>
            <TabsTrigger value="manage">Manage Listings ({listings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>{editingListing ? 'Edit' : 'Create'} Listing</CardTitle>
                <CardDescription>
                  {editingListing ? 'Update the listing information' : 'Add a new car or property listing'}
                </CardDescription>
              </CardHeader>
              <CardContent>
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

                  <div>
                    <label className="text-sm font-medium">Images</label>
                    <div
                      className={`mt-2 border-2 border-dashed rounded-md p-6 text-center transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/30'}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <p className="text-sm text-muted-foreground">
                        Drag & drop images here, or click to select
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="mt-3"
                        onChange={(e) => handleFilesSelected(e.target.files)}
                      />
                      {isUploadingImages && (
                        <div className="mt-3 flex items-center justify-center text-sm">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                        </div>
                      )}
                    </div>

                    {uploadedImageUrls.length > 0 && (
                      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                        {uploadedImageUrls.map((url) => (
                          <div key={url} className="relative group">
                            <img src={url} alt="uploaded" className="h-24 w-full object-cover rounded" />
                            <button
                              type="button"
                              onClick={() => removeUploadedUrl(url)}
                              className="absolute top-1 right-1 text-xs bg-background/80 border rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-4">
                      <label className="text-xs font-medium text-muted-foreground">Or paste image URLs (optional)</label>
                      <Textarea
                        value={formData.images}
                        onChange={(e) => setFormData(prev => ({ ...prev, images: e.target.value }))}
                        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                        rows={2}
                      />
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
                      placeholder='{"year": "2019", "mileage": "45,000 km", "engine": "2.5L"}'
                      rows={3}
                    />
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
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                listings.map((listing) => (
                  <Card key={listing.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {listing.type === 'car' ? (
                              <Car className="h-4 w-4" />
                            ) : (
                              <Home className="h-4 w-4" />
                            )}
                            <h3 className="font-semibold">{listing.title}</h3>
                            {listing.featured && (
                              <Badge variant="secondary">Featured</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {listing.currency} {listing.price.toLocaleString()} • {listing.location}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {listing.description?.substring(0, 100)}...
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(listing)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(listing.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;