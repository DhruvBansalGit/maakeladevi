'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Phone, Mail, MessageCircle, Download, Calendar, ArrowRight } from 'lucide-react';
import Button from '@/components/common/Button';

export default function EnquirySuccessPage() {
  const [enquiryId, setEnquiryId] = useState<string>('');

  useEffect(() => {
    // Generate a mock enquiry ID (in real app, this would come from the API response)
    const id = 'ENQ-' + Date.now().toString().slice(-6);
    setEnquiryId(id);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Enquiry Submitted Successfully!
            </h1>
            <p className="text-gray-600 text-lg">
              Thank you for choosing PremiumStone. Your enquiry has been received.
            </p>
          </div>

          {/* Enquiry Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="text-left">
                <span className="text-gray-600">Enquiry ID:</span>
                <div className="font-bold text-amber-600 text-lg">{enquiryId}</div>
              </div>
              <div className="text-left md:text-right">
                <span className="text-gray-600">Submitted on:</span>
                <div className="font-medium">{new Date().toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</div>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">What happens next?</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Review & Contact</h3>
                <p className="text-sm text-gray-600">
                  Our team will review your enquiry and contact you within 2-4 hours to discuss your requirements.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-amber-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Site Visit & Quote</h3>
                <p className="text-sm text-gray-600">
                  We'll schedule a site visit for measurements and provide you with a detailed quote within 24 hours.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Installation</h3>
                <p className="text-sm text-gray-600">
                  Once approved, we'll schedule the installation and complete your project with precision.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 mb-8 border border-amber-200">
            <h3 className="font-semibold text-gray-900 mb-4">Need immediate assistance?</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center justify-center gap-2 text-gray-700">
                <Phone className="w-4 h-4 text-amber-600" />
                <div className="text-sm">
                  <div className="font-medium">Call us</div>
                  <div>+91 98765 43210</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-700">
                <MessageCircle className="w-4 h-4 text-green-600" />
                <div className="text-sm">
                  <div className="font-medium">WhatsApp</div>
                  <div>+91 98765 43210</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-700">
                <Mail className="w-4 h-4 text-blue-600" />
                <div className="text-sm">
                  <div className="font-medium">Email us</div>
                  <div>sales@premiumstone.com</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/granites">
              <Button variant="outline" className="w-full sm:w-auto">
                Continue Shopping
              </Button>
            </Link>
            <Link href="/">
              <Button className="w-full sm:w-auto flex items-center gap-2">
                Back to Home
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Additional Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <button className="flex items-center justify-center gap-2 text-amber-600 hover:text-amber-700 font-medium">
                <Download className="w-4 h-4" />
                Download Enquiry Details
              </button>
              <button className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                <Calendar className="w-4 h-4" />
                Schedule a Call
              </button>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              You will receive a confirmation email at your registered email address within a few minutes. 
              Please check your spam folder if you don't see it in your inbox.
            </p>
          </div>
        </div>

        {/* Additional Information Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* Quality Assurance */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Quality Assurance</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Premium quality granite sourced directly
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Professional installation by certified experts
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                2-year warranty on installation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Free maintenance guidance
              </li>
            </ul>
          </div>

          {/* Why Choose Us */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Why Choose PremiumStone?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-500" />
                15+ years of industry experience
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-500" />
                10,000+ satisfied customers
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-500" />
                Revolutionary 3D visualization technology
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-500" />
                Competitive pricing with transparent quotes
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}