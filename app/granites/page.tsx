'use client';
import { useState, useEffect } from 'react';
import { Search, Grid3X3, List,  Eye, Heart, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Granite } from '@/types';
import { formatCurrency } from '@/utils/helpers';
import Button from '@/components/common/Button';

// Mock data - replace with API call
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
        popular: true,
        status:'active'
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
        popular: false,
        status:'active'
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
        popular: true,
        status:'active'
    },
    {
        id: '4',
        name: 'Imperial Red',
        description: 'Bold red granite with striking patterns, ideal for statement pieces.',
        price: 180,
        priceUnit: 'sqft',
        category: 'premium',
        origin: 'India',
        color: 'Red',
        pattern: 'Veined',
        finish: ['Polished', 'Flamed'],
        thickness: [20, 30],
        availability: 'pre-order',
        images: [
            { id: '4', url: '/images/granites/imperial-red.jpg', alt: 'Imperial Red Granite', type: 'primary', order: 1 },
        ],
        specifications: {
            density: 2.68,
            porosity: 0.35,
            compressiveStrength: 210,
            flexuralStrength: 16,
            abrasionResistance: 'High',
            frostResistance: true,
            acidResistance: 'Medium',
            applications: ['Feature Walls', 'Flooring', 'Monuments']
        },
        sizes: [
            { id: '4', length: 3000, width: 1500, thickness: 20, unit: 'mm', stock: 8, price: 180 }
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        featured: false,
        popular: false,
        status:'active'
    },
    {
        id: '5',
        name: 'Blue Pearl',
        description: 'Elegant blue-gray granite with pearl-like reflections.',
        price: 220,
        priceUnit: 'sqft',
        category: 'premium',
        origin: 'Norway',
        color: 'Blue',
        pattern: 'Speckled',
        finish: ['Polished', 'Honed'],
        thickness: [20, 30],
        availability: 'in-stock',
        images: [
            { id: '5', url: '/images/granites/blue-pearl.jpg', alt: 'Blue Pearl Granite', type: 'primary', order: 1 },
        ],
        specifications: {
            density: 2.72,
            porosity: 0.25,
            compressiveStrength: 240,
            flexuralStrength: 20,
            abrasionResistance: 'Very High',
            frostResistance: true,
            acidResistance: 'High',
            applications: ['Luxury Countertops', 'Feature Walls', 'Exterior Cladding']
        },
        sizes: [
            { id: '5', length: 3000, width: 1500, thickness: 20, unit: 'mm', stock: 12, price: 220 }
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        featured: true,
        popular: false,
        status:'active'
    },
    {
        id: '6',
        name: 'Green Forest',
        description: 'Rich green granite with natural forest-like patterns.',
        price: 160,
        priceUnit: 'sqft',
        category: 'standard',
        origin: 'Brazil',
        color: 'Green',
        pattern: 'Natural',
        finish: ['Polished', 'Honed', 'Brushed'],
        thickness: [18, 20, 30],
        availability: 'in-stock',
        images: [
            { id: '6', url: '/images/granites/green-forest.jpg', alt: 'Green Forest Granite', type: 'primary', order: 1 },
        ],
        specifications: {
            density: 2.63,
            porosity: 0.45,
            compressiveStrength: 190,
            flexuralStrength: 15,
            abrasionResistance: 'High',
            frostResistance: true,
            acidResistance: 'Medium',
            applications: ['Kitchen Islands', 'Bathroom Vanities', 'Outdoor Kitchens']
        },
        sizes: [
            { id: '6', length: 3000, width: 1500, thickness: 20, unit: 'mm', stock: 20, price: 160 }
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        featured: false,
        popular: true,
        status:'active'
    }
];

export default function GranitesPage() {
    const [granites, setGranites] = useState<Granite[]>(mockGranites);
    const [filteredGranites, setFilteredGranites] = useState<Granite[]>(mockGranites);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedColor, setSelectedColor] = useState<string>('all');
    const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 300]);
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'popularity'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    // const [showFilters, setShowFilters] = useState(false);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [selectedGranites, setSelectedGranites] = useState<string[]>([]);

    // Extract unique values for filters
    const categories = [...new Set(granites.map(g => g.category))];
    const colors = [...new Set(granites.map(g => g.color))];
    const availabilities = [...new Set(granites.map(g => g.availability))];

    // Filter and sort logic
    useEffect(() => {
        const filtered = granites.filter(granite => {
            const matchesSearch = granite.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                granite.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || granite.category === selectedCategory;
            const matchesColor = selectedColor === 'all' || granite.color === selectedColor;
            const matchesAvailability = selectedAvailability === 'all' || granite.availability === selectedAvailability;
            const matchesPrice = granite.price >= priceRange[0] && granite.price <= priceRange[1];

            return matchesSearch && matchesCategory && matchesColor && matchesAvailability && matchesPrice;
        });

        // Sort
        filtered.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'price':
                    comparison = a.price - b.price;
                    break;
                case 'popularity':
                    comparison = (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
                    break;
            }
            return sortOrder === 'desc' ? -comparison : comparison;
        });

        setFilteredGranites(filtered);
    }, [granites, searchTerm, selectedCategory, selectedColor, selectedAvailability, priceRange, sortBy, sortOrder]);

    const toggleFavorite = (graniteId: string) => {
        setFavorites(prev =>
            prev.includes(graniteId)
                ? prev.filter(id => id !== graniteId)
                : [...prev, graniteId]
        );
    };

    const toggleSelection = (graniteId: string) => {
        setSelectedGranites(prev =>
            prev.includes(graniteId)
                ? prev.filter(id => id !== graniteId)
                : [...prev, graniteId]
        );
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('all');
        setSelectedColor('all');
        setSelectedAvailability('all');
        setPriceRange([0, 300]);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Premium Granite Collection
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Discover our extensive range of high-quality granites with advanced 3D visualization.
                            Find the perfect stone for your project.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:w-80">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                                >
                                    Clear All
                                </button>
                            </div>

                            {/* Search */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Search
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search granites..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-500"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Color Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Color
                                </label>
                                <select
                                    value={selectedColor}
                                    onChange={(e) => setSelectedColor(e.target.value)}
                                    className="w-full p-2 border border-gray-300 text-gray-500 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                >
                                    <option value="all">All Colors</option>
                                    {colors.map(color => (
                                        <option key={color} value={color}>{color}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Availability Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Availability
                                </label>
                                <select
                                    value={selectedAvailability}
                                    onChange={(e) => setSelectedAvailability(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-500"
                                >
                                    <option value="all">All</option>
                                    {availabilities.map(availability => (
                                        <option key={availability} value={availability}>
                                            {availability.split('-').map(word =>
                                                word.charAt(0).toUpperCase() + word.slice(1)
                                            ).join(' ')}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price Range: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                                </label>
                                <div className="space-y-2">
                                    <input
                                        type="range"
                                        min="0"
                                        max="300"
                                        value={priceRange[0]}
                                        onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                                        className="w-full"
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max="300"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            {/* Selected Count */}
                            {selectedGranites.length > 0 && (
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                    <p className="text-sm font-medium text-amber-800">
                                        {selectedGranites.length} granite(s) selected
                                    </p>
                                    <Link
                                        href={`/enquiry?granites=${selectedGranites.join(',')}`}
                                        className="inline-block mt-2 text-sm text-amber-600 hover:text-amber-700 font-medium"
                                    >
                                        Create Enquiry →
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Top Controls */}
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-600">
                                        {filteredGranites.length} of {granites.length} granites
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-amber-100 text-amber-600' : 'text-gray-400 hover:text-gray-600'}`}
                                        >
                                            <Grid3X3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 rounded ${viewMode === 'list' ? 'bg-amber-100 text-amber-600' : 'text-gray-400 hover:text-gray-600'}`}
                                        >
                                            <List className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <select
                                        value={`${sortBy}-${sortOrder}`}
                                        onChange={(e) => {
                                            const [field, order] = e.target.value.split('-');
                                            setSortBy(field as 'name' | 'price' | 'popularity');
                                            setSortOrder(order as 'asc' | 'desc');
                                        }}
                                        className="px-3 py-2 border border-gray-300 text-gray-500 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                                    >
                                        <option value="name-asc">Name A-Z</option>
                                        <option value="name-desc">Name Z-A</option>
                                        <option value="price-asc">Price Low-High</option>
                                        <option value="price-desc">Price High-Low</option>
                                        <option value="popularity-desc">Most Popular</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Granite Grid/List */}
                        <div className={`grid gap-6 ${viewMode === 'grid'
                                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                                : 'grid-cols-1'
                            }`}>
                            {filteredGranites.map((granite) => (
                                <div
                                    key={granite.id}
                                    className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group ${viewMode === 'list' ? 'flex' : ''
                                        }`}
                                >
                                    {/* Image */}
                                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-64 flex-shrink-0' : 'h-48'}`}>
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
                                            <span className={`text-xs font-bold px-2 py-1 rounded text-white ${granite.availability === 'in-stock' ? 'bg-green-600' :
                                                    granite.availability === 'pre-order' ? 'bg-orange-600' : 'bg-red-600'
                                                }`}>
                                                {granite.availability.split('-').map(word =>
                                                    word.charAt(0).toUpperCase() + word.slice(1)
                                                ).join(' ')}
                                            </span>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => toggleFavorite(granite.id)}
                                                className={`p-2 rounded-full ${favorites.includes(granite.id)
                                                        ? 'bg-red-500 text-white'
                                                        : 'bg-white text-gray-600 hover:text-red-500'
                                                    } shadow-md transition-colors`}
                                            >
                                                <Heart className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => toggleSelection(granite.id)}
                                                className={`p-2 rounded-full ${selectedGranites.includes(granite.id)
                                                        ? 'bg-amber-500 text-white'
                                                        : 'bg-white text-gray-600 hover:text-amber-500'
                                                    } shadow-md transition-colors`}
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* 3D View Overlay */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Link
                                                href={`/granites/${granite.id}`}
                                                className="bg-white/20 backdrop-blur-md text-white py-2 px-4 rounded-lg font-semibold flex items-center gap-2 hover:bg-white/30 transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View in 3D
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                                                {granite.name}
                                            </h3>
                                            <span className="text-lg font-bold text-amber-600">
                                                {formatCurrency(granite.price)}/{granite.priceUnit}
                                            </span>
                                        </div>

                                        <p className="text-gray-600 mb-4 line-clamp-2">
                                            {granite.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                                                {granite.category}
                                            </span>
                                            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
                                                {granite.color}
                                            </span>
                                            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded">
                                                {granite.origin}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-gray-500">
                                                Stock: {granite.sizes[0]?.stock || 0} slabs
                                            </div>
                                            <Link
                                                href={`/granites/${granite.id}`}
                                                className="text-amber-600 hover:text-amber-700 font-semibold text-sm flex items-center gap-1 transition-colors"
                                            >
                                                View Details
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* No Results */}
                        {filteredGranites.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">
                                    <Search className="w-16 h-16 mx-auto text-black" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No granites found
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Try adjusting your filters or search terms.
                                </p>
                                <Button onClick={clearFilters} variant="outline">
                                    Clear Filters
                                </Button>
                            </div>
                        )}

                        {/* Selected Items Action Bar */}
                        {selectedGranites.length > 0 && (
                            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-4 border border-gray-200 z-40">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-gray-700">
                                        {selectedGranites.length} selected
                                    </span>
                                    <Link
                                        href={`/enquiry?granites=${selectedGranites.join(',')}`}
                                        className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-700 transition-all duration-200"
                                    >
                                        Create Enquiry
                                    </Link>
                                    <button
                                        onClick={() => setSelectedGranites([])}
                                        className="text-gray-500 hover:text-gray-700 text-sm"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}