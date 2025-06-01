'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  Package,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';

interface Granite {
  id: string;
  name: string;
  description: string;
  price: number;
  priceUnit: string;
  category: 'standard' | 'premium' | 'luxury';
  origin: string;
  color: string;
  pattern: string;
  finish: string[];
  thickness: number[];
  availability: 'in-stock' | 'pre-order' | 'out-of-stock';
  images: Array<{
    id: string;
    url: string;
    alt: string;
    type: 'primary' | 'secondary';
    order: number;
  }>;
  specifications: {
    density: number;
    porosity: number;
    compressiveStrength: number;
    flexuralStrength: number;
    abrasionResistance: string;
    frostResistance: boolean;
    acidResistance: string;
    applications: string[];
  };
  sizes: Array<{
    id: string;
    length: number;
    width: number;
    thickness: number;
    unit: string;
    stock: number;
    price: number;
  }>;
  featured: boolean;
  popular: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data - replace with actual API calls
const mockGranites: Granite[] = [
  {
    id: '1',
    name: 'Kashmir White',
    description: 'Elegant white granite with subtle gray veining, perfect for modern kitchens and bathrooms.',
    price: 150,
    priceUnit: 'sqft',
    category: 'premium',
    origin: 'India',
    color: 'White',
    pattern: 'Veined',
    finish: ['Polished', 'Honed', 'Flamed'],
    thickness: [18, 20, 30],
    availability: 'in-stock',
    images: [
      { id: '1', url: '/images/granites/kashmir-white.jpg', alt: 'Kashmir White Granite', type: 'primary', order: 1 },
    ],
    specifications: {
      density: 2.6,
      porosity: 0.5,
      compressiveStrength: 200,
      flexuralStrength: 15,
      abrasionResistance: 'High',
      frostResistance: true,
      acidResistance: 'Medium',
      applications: ['Kitchen Countertops', 'Bathroom Vanities', 'Flooring']
    },
    sizes: [
      { id: '1', length: 3000, width: 1500, thickness: 20, unit: 'mm', stock: 25, price: 150 }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    featured: true,
    popular: true
  },
  {
    id: '2',
    name: 'Black Galaxy',
    description: 'Stunning black granite with golden speckles that shimmer in light.',
    price: 200,
    priceUnit: 'sqft',
    category: 'premium',
    origin: 'India',
    color: 'Black',
    pattern: 'Speckled',
    finish: ['Polished', 'Honed'],
    thickness: [18, 20, 30],
    availability: 'in-stock',
    images: [
      { id: '2', url: '/images/granites/black-galaxy.jpg', alt: 'Black Galaxy Granite', type: 'primary', order: 1 },
    ],
    specifications: {
      density: 2.7,
      porosity: 0.3,
      compressiveStrength: 220,
      flexuralStrength: 18,
      abrasionResistance: 'Very High',
      frostResistance: true,
      acidResistance: 'High',
      applications: ['Kitchen Countertops', 'Feature Walls', 'Flooring']
    },
    sizes: [
      { id: '2', length: 3000, width: 1500, thickness: 20, unit: 'mm', stock: 15, price: 200 }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    featured: true,
    popular: false
  },
  {
    id: '3',
    name: 'Tan Brown',
    description: 'Warm brown granite with natural patterns and rich texture.',
    price: 120,
    priceUnit: 'sqft',
    category: 'standard',
    origin: 'India',
    color: 'Brown',
    pattern: 'Natural',
    finish: ['Polished', 'Honed', 'Brushed'],
    thickness: [18, 20],
    availability: 'in-stock',
    images: [
      { id: '3', url: '/images/granites/tan-brown.jpg', alt: 'Tan Brown Granite', type: 'primary', order: 1 },
    ],
    specifications: {
      density: 2.65,
      porosity: 0.4,
      compressiveStrength: 180,
      flexuralStrength: 14,
      abrasionResistance: 'High',
      frostResistance: true,
      acidResistance: 'Medium',
      applications: ['Kitchen Countertops', 'Bathroom Counters', 'Stairs']
    },
    sizes: [
      { id: '3', length: 3000, width: 1500, thickness: 20, unit: 'mm', stock: 30, price: 120 }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    featured: false,
    popular: true
  }
];

export default function AdminGranites() {
  const [granites, setGranites] = useState<Granite[]>(mockGranites);
  const [filteredGranites, setFilteredGranites] = useState<Granite[]>(mockGranites);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [graniteToDelete, setGraniteToDelete] = useState<string | null>(null);

  const categories = ['all', 'standard', 'premium', 'luxury'];
  const availabilities = ['all', 'in-stock', 'pre-order', 'out-of-stock'];

  useEffect(() => {
    filterGranites();
  }, [searchTerm, selectedCategory, selectedAvailability, granites]);

  const filterGranites = () => {
    const filtered = granites.filter(granite => {
      const matchesSearch = granite.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        granite.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        granite.color.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || granite.category === selectedCategory;
      const matchesAvailability = selectedAvailability === 'all' || granite.availability === selectedAvailability;

      return matchesSearch && matchesCategory && matchesAvailability;
    });

    setFilteredGranites(filtered);
  };

  const handleDelete = async (graniteId: string) => {
    setLoading(true);
    try {
      // Replace with actual API call
      // await fetch(`/api/admin/granites/${graniteId}`, { method: 'DELETE' });
      
      setGranites(prev => prev.filter(g => g.id !== graniteId));
      setShowDeleteModal(false);
      setGraniteToDelete(null);
    } catch (error) {
      console.error('Error deleting granite:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (graniteId: string) => {
    try {
      // Replace with actual API call
      setGranites(prev => prev.map(g => 
        g.id === graniteId ? { ...g, featured: !g.featured } : g
      ));
    } catch (error) {
      console.error('Error updating granite:', error);
    }
  };

  const getAvailabilityBadge = (availability: string) => {
    const styles = {
      'in-stock': 'bg-green-100 text-green-800 border-green-200',
      'pre-order': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'out-of-stock': 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[availability as keyof typeof styles]}`}>
        {availability.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')}
      </span>
    );
  };

  const getCategoryBadge = (category: string) => {
    const styles = {
      standard: 'bg-blue-100 text-blue-800',
      premium: 'bg-purple-100 text-purple-800',
      luxury: 'bg-amber-100 text-amber-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${styles[category as keyof typeof styles]}`}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin"
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Granite Management</h1>
            </div>
            <Link
              href="/admin/granites/new"
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Add New Granite
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search granites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : 
                   category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            {/* Availability Filter */}
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-500"
            >
              {availabilities.map(availability => (
                <option key={availability} value={availability}>
                  {availability === 'all' ? 'All Status' : 
                   availability.split('-').map(word => 
                     word.charAt(0).toUpperCase() + word.slice(1)
                   ).join(' ')}
                </option>
              ))}
            </select>

            {/* Results Count */}
            <div className="flex items-center justify-end">
              <span className="text-sm text-gray-600">
                {filteredGranites.length} of {granites.length} granites
              </span>
            </div>
          </div>
        </div>

        {/* Granite Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredGranites.map((granite) => (
            <div key={granite.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group border border-gray-200">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={granite.images[0]?.url || '/images/placeholder-granite.jpg'}
                  alt={granite.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {granite.featured && (
                    <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
                      FEATURED
                    </span>
                  )}
                  {granite.popular && (
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                      POPULAR
                    </span>
                  )}
                </div>

                {/* Availability Badge */}
                <div className="absolute top-3 right-3">
                  {getAvailabilityBadge(granite.availability)}
                </div>

                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">

                  <Link
                    href={`/admin/granites/${granite.id}/edit`}
                    className="bg-white/20 backdrop-blur-md text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
                    title="Edit Granite"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/granites/${granite.id}`}
                    className="bg-white/20 backdrop-blur-md text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
                    title="View Public Page"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => {
                      setGraniteToDelete(granite.id);
                      setShowDeleteModal(true);
                    }}
                    className="bg-white/20 backdrop-blur-md text-white p-2 rounded-lg hover:bg-red-500/80 transition-colors"
                    title="Delete Granite"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{granite.name}</h3>
                  <span className="text-lg font-bold text-amber-600">
                    ₹{granite.price}/{granite.priceUnit}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {granite.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {getCategoryBadge(granite.category)}
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
                    {granite.color}
                  </span>
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded">
                    {granite.origin}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-600">
                    Stock: {granite.sizes[0]?.stock || 0} slabs
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFeatured(granite.id)}
                      className={`text-xs px-2 py-1 rounded transition-colors ${
                        granite.featured 
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {granite.featured ? 'Featured' : 'Feature'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Updated: {granite.updatedAt.toLocaleDateString()}
                  </div>
                  <Link
                    href={`/admin/granites/${granite.id}/edit`}
                    className="text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors"
                  >
                    Edit Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredGranites.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No granites found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or add a new granite.
            </p>
            <Link
              href="/admin/granites/new"
              className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-lg font-semibold inline-flex items-center gap-2 hover:from-amber-600 hover:to-orange-700 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              Add New Granite
            </Link>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Granite</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone.</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this granite? All associated data including images and specifications will be permanently removed.
              </p>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setGraniteToDelete(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={() => graniteToDelete && handleDelete(graniteToDelete)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}