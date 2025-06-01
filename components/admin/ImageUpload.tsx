// File: components/admin/ImageUpload.tsx
'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { imageService } from '@/lib/services/imageService';
import { GraniteImage } from '@/types';

interface ImageUploadProps {
  images: GraniteImage[];
  onImagesChange: (images: GraniteImage[]) => void;
  maxImages?: number;
  folder?: string;
}

export default function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 10,
  folder = 'granites' 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const handleFileUpload = async (files: FileList) => {
    if (images.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    const newImages: GraniteImage[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileId = `temp_${Date.now()}_${i}`;
        
        // Validate file type and size
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} is not a valid image file`);
          continue;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          alert(`${file.name} is too large. Maximum size is 10MB`);
          continue;
        }

        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

        try {
          // Upload to Cloudinary
          const uploadResult = await imageService.uploadImage(file, folder);
          
          const newImage: GraniteImage = {
            id: `img_${Date.now()}_${i}`,
            url: uploadResult.url,
            alt: `Granite Image ${images.length + newImages.length + 1}`,
            type: (images.length === 0 && newImages.length === 0) ? 'primary' : 'secondary',
            order: images.length + newImages.length + 1,
            cloudinaryPublicId: uploadResult.publicId,
            width: uploadResult.width,
            height: uploadResult.height
          };

          newImages.push(newImage);
          setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));

        } catch (uploadError) {
          console.error(`Error uploading ${file.name}:`, uploadError);
          alert(`Failed to upload ${file.name}`);
        }
      }

      // Update images
      onImagesChange([...images, ...newImages]);

    } catch (error) {
      console.error('Error in file upload:', error);
      alert('Failed to upload images');
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  const removeImage = async (index: number) => {
    const imageToRemove = images[index];
    
    try {
      // Delete from Cloudinary if it has a public ID
      if (imageToRemove.cloudinaryPublicId) {
        await imageService.deleteImage(imageToRemove.cloudinaryPublicId);
      }

      // Remove from local state
      const updatedImages = images.filter((_, i) => i !== index);
      
      // If we removed the primary image, make the first remaining image primary
      if (imageToRemove.type === 'primary' && updatedImages.length > 0) {
        updatedImages[0].type = 'primary';
      }

      onImagesChange(updatedImages);
    } catch (error) {
      console.error('Error removing image:', error);
      alert('Failed to remove image');
    }
  };

  const setImageAsPrimary = (index: number) => {
    const updatedImages = images.map((img, i) => ({
      ...img,
      type: i === index ? 'primary' : 'secondary'
    }));
    onImagesChange(updatedImages);
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const updatedImages = [...images];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    
    // Update order numbers
    updatedImages.forEach((img, index) => {
      img.order = index + 1;
    });

    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-500 transition-colors">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          className="hidden"
          id="image-upload"
          disabled={uploading || images.length >= maxImages}
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
              <p className="text-sm text-gray-600">Uploading images...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600">
                Click to upload images or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, JPEG up to 10MB each ({images.length}/{maxImages} images)
              </p>
            </div>
          )}
        </label>
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={image.id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>

              {/* Image Controls */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {image.type !== 'primary' && (
                  <button
                    type="button"
                    onClick={() => setImageAsPrimary(index)}
                    className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-blue-600 transition-colors"
                    title="Set as primary"
                  >
                    ★
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Primary Badge */}
              {image.type === 'primary' && (
                <div className="absolute bottom-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
                  Primary
                </div>
              )}

              {/* Image Order */}
              <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {image.order}
              </div>

              {/* Drag Handle (for future drag & drop functionality) */}
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-6 h-6 bg-gray-500 text-white rounded flex items-center justify-center cursor-grab">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help Text */}
      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <ul className="space-y-1">
          <li>• First uploaded image will be set as primary automatically</li>
          <li>• Click the star (★) button to set any image as primary</li>
          <li>• Primary image will be displayed as the main image in listings</li>
          <li>• Images are automatically optimized and stored securely</li>
        </ul>
      </div>
    </div>
  );
}
