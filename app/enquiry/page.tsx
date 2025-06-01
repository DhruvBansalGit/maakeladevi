'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  X, 
  Plus, 
  Minus, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Building, 
  Calendar,
  IndianRupee,
  FileText,
  Send,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Granite, EnquiryFormData, SelectedGranite } from '@/types';
import { formatCurrency, isValidEmail, isValidIndianPhone } from '@/utils/helpers';
import Button from '@/components/common/Button';

// Mock granite data - replace with API call
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
      { id: '1', url: '/images/granites/kashmir-white.jpg', alt: 'Kashmir White', type: 'primary', order: 1 }
    ],
    specifications: {
      density: 2.6, porosity: 0.5, compressiveStrength: 200, flexuralStrength: 15,
      abrasionResistance: 'High', frostResistance: true, acidResistance: 'Medium',
      applications: ['Kitchen Countertops', 'Bathroom Vanities']
    },
    sizes: [
      { id: '1', length: 3000, width: 1500, thickness: 20, unit: 'mm', stock: 25, price: 150 },
      { id: '2', length: 2400, width: 1200, thickness: 20, unit: 'mm', stock: 15, price: 120 }
    ],
    createdAt: new Date(), updatedAt: new Date(), featured: true, popular: true
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
      { id: '2', url: '/images/granites/black-galaxy.jpg', alt: 'Black Galaxy', type: 'primary', order: 1 }
    ],
    specifications: {
      density: 2.7, porosity: 0.3, compressiveStrength: 220, flexuralStrength: 18,
      abrasionResistance: 'Very High', frostResistance: true, acidResistance: 'High',
      applications: ['Kitchen Countertops', 'Feature Walls']
    },
    sizes: [
      { id: '3', length: 3000, width: 1500, thickness: 20, unit: 'mm', stock: 15, price: 200 }
    ],
    createdAt: new Date(), updatedAt: new Date(), featured: true, popular: false
  }
};

export default function EnquiryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedGranites, setSelectedGranites] = useState<SelectedGranite[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form data state
  const [formData, setFormData] = useState<EnquiryFormData>({
    customerInfo: {
      name: '',
      email: '',
      phone: '',
      alternatePhone: '',
      address: {
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India'
      },
      company: '',
      source: 'website'
    },
    selectedGranites: [],
    projectDetails: {
      projectType: 'residential',
      application: 'kitchen',
      timeline: 'flexible',
      budget: {
        min: 50000,
        max: 200000,
        currency: 'INR'
      },
      installationRequired: true,
      designConsultationRequired: false,
      measurementRequired: true,
      description: ''
    },
    additionalNotes: ''
  });

  // Load granites from URL params or localStorage
  useEffect(() => {
    const graniteIds = searchParams.get('granites');
    const storedEnquiry = localStorage.getItem('enquiryItems');
    
    let graniteItems: any[] = [];
    
    if (graniteIds) {
      // From URL params
      graniteItems = graniteIds.split(',').map(id => ({
        graniteId: id,
        selectedSize: mockGranites[id]?.sizes[0],
        selectedFinish: mockGranites[id]?.finish[0],
        selectedThickness: mockGranites[id]?.thickness[0],
        quantity: 1
      }));
    } else if (storedEnquiry) {
      // From localStorage
      graniteItems = JSON.parse(storedEnquiry);
    }

    // Convert to SelectedGranite format
    const selectedItems: SelectedGranite[] = graniteItems
      .filter(item => mockGranites[item.graniteId])
      .map(item => ({
        graniteId: item.graniteId,
        granite: mockGranites[item.graniteId],
        selectedSize: item.selectedSize || mockGranites[item.graniteId].sizes[0],
        quantity: item.quantity || 1,
        selectedFinish: item.selectedFinish || mockGranites[item.graniteId].finish[0],
        selectedThickness: item.selectedThickness || mockGranites[item.graniteId].thickness[0],
        estimatedArea: calculateArea(item.selectedSize || mockGranites[item.graniteId].sizes[0]),
        unit: 'sqft'
      }));

    setSelectedGranites(selectedItems);
    setFormData(prev => ({ ...prev, selectedGranites: selectedItems }));
  }, [searchParams]);

  const calculateArea = (size: any) => {
    if (!size) return 0;
    return Math.round((size.length * size.width) / 92903) / 100; // Convert mm² to sq ft
  };

  const updateGraniteQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updated = [...selectedGranites];
    updated[index].quantity = newQuantity;
    updated[index].estimatedArea = calculateArea(updated[index].selectedSize) * newQuantity;
    
    setSelectedGranites(updated);
    setFormData(prev => ({ ...prev, selectedGranites: updated }));
  };

  const removeGranite = (index: number) => {
    const updated = selectedGranites.filter((_, i) => i !== index);
    setSelectedGranites(updated);
    setFormData(prev => ({ ...prev, selectedGranites: updated }));
  };

  const updateFormData = (section: keyof EnquiryFormData, field: string, value: any) => {
    setFormData(prev => {
      if (section === 'additionalNotes') {
        return {
          ...prev,
          [section]: value
        };
      }
      
      const sectionData = prev[section];
      if (typeof sectionData === 'object' && sectionData !== null) {
        return {
          ...prev,
          [section]: {
            ...sectionData,
            [field]: value
          }
        };
      }
      
      return prev;
    });
    
    // Clear error when user starts typing
    if (errors[`${section}.${field}`]) {
      setErrors(prev => ({ ...prev, [`${section}.${field}`]: '' }));
    }
  };

  const updateNestedFormData = (section: keyof EnquiryFormData, subsection: string, field: string, value: any) => {
    setFormData(prev => {
      const sectionData = prev[section];
      if (typeof sectionData === 'object' && sectionData !== null && subsection in sectionData) {
        const subsectionData = (sectionData as any)[subsection];
        if (typeof subsectionData === 'object' && subsectionData !== null) {
          return {
            ...prev,
            [section]: {
              ...sectionData,
              [subsection]: {
                ...subsectionData,
                [field]: value
              }
            }
          };
        }
      }
      return prev;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Customer info validation
    if (!formData.customerInfo.name.trim()) {
      newErrors['customerInfo.name'] = 'Name is required';
    }
    
    if (!formData.customerInfo.email.trim()) {
      newErrors['customerInfo.email'] = 'Email is required';
    } else if (!isValidEmail(formData.customerInfo.email)) {
      newErrors['customerInfo.email'] = 'Please enter a valid email';
    }
    
    if (!formData.customerInfo.phone.trim()) {
      newErrors['customerInfo.phone'] = 'Phone number is required';
    } else if (!isValidIndianPhone(formData.customerInfo.phone)) {
      newErrors['customerInfo.phone'] = 'Please enter a valid Indian phone number';
    }

    // Address validation
    if (!formData.customerInfo.address.street.trim()) {
      newErrors['customerInfo.address.street'] = 'Street address is required';
    }
    if (!formData.customerInfo.address.city.trim()) {
      newErrors['customerInfo.address.city'] = 'City is required';
    }
    if (!formData.customerInfo.address.state.trim()) {
      newErrors['customerInfo.address.state'] = 'State is required';
    }
    if (!formData.customerInfo.address.pincode.trim()) {
      newErrors['customerInfo.address.pincode'] = 'Pincode is required';
    }

    // Granite selection validation
    if (selectedGranites.length === 0) {
      newErrors['selectedGranites'] = 'Please select at least one granite';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
    return selectedGranites.reduce((total, item) => {
      return total + (item.selectedSize.price * item.quantity);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          totalValue: calculateTotal()
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        localStorage.removeItem('enquiryItems'); // Clear stored items
        
        // Simulate sending email and WhatsApp
        setTimeout(() => {
          router.push('/enquiry/success');
        }, 2000);
      } else {
        throw new Error('Failed to submit enquiry');
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-4 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Enquiry Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your enquiry. We'll contact you within 24 hours with a detailed quote.
          </p>
          <div className="space-y-3">
            <Link href="/granites">
              <Button className="w-full">Continue Shopping</Button>
            </Link>
            <Link href="/" className="block text-amber-600 hover:text-amber-700">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Enquiry</h1>
              <p className="text-gray-600">Fill in your details to get a personalized quote</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.customerInfo.name}
                    onChange={(e) => updateFormData('customerInfo', 'name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      errors['customerInfo.name'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors['customerInfo.name'] && (
                    <p className="text-red-500 text-sm mt-1">{errors['customerInfo.name']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.customerInfo.email}
                    onChange={(e) => updateFormData('customerInfo', 'email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      errors['customerInfo.email'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors['customerInfo.email'] && (
                    <p className="text-red-500 text-sm mt-1">{errors['customerInfo.email']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.customerInfo.phone}
                    onChange={(e) => updateFormData('customerInfo', 'phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      errors['customerInfo.phone'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+91 98765 43210"
                  />
                  {errors['customerInfo.phone'] && (
                    <p className="text-red-500 text-sm mt-1">{errors['customerInfo.phone']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alternate Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.customerInfo.alternatePhone || ''}
                    onChange={(e) => updateFormData('customerInfo', 'alternatePhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="+91 87654 32109"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company/Organization
                  </label>
                  <input
                    type="text"
                    value={formData.customerInfo.company || ''}
                    onChange={(e) => updateFormData('customerInfo', 'company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Your company name (optional)"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Address Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={formData.customerInfo.address.street}
                    onChange={(e) => updateNestedFormData('customerInfo', 'address', 'street', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      errors['customerInfo.address.street'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="House/Building number, Street name"
                  />
                  {errors['customerInfo.address.street'] && (
                    <p className="text-red-500 text-sm mt-1">{errors['customerInfo.address.street']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.customerInfo.address.city}
                    onChange={(e) => updateNestedFormData('customerInfo', 'address', 'city', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      errors['customerInfo.address.city'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Your city"
                  />
                  {errors['customerInfo.address.city'] && (
                    <p className="text-red-500 text-sm mt-1">{errors['customerInfo.address.city']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <select
                    value={formData.customerInfo.address.state}
                    onChange={(e) => updateNestedFormData('customerInfo', 'address', 'state', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      errors['customerInfo.address.state'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select State</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    {/* Add more states */}
                  </select>
                  {errors['customerInfo.address.state'] && (
                    <p className="text-red-500 text-sm mt-1">{errors['customerInfo.address.state']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    value={formData.customerInfo.address.pincode}
                    onChange={(e) => updateNestedFormData('customerInfo', 'address', 'pincode', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      errors['customerInfo.address.pincode'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="122001"
                  />
                  {errors['customerInfo.address.pincode'] && (
                    <p className="text-red-500 text-sm mt-1">{errors['customerInfo.address.pincode']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.customerInfo.address.country}
                    onChange={(e) => updateNestedFormData('customerInfo', 'address', 'country', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="India"
                  />
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Building className="w-5 h-5" />
                Project Details
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Type
                  </label>
                  <select
                    value={formData.projectDetails.projectType}
                    onChange={(e) => updateFormData('projectDetails', 'projectType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application
                  </label>
                  <select
                    value={formData.projectDetails.application}
                    onChange={(e) => updateFormData('projectDetails', 'application', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="kitchen">Kitchen Countertops</option>
                    <option value="bathroom">Bathroom Vanities</option>
                    <option value="flooring">Flooring</option>
                    <option value="wall-cladding">Wall Cladding</option>
                    <option value="outdoor">Outdoor Applications</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline
                  </label>
                  <select
                    value={formData.projectDetails.timeline}
                    onChange={(e) => updateFormData('projectDetails', 'timeline', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="immediate">Immediate (Within 2 weeks)</option>
                    <option value="1-month">Within 1 month</option>
                    <option value="3-months">Within 3 months</option>
                    <option value="6-months">Within 6 months</option>
                    <option value="flexible">Flexible timeline</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={formData.projectDetails.budget.min}
                      onChange={(e) => updateNestedFormData('projectDetails', 'budget', 'min', parseInt(e.target.value))}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      value={formData.projectDetails.budget.max}
                      onChange={(e) => updateNestedFormData('projectDetails', 'budget', 'max', parseInt(e.target.value))}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Max"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.projectDetails.installationRequired}
                      onChange={(e) => updateFormData('projectDetails', 'installationRequired', e.target.checked)}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Installation service required</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.projectDetails.designConsultationRequired}
                      onChange={(e) => updateFormData('projectDetails', 'designConsultationRequired', e.target.checked)}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Design consultation required</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.projectDetails.measurementRequired}
                      onChange={(e) => updateFormData('projectDetails', 'measurementRequired', e.target.checked)}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Site measurement required</span>
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Description
                  </label>
                  <textarea
                    value={formData.projectDetails.description || ''}
                    onChange={(e) => updateFormData('projectDetails', 'description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Tell us more about your project..."
                  />
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Additional Notes
              </h2>
              
              <textarea
                value={formData.additionalNotes || ''}
                onChange={(e) => updateFormData('additionalNotes', '', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Any special requirements, preferences, or additional information..."
              />
            </div>
          </div>

          {/* Sidebar - Selected Granites & Summary */}
          <div className="space-y-6">
            {/* Selected Granites */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Selected Granites</h2>
              
              {errors['selectedGranites'] && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors['selectedGranites']}
                  </p>
                </div>
              )}

              {selectedGranites.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <FileText className="w-12 h-12 mx-auto" />
                  </div>
                  <p className="text-gray-600 mb-4">No granites selected</p>
                  <Link href="/granites">
                    <Button variant="outline" size="sm">
                      Browse Granites
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedGranites.map((item, index) => (
                    <div key={`${item.graniteId}-${index}`} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex gap-3">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.granite.images[0]?.url || '/images/placeholder-granite.jpg'}
                            alt={item.granite.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900 truncate">{item.granite.name}</h3>
                              <p className="text-sm text-gray-600">
                                {item.selectedSize.length} × {item.selectedSize.width} × {item.selectedThickness}mm
                              </p>
                              <p className="text-sm text-gray-600">Finish: {item.selectedFinish}</p>
                            </div>
                            <button
                              onClick={() => removeGranite(index)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateGraniteQuantity(index, item.quantity - 1)}
                                className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-sm">{item.quantity}</span>
                              <button
                                onClick={() => updateGraniteQuantity(index, item.quantity + 1)}
                                className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-gray-900">
                                {formatCurrency(item.selectedSize.price * item.quantity)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {item.estimatedArea.toFixed(2)} sq ft
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4">
                    <Link href="/granites" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                      + Add more granites
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            {selectedGranites.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(calculateTotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Items:</span>
                    <span className="font-medium">{selectedGranites.reduce((sum, item) => sum + item.quantity, 0)} slabs</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Area:</span>
                    <span className="font-medium">
                      {selectedGranites.reduce((sum, item) => sum + item.estimatedArea, 0).toFixed(2)} sq ft
                    </span>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Estimated Total:</span>
                      <span className="text-lg font-bold text-amber-600">{formatCurrency(calculateTotal())}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      *Final price may vary based on measurements and installation requirements
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-2"
                size="lg"
                loading={isSubmitting}
                disabled={selectedGranites.length === 0}
              >
                <Send className="w-5 h-5" />
                {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
              </Button>
              
              {submitStatus === 'error' && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Failed to submit enquiry. Please try again.
                  </p>
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-3 text-center">
                By submitting this enquiry, you agree to our terms of service and privacy policy.
              </p>
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
              <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>sales@premiumstone.com</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Our team is available Mon-Sat, 9 AM - 7 PM to assist you.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}