'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
    ArrowLeft,
    Heart,
    ShoppingCart,
    Share2,
    Download,
    Eye,
    Layers,
    Palette,
    MapPin,
    CheckCircle,
    AlertCircle,
    Star
} from 'lucide-react';
import { Granite } from '@/types';
import { formatCurrency } from '@/utils/helpers';
import Button from '@/components/common/Button';
import Simple3DViewer from '@/components/granite/Simple3DViewer'

// Mock data - replace with API call
const mockGranites: Record<string, Granite> = {
    '1': {
        id: '1',
        name: 'Kashmir White',
        description: 'Elegant white granite with subtle gray veining',
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
            {
                id: '1',
                url: '/images/granites/kashmir-white.jpg',
                alt: 'Kashmir White Granite',
                type: 'primary',
                order: 1
            }
        ],
        specifications: {
            density: 2.6, porosity: 0.5, compressiveStrength: 200, flexuralStrength: 15,
            abrasionResistance: 'High', frostResistance: true, acidResistance: 'Medium',
            applications: ['Kitchen Countertops', 'Bathroom Vanities']
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
    '2': {
        id: '2',
        name: 'Black Galaxy',
        description: 'Stunning black granite with golden speckles',
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
            {
                id: '2',
                url: '/images/granites/black-galaxy.jpg',  // ← DIFFERENT IMAGE
                alt: 'Black Galaxy Granite',
                type: 'primary',
                order: 1
            },{
                id: '5',
                url: '/images/granites/black-galaxy-2.jpg',  // ← DIFFERENT IMAGE
                alt: 'Black Galaxy Granite',
                type: 'primary',
                order: 1
            }
        ],
        specifications: {
            density: 2.7, porosity: 0.3, compressiveStrength: 220, flexuralStrength: 18,
            abrasionResistance: 'Very High', frostResistance: true, acidResistance: 'High',
            applications: ['Kitchen Countertops', 'Feature Walls']
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
    '3': {
        id: '3',
        name: 'Tan Brown',
        description: 'Warm brown granite with natural patterns',
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
            {
                id: '3',
                url: '/images/granites/tan-brown.jpg',  // ← DIFFERENT IMAGE
                alt: 'Tan Brown Granite',
                type: 'primary',
                order: 1
            }
        ],
        specifications: {
            density: 2.65, porosity: 0.4, compressiveStrength: 180, flexuralStrength: 14,
            abrasionResistance: 'High', frostResistance: true, acidResistance: 'Medium',
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
    },'4': {
        id: '4',
        name: 'Imperial Red',
        description: 'Stunning black granite with red speckles',
        price: 200,
        priceUnit: 'sqft',
        category: 'premium',
        origin: 'India',
        color: 'Red',
        pattern: 'Speckled',
        finish: ['Polished', 'Honed'],
        thickness: [18, 20, 30],
        availability: 'in-stock',
        images: [
            {
                id: '2',
                url: '/images/granites/imperial-red.jpg',  // ← DIFFERENT IMAGE
                alt: 'Imperail Red Granite',
                type: 'primary',
                order: 1
            }
        ],
        specifications: {
            density: 2.7, porosity: 0.3, compressiveStrength: 220, flexuralStrength: 18,
            abrasionResistance: 'Very High', frostResistance: true, acidResistance: 'High',
            applications: ['Kitchen Countertops', 'Feature Walls']
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
};

export default function GraniteDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [granite, setGranite] = useState<Granite | null>(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState(0);
    const [selectedFinish, setSelectedFinish] = useState(0);
    const [selectedThickness, setSelectedThickness] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showSpecs, setShowSpecs] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [show3D, setShow3D] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const graniteId = params.id as string;
        console.log('🔍 Loading granite with ID:', graniteId);

        // Simulate loading delay
        setLoading(true);

        setTimeout(() => {
            const foundGranite = mockGranites[graniteId];

            if (foundGranite) {
                console.log('✅ Granite found:', foundGranite.name);
                console.log('📸 Granite images:', foundGranite.images);
                setGranite(foundGranite);
                setError(null);
            } else {
                console.error('❌ Granite not found for ID:', graniteId);
                setError('Granite not found');
            }

            setLoading(false);
        }, 500);

    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="spinner mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading granite details...</p>
                </div>
            </div>
        );
    }

    if (error || !granite) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Granite Not Found</h2>
                    <p className="text-gray-600 mb-6">The granite you&apos;re looking for doesn&apos;t exist.</p>
                    <Link href="/granites">
                        <Button>Back to Collection</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const calculatePrice = () => {
        const selectedSizeData = granite.sizes[selectedSize];
        // const area = (selectedSizeData.length * selectedSizeData.width) / 1000000; // Convert mm² to m²
        // const areaInSqFt = area * 10.764; // Convert m² to sq ft
        return selectedSizeData.price * quantity;
    };

    const handleAddToEnquiry = () => {
        // Add to local storage or global state
        const enquiryItem = {
            graniteId: granite.id,
            selectedSize: granite.sizes[selectedSize],
            selectedFinish: granite.finish[selectedFinish],
            selectedThickness: granite.thickness[selectedThickness],
            quantity
        };

        const existingEnquiry = JSON.parse(localStorage.getItem('enquiryItems') || '[]');
        const updatedEnquiry = [...existingEnquiry, enquiryItem];
        localStorage.setItem('enquiryItems', JSON.stringify(updatedEnquiry));

        // Navigate to enquiry form
        router.push('/enquiry');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-amber-600">Home</Link>
                        <span>/</span>
                        <Link href="/granites" className="hover:text-amber-600">Granites</Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">{granite.name}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Collection
                </button>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Images & 3D Viewer */}
                    <div className="space-y-4">
                        {/* Main Image/3D Viewer */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="relative h-96 lg:h-[500px]">
                                {show3D ? (
                                    <Simple3DViewer
                                        granite={granite}
                                        className="w-full h-[500px]"
                                        modelType="slab"
                                    />
                                ) : (
                                    <Image
                                        src={granite.images[0]?.url || '/images/placeholder-granite.jpg'}
                                        alt={granite.images[0]?.alt || granite.name}
                                        fill
                                        className="w-full h-full object-cover"
                                    />
                                )}

                                {/* Toggle 3D Button */}
                                <button
                                    onClick={() => setShow3D(!show3D)}
                                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 p-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-white transition-colors shadow-lg"
                                >
                                    {show3D ? <Eye className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
                                    {show3D ? 'View Photos' : 'View in 3D'}
                                </button>

                                {/* Badges */}
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    {granite.featured && (
                                        <span className="bg-amber-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                                            FEATURED
                                        </span>
                                    )}
                                    {granite.popular && (
                                        <span className="bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                                            POPULAR
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Thumbnail Gallery */}
                        <div className="grid grid-cols-4 gap-3">
                            {granite.images.filter(img => img.type !== '3d-texture').map((image, index) => (
                                <button
                                    key={image.id}
                                    onClick={() => {
                                        setSelectedImage(index);
                                        setShow3D(false);
                                    }}
                                    className={`relative h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index && !show3D
                                            ? 'border-amber-500'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <Image
                                        src={image.url}
                                        alt={image.alt}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                            {/* 3D View Thumbnail */}
                            <button
                                onClick={() => setShow3D(true)}
                                className={`relative h-20 rounded-lg overflow-hidden border-2 transition-colors bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ${show3D ? 'border-amber-500' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <Layers className="w-6 h-6 text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        {/* Header */}
                        <div>
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{granite.name}</h1>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            <span>{granite.origin}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Palette className="w-4 h-4" />
                                            <span>{granite.color}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span>4.8 (24 reviews)</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsFavorite(!isFavorite)}
                                        className={`p-3 rounded-lg border transition-colors ${isFavorite
                                                ? 'bg-red-50 border-red-200 text-red-600'
                                                : 'bg-white border-gray-200 text-gray-600 hover:text-red-500'
                                            }`}
                                    >
                                        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                                    </button>
                                    <button className="p-3 rounded-lg border bg-white border-gray-200 text-gray-600 hover:text-blue-500 transition-colors">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <p className="text-gray-700 leading-relaxed">{granite.description}</p>
                        </div>

                        {/* Price */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <div className="text-3xl font-bold text-amber-600">
                                        {formatCurrency(granite.sizes[selectedSize]?.price || granite.price)}
                                        <span className="text-lg text-gray-600">/{granite.priceUnit}</span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Total: {formatCurrency(calculatePrice())}
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-sm font-medium ${granite.availability === 'in-stock'
                                        ? 'bg-green-100 text-green-800'
                                        : granite.availability === 'pre-order'
                                            ? 'bg-orange-100 text-orange-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                    {granite.availability === 'in-stock' && <CheckCircle className="w-4 h-4 inline mr-1" />}
                                    {granite.availability.split('-').map(word =>
                                        word.charAt(0).toUpperCase() + word.slice(1)
                                    ).join(' ')}
                                </div>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="space-y-4">
                            {/* Size Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Size (L × W × T)
                                </label>
                                <div className="grid grid-cols-1 gap-2">
                                    {granite.sizes.map((size, index) => (
                                        <button
                                            key={size.id}
                                            onClick={() => setSelectedSize(index)}
                                            className={`p-3 border rounded-lg text-left transition-colors ${selectedSize === index
                                                    ? 'border-amber-500 bg-amber-50 text-amber-700'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">
                                                    {size.length} × {size.width} × {size.thickness} {size.unit}
                                                </span>
                                                <div className="text-right">
                                                    <div className="font-bold text-amber-600">{formatCurrency(size.price)}</div>
                                                    <div className="text-xs text-gray-500">{size.stock} available</div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Finish Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Finish
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {granite.finish.map((finish, index) => (
                                        <button
                                            key={finish}
                                            onClick={() => setSelectedFinish(index)}
                                            className={`p-3 border rounded-lg text-center transition-colors ${selectedFinish === index
                                                    ? 'border-amber-500 bg-amber-50 text-amber-700'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-500'
                                                }`}
                                        >
                                            {finish}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Thickness Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Thickness (mm)
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {granite.thickness.map((thickness, index) => (
                                        <button
                                            key={thickness}
                                            onClick={() => setSelectedThickness(index)}
                                            className={`p-3 border rounded-lg text-center transition-colors ${selectedThickness === index
                                                    ? 'border-amber-500 bg-amber-50 text-amber-700'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-500'
                                                }`}
                                        >
                                            {thickness}mm
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quantity (Slabs)
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500"
                                    >
                                        -
                                    </button>
                                    <span className="w-16 text-center font-medium text-gray-500">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <Button
                                onClick={handleAddToEnquiry}
                                className="w-full flex items-center justify-center gap-2"
                                size="lg"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Add to Enquiry
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2"
                                size="lg"
                            >
                                <Download className="w-5 h-5" />
                                Download Specification Sheet
                            </Button>
                        </div>

                        {/* Specifications Toggle */}
                        <button
                            onClick={() => setShowSpecs(!showSpecs)}
                            className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-900">Technical Specifications</span>
                                <span className={`transform transition-transform ${showSpecs ? 'rotate-180' : ''}`}>
                                    ▼
                                </span>
                            </div>
                        </button>

                        {/* Specifications Content */}
                        {showSpecs && (
                            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Density:</span>
                                        <span className="ml-2 font-medium">{granite.specifications.density} g/cm³</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Porosity:</span>
                                        <span className="ml-2 font-medium">{granite.specifications.porosity}%</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Compressive Strength:</span>
                                        <span className="ml-2 font-medium">{granite.specifications.compressiveStrength} MPa</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Flexural Strength:</span>
                                        <span className="ml-2 font-medium">{granite.specifications.flexuralStrength} MPa</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Abrasion Resistance:</span>
                                        <span className="ml-2 font-medium">{granite.specifications.abrasionResistance}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Acid Resistance:</span>
                                        <span className="ml-2 font-medium">{granite.specifications.acidResistance}</span>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-gray-600 text-sm">Applications:</span>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {granite.specifications.applications.map((app, index) => (
                                            <span
                                                key={index}
                                                className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded"
                                            >
                                                {app}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {/* This would be populated with related granites */}
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                                <div className="p-4">
                                    <h3 className="font-medium text-gray-900 mb-2">Related Granite {item}</h3>
                                    <div className="text-amber-600 font-bold">{formatCurrency(120 + item * 20)}/sqft</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}