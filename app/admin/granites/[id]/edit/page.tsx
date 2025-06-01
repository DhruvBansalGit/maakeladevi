// File: app/admin/granites/[id]/edit/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  X, 
  Plus, 
  Eye,
  AlertCircle,
  Package,
  Image as ImageIcon,
  Loader2,
  Trash2
} from 'lucide-react';
import { Granite, GraniteFormData, ApiResponse, GraniteImage } from '@/types';

const finishOptions = ['Polished', 'Honed', 'Flamed', 'Brushed', 'Leathered', 'Sandblasted'];
const abrasionOptions = ['Low', 'Medium', 'High', 'Very High'];
const acidResistanceOptions = ['Poor', 'Fair', 'Medium', 'High', 'Excellent'];
const applicationOptions = [
  'Kitchen Countertops',
  'Bathroom Vanities',
  'Flooring',
  'Feature Walls',
  'Exterior Cladding',
  'Stairs',
  'Monuments',
  'Outdoor Kitchens'
];

const initialFormData: GraniteFormData = {
  name: '',
  description: '',
  price: 0,
  priceUnit: 'sqft',
  category: 'standard',
  origin: '',
  color: '',
  pattern: '',
  finish: [],
  thickness: [],
  availability: 'in-stock',
  specifications: {
    density: 0,
    porosity: 0,
    compressiveStrength: 0,
    flexuralStrength: 0,
    abrasionResistance: '',
    frostResistance: false,
    acidResistance: '',
    applications: []
  },
  sizes: [],
  featured: false,
  popular: false,
  images: []
};

export default function EditGranitePage() {
  const router = useRouter();
  const params = useParams();
  const graniteId = params.id as string;
  
  const [formData, setFormData] = useState<GraniteFormData>(initialFormData);
  const [originalGranite, setOriginalGranite] = useState<Granite | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewMode, setPreviewMode] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (graniteId) {
      fetchGraniteData();
    }
  }, [graniteId]);

  useEffect(() => {
    if (originalGranite) {
      checkForChanges();
    }
  }, [formData, originalGranite]);

  const fetchGraniteData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/granites/${graniteId}`);
      const data: ApiResponse<Granite> = await response.json();
      
      if (data.success && data.data) {
        const granite = data.data;
        setOriginalGranite(granite);
        
        // Convert Granite to GraniteFormData
        const formData: GraniteFormData = {
          name: granite.name,
          description: granite.description,
          price: granite.price,
          priceUnit: granite.priceUnit,
          category: granite.category,
          origin: granite.origin,
          color: granite.color,
          pattern: granite.pattern,
          finish: granite.finish,
          thickness: granite.thickness,
          availability: granite.availability,
          specifications: granite.specifications,
          sizes: granite.sizes.map(size => ({
            length: size.length,
            width: size.width,
            thickness: size.thickness,
            unit: size.unit,
            stock: size.stock,
            price: size.price
          })),
          featured: granite.featured,
          popular: granite.popular,
          images: granite.images
        };
        
        setFormData(formData);
      } else {
        console.error('Failed to fetch granite:', data.error);
        router.push('/admin/granites');
      }
    } catch (error) {
      console.error('Error fetching granite:', error);
      router.push('/admin/granites');
    } finally {
      setLoading(false);
    }
  };

  const checkForChanges = () => {
    if (!originalGranite) return;
    
    // Simple JSON comparison for changes detection
    const originalFormData: GraniteFormData = {
      name: originalGranite.name,
      description: originalGranite.description,
      price: originalGranite.price,
      priceUnit: originalGranite.priceUnit,
      category: originalGranite.category,
      origin: originalGranite.origin,
      color: originalGranite.color,
      pattern: originalGranite.pattern,
      finish: originalGranite.finish,
      thickness: originalGranite.thickness,
      availability: originalGranite.availability,
      specifications: originalGranite.specifications,
      sizes: originalGranite.sizes.map(size => ({
        length: size.length,
        width: size.width,
        thickness: size.thickness,
        unit: size.unit,
        stock: size.stock,
        price: size.price
      })),
      featured: originalGranite.featured,
      popular: originalGranite.popular,
      images: originalGranite.images
    };
    
    setHasChanges(JSON.stringify(formData) !== JSON.stringify(originalFormData));
  };

const handleInputChange = (
  field: keyof GraniteFormData,
  value: string | number | boolean | string[] | number[] | GraniteImage[]
) => {
  setFormData(prev => ({
    ...prev,
    [field]: value
  }));

  if (errors[field]) {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }
};

const handleSpecificationChange = (
  field: keyof GraniteFormData['specifications'],
  value: string | number | boolean | string[]
) => {
  setFormData(prev => ({
    ...prev,
    specifications: {
      ...prev.specifications,
      [field]: value
    }
  }));
};

  const handleImageUpload = async (files: FileList) => {
    setUploadingImages(true);
    try {
      const newImages = Array.from(files).map((file, index) => ({
        id: Date.now().toString() + index,
        url: URL.createObjectURL(file),
        alt: `${formData.name} - Image ${(formData.images?.length || 0) + index + 1}`,
        type: (formData.images?.length === 0 && index === 0) ? 'primary' : 'secondary' as 'primary' | 'secondary',
        order: (formData.images?.length || 0) + index + 1
      }));

      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newImages]
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }));
  };

  const setImageAsPrimary = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.map((img, i) => ({
        ...img,
        type: i === index ? 'primary' : 'secondary'
      })) || []
    }));
  };

  const addSize = () => {
    setFormData(prev => ({
      ...prev,
      sizes: [
        ...prev.sizes,
        {
          length: 3000,
          width: 1500,
          thickness: 20,
          unit: 'mm',
          stock: 0,
          price: formData.price
        }
      ]
    }));
  };

  const removeSize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

 const updateSize = (
  index: number,
  field: keyof GraniteFormData['sizes'][number],
  value: string | number
) => {
  setFormData(prev => ({
    ...prev,
    sizes: prev.sizes.map((size, i) =>
      i === index ? { ...size, [field]: value } : size
    )
  }));
};

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.origin.trim()) newErrors.origin = 'Origin is required';
    if (!formData.color.trim()) newErrors.color = 'Color is required';
    if (!formData.pattern.trim()) newErrors.pattern = 'Pattern is required';
    if (formData.finish.length === 0) newErrors.finish = 'At least one finish is required';
    if (formData.thickness.length === 0) newErrors.thickness = 'At least one thickness is required';
    if (!formData.images || formData.images.length === 0) newErrors.images = 'At least one image is required';
    if (formData.sizes.length === 0) newErrors.sizes = 'At least one size is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/granites/${graniteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        router.push('/admin/granites');
      } else {
        console.error('Failed to update granite:', data.error);
        // Handle error - show toast notification
      }
    } catch (error) {
      console.error('Error updating granite:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
        router.push('/admin/granites');
      }
    } else {
      router.push('/admin/granites');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          <span className="text-lg text-gray-600">Loading granite details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleCancel}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Granite</h1>
                <p className="text-sm text-gray-500">{formData.name || 'Untitled Granite'}</p>
              </div>
              {hasChanges && (
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Unsaved changes</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                <Eye className="w-4 h-4" />
                {previewMode ? 'Edit Mode' : 'Preview'}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                form="granite-form"
                disabled={saving || !hasChanges}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Update Granite
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Bar */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Editing: {originalGranite?.name}</h3>
                <p className="text-sm text-blue-700">
                  Created: {originalGranite?.createdAt ? new Date(originalGranite.createdAt).toLocaleDateString() : 'Unknown'}
                  {originalGranite?.updatedAt && (
                    <> | Last updated: {new Date(originalGranite.updatedAt).toLocaleDateString()}</>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {originalGranite?.featured && (
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded">
                  FEATURED
                </span>
              )}
              {originalGranite?.popular && (
                <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                  POPULAR
                </span>
              )}
              <span className={`text-xs font-bold px-2 py-1 rounded text-white ${
                originalGranite?.availability === 'in-stock' ? 'bg-green-600' :
                originalGranite?.availability === 'pre-order' ? 'bg-orange-600' : 'bg-red-600'
              }`}>
                {originalGranite?.availability?.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </span>
            </div>
          </div>
        </div>

        <form id="granite-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Granite Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter granite name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700"
                >
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="luxury">Luxury</option>
                  <option value="economy">Economy</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none text-black ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter detailed description"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    className={`flex-1 px-3 py-2 border border-l-0 rounded-r-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  <select
                    value={formData.priceUnit}
                    onChange={(e) => handleInputChange('priceUnit', e.target.value)}
                    className="ml-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700"
                  >
                    <option value="sqft">per sq ft</option>
                    <option value="slab">per slab</option>
                  </select>
                </div>
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.price}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <select
                  value={formData.availability}
                  onChange={(e) => handleInputChange('availability', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700"
                >
                  <option value="in-stock">In Stock</option>
                  <option value="pre-order">Pre Order</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Origin *
                </label>
                <input
                  type="text"
                  value={formData.origin}
                  onChange={(e) => handleInputChange('origin', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black ${
                    errors.origin ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., India, Brazil, Norway"
                />
                {errors.origin && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.origin}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color *
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black ${
                    errors.color ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., White, Black, Brown"
                />
                {errors.color && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.color}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pattern *
                </label>
                <input
                  type="text"
                  value={formData.pattern}
                  onChange={(e) => handleInputChange('pattern', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black ${
                    errors.pattern ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Veined, Speckled, Natural"
                />
                {errors.pattern && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.pattern}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center gap-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured Granite</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.popular}
                      onChange={(e) => handleInputChange('popular', e.target.checked)}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Popular Granite</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Images</h2>
            
            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Images *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-500 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                  className="hidden"
                  id="image-upload"
                  disabled={uploadingImages}
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600">
                    {uploadingImages ? 'Uploading...' : 'Click to upload images or drag and drop'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, JPEG up to 10MB each
                  </p>
                </label>
              </div>
              {errors.images && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.images}
                </p>
              )}
            </div>

            {/* Image Preview */}
            {formData.images && formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        className="object-cover"
                      />
                    </div>
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
                    {image.type === 'primary' && (
                      <div className="absolute bottom-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
                        Primary
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Finish Options */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Finish & Thickness</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Finishes *
                </label>
                <div className="space-y-2">
                  {finishOptions.map((finish) => (
                    <label key={finish} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.finish.includes(finish)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleInputChange('finish', [...formData.finish, finish]);
                          } else {
                            handleInputChange('finish', formData.finish.filter(f => f !== finish));
                          }
                        }}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{finish}</span>
                    </label>
                  ))}
                </div>
                {errors.finish && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.finish}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Thickness (mm) *
                </label>
                <div className="space-y-2">
                  {[15, 18, 20, 25, 30, 40, 50].map((thickness) => (
                    <label key={thickness} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.thickness.includes(thickness)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleInputChange('thickness', [...formData.thickness, thickness]);
                          } else {
                            handleInputChange('thickness', formData.thickness.filter(t => t !== thickness));
                          }
                        }}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{thickness}mm</span>
                    </label>
                  ))}
                </div>
                {errors.thickness && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.thickness}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Technical Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Density (g/cm³)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.specifications.density}
                  onChange={(e) => handleSpecificationChange('density', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
                  placeholder="2.6"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Porosity (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.specifications.porosity}
                  onChange={(e) => handleSpecificationChange('porosity', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
                  placeholder="0.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compressive Strength (MPa)
                </label>
                <input
                  type="number"
                  value={formData.specifications.compressiveStrength}
                  onChange={(e) => handleSpecificationChange('compressiveStrength', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
                  placeholder="200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Flexural Strength (MPa)
                </label>
                <input
                  type="number"
                  value={formData.specifications.flexuralStrength}
                  onChange={(e) => handleSpecificationChange('flexuralStrength', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
                  placeholder="15"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Abrasion Resistance
                </label>
                <select
                  value={formData.specifications.abrasionResistance}
                  onChange={(e) => handleSpecificationChange('abrasionResistance', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700"
                >
                  <option value="">Select...</option>
                  {abrasionOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Acid Resistance
                </label>
                <select
                  value={formData.specifications.acidResistance}
                  onChange={(e) => handleSpecificationChange('acidResistance', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700"
                >
                  <option value="">Select...</option>
                  {acidResistanceOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.specifications.frostResistance}
                    onChange={(e) => handleSpecificationChange('frostResistance', e.target.checked)}
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Frost Resistant</span>
                </label>
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Applications
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {applicationOptions.map((application) => (
                    <label key={application} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.specifications.applications.includes(application)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleSpecificationChange('applications', [...formData.specifications.applications, application]);
                          } else {
                            handleSpecificationChange('applications', formData.specifications.applications.filter(a => a !== application));
                          }
                        }}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="ml-2 text-xs text-gray-700">{application}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sizes & Stock */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Sizes & Stock</h2>
              <button
                type="button"
                onClick={addSize}
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Size
              </button>
            </div>

            {formData.sizes.length > 0 ? (
              <div className="space-y-4">
                {formData.sizes.map((size, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Length
                        </label>
                        <input
                          type="number"
                          value={size.length}
                          onChange={(e) => updateSize(index, 'length', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Width
                        </label>
                        <input
                          type="number"
                          value={size.width}
                          onChange={(e) => updateSize(index, 'width', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Thickness
                        </label>
                        <input
                          type="number"
                          value={size.thickness}
                          onChange={(e) => updateSize(index, 'thickness', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Unit
                        </label>
                        <select
                          value={size.unit}
                          onChange={(e) => updateSize(index, 'unit', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700"
                        >
                          <option value="mm">mm</option>
                          <option value="cm">cm</option>
                          <option value="inch">inches</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Stock
                        </label>
                        <input
                          type="number"
                          value={size.stock}
                          onChange={(e) => updateSize(index, 'stock', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeSize(index)}
                          className="w-full flex items-center justify-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded text-sm transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No sizes added yet</p>
                <button
                  type="button"
                  onClick={addSize}
                  className="mt-2 text-amber-600 hover:text-amber-700 font-medium"
                >
                  Add your first size
                </button>
              </div>
            )}
            {errors.sizes && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.sizes}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <Link
                href={`/granites/${graniteId}`}
                target="_blank"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Public Page
              </Link>
              {hasChanges && (
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">You have unsaved changes</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !hasChanges}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Update Granite
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}