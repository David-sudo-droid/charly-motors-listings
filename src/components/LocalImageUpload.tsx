import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Image as ImageIcon, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LocalImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
}

const LocalImageUpload = ({ 
  images, 
  onImagesChange, 
  maxImages = 10,
  className = "" 
}: LocalImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;
    
    const remainingSlots = maxImages - images.length;
    if (files.length > remainingSlots) {
      toast({
        title: "Too many files",
        description: `You can only upload ${remainingSlots} more image(s)`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const newImages: string[] = [];

    files.forEach((file, index) => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file`,
          variant: "destructive",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: `${file.name} is larger than 5MB`,
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        newImages.push(dataUrl);
        
        // If this is the last file, update the images
        if (newImages.length === files.length) {
          onImagesChange([...images, ...newImages]);
          setUploading(false);
          toast({
            title: "Images uploaded",
            description: `Successfully uploaded ${newImages.length} image(s)`,
          });
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    toast({
      title: "Image removed",
      description: "Image has been removed from the listing",
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-primary" />
          <span className="font-medium">Images</span>
          <Badge variant="secondary">{images.length}/{maxImages}</Badge>
        </div>
        
        {images.length < maxImages && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUploadClick}
            disabled={uploading}
            className="flex items-center gap-2"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Add Images
          </Button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Images Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <Card className="overflow-hidden aspect-square">
                <CardContent className="p-0 h-full">
                  <img
                    src={image}
                    alt={`Listing image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </CardContent>
              </Card>
              
              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110"
              >
                <X className="w-3 h-3" />
              </button>
              
              {/* Image index badge */}
              <Badge 
                className="absolute bottom-2 left-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                variant="secondary"
              >
                {index + 1}
              </Badge>
            </div>
          ))}
          
          {/* Add more button (if space available) */}
          {images.length < maxImages && (
            <Card 
              className="aspect-square border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 cursor-pointer transition-colors group"
              onClick={handleUploadClick}
            >
              <CardContent className="p-0 h-full flex flex-col items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                <Plus className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">Add More</span>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        // Empty state
        <Card 
          className="border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 cursor-pointer transition-colors group"
          onClick={handleUploadClick}
        >
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center text-muted-foreground group-hover:text-primary transition-colors">
              <Upload className="w-12 h-12 mb-4" />
              <h3 className="font-medium mb-2">Upload Images</h3>
              <p className="text-sm mb-4">
                Drag and drop images here, or click to select files
              </p>
              <p className="text-xs text-muted-foreground">
                Supports JPG, PNG, GIF up to 5MB each. Maximum {maxImages} images.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload progress */}
      {uploading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span className="text-sm text-muted-foreground">Processing images...</span>
        </div>
      )}
    </div>
  );
};

export default LocalImageUpload;