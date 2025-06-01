'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, User, Mail, Phone, MapPin, FileText, Send, AlertCircle } from 'lucide-react';
import { Granite, EnquiryFormData } from '@/types';
import { formatCurrency, isValidEmail, isValidIndianPhone } from '@/utils/helpers';
import Button from '@/components/common/Button';

interface EnquiryFormProps {
  granite?: Granite;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: EnquiryFormData) => void;
}

export default function EnquiryForm({ granite, isOpen, onClose, onSubmit }: EnquiryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    selectedGranites: granite ? [{
      graniteId: granite.id,
      granite: granite,
      selectedSize: granite.sizes[0],
      quantity: 1,
      selectedFinish: granite.finish[0],
      selectedThickness: granite.thickness[0],
      estimatedArea: calculateArea(granite.sizes[0]),
      unit: 'sqft'
    }] : [],
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

  function calculateArea(size: any) {
    if (!size) return 0;
    return Math.round((size.length * size.width) / 92903) / 100; // Convert mm² to sq ft
  }

  const updateFormData = (section: keyof EnquiryFormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object' 
        ? { ...prev[section], [field]: value }
        : value
    }));
    
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
    if (!formData.customerInfo.address.city.trim()) {
      newErrors['customerInfo.address.city'] = 'City is required';
    }
    if (!formData.customerInfo.address.state.trim()) {
      newErrors['customerInfo.address.state'] = 'State is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSubmit) {
        onSubmit(formData);
      } else {
        // Default behavior - redirect to enquiry page
        if (granite) {
          localStorage.setItem('enquiryItems', JSON.stringify([{
            graniteId: granite.id,
            selectedSize: formData.selectedGranites[0]?.selectedSize,
            selectedFinish: formData.selectedGranites[0]?.selectedFinish,
            selectedThickness: formData.selectedGranites[0]?.selectedThickness,
            quantity: formData.selectedGranites[0]?.quantity || 1
          }]));
        }
        
        router.push('/enquiry');
      }
      
      onClose();
    } catch (error) {
      console.error('Error submitting enquiry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Quick Enquiry</h2>
            {granite && (
              <p className="text-gray-600">For {granite.name}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Selected Granite Display */}
          {granite && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Selected Granite</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div>
                  <p className="font-medium">{granite.name}</p>
                  <p className="text-sm text-gray-600">{formatCurrency(granite.price)}/{granite.priceUnit}</p>
                </div>
              </div>
            </div>
          )}

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Information
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company (Optional)
                </label>
                <input
                  type="text"
                  value={formData.customerInfo.company || ''}
                  onChange={(e) => updateFormData('customerInfo', 'company', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Your company name"
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="West Bengal">West Bengal</option>
                </select>
                {errors['customerInfo.address.state'] && (
                  <p className="text-red-500 text-sm mt-1">{errors['customerInfo.address.state']}</p>
                )}
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Project Details
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
            </div>

            <div className="space-y-3">
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
                  checked={formData.projectDetails.measurementRequired}
                  onChange={(e) => updateFormData('projectDetails', 'measurementRequired', e.target.checked)}
                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="ml-2 text-sm text-gray-700">Site measurement required</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                value={formData.additionalNotes || ''}
                onChange={(e) => updateFormData('additionalNotes', '', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Any specific requirements or questions..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
            </Button>
          </div>

          {/* Footer Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              Our team will contact you within 2-4 hours to discuss your requirements and schedule a site visit.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}