import { NextRequest, NextResponse } from 'next/server';
import { EnquiryFormData, Enquiry, EnquiryStatus, Granite } from '@/types';
import { generateId } from '@/utils/helpers';
import { sendEnquiryEmail } from '@/lib/email';
import { sendWhatsAppNotification } from '@/lib/whatsapp';

// In a real application, these would be stored in a database
const enquiries: Enquiry[] = [];

// Mock granite data for lookup - in a real app, this would come from your database
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
    status: 'active',
    images: [
      { id: '1', url: '/images/granites/kashmir-white.jpg', alt: 'Kashmir White', type: 'primary', order: 1 }
    ],
    specifications: {
      density: 2.6, porosity: 0.5, compressiveStrength: 200, flexuralStrength: 15,
      abrasionResistance: 'High', frostResistance: true, acidResistance: 'Medium',
      applications: ['Kitchen Countertops', 'Bathroom Vanities']
    },
    sizes: [
      { id: '1', length: 3000, width: 1500, thickness: 20, unit: 'mm', stock: 25, price: 150 }
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
    status: 'active',
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

export async function POST(request: NextRequest) {
  try {
    const formData: EnquiryFormData & { totalValue: number } = await request.json();

    // Validate required fields
    if (!formData.customerInfo.name || !formData.customerInfo.email || !formData.customerInfo.phone) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Missing required customer information' } },
        { status: 400 }
      );
    }

    if (!formData.selectedGranites || formData.selectedGranites.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'No granites selected' } },
        { status: 400 }
      );
    }

    // Create enquiry object
    const enquiry: Enquiry = {
      id: generateId(),
      customerInfo: {
        ...formData.customerInfo,
        source: 'website' // Add source here since it's required for the Enquiry type
      },
      selectedGranites: formData.selectedGranites.map(item => ({
        ...item,
        // Ensure we have the granite object - in a real app, you'd fetch this from the database
        granite: item.granite || mockGranites[item.graniteId]
      })),
      projectDetails: formData.projectDetails,
      status: 'new' as EnquiryStatus,
      priority: 'medium',
      notes: formData.additionalNotes ? [{
        id: generateId(),
        content: formData.additionalNotes,
        author: 'Customer',
        type: 'customer-communication',
        createdAt: new Date()
      }] : [],
      totalEstimatedCost: formData.totalValue,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Store enquiry (in real app, save to database)
    enquiries.push(enquiry);

    // Send confirmation email to customer
    try {
      await sendEnquiryEmail({
        enquiry,
        customer: enquiry.customerInfo,
        selectedGranites: enquiry.selectedGranites,
        totalValue: enquiry.totalEstimatedCost || 0,
        adminEmail: process.env.ADMIN_EMAIL || 'admin@premiumstone.com',
        adminPhone: process.env.ADMIN_PHONE || '+91 98765 43210'
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the entire request for email issues
    }

    // Send WhatsApp notification to admin
    try {
      await sendWhatsAppNotification({
        enquiry,
        customer: enquiry.customerInfo,
        selectedGranites: enquiry.selectedGranites,
        totalValue: enquiry.totalEstimatedCost || 0,
        adminEmail: process.env.ADMIN_EMAIL || 'admin@premiumstone.com',
        adminPhone: process.env.ADMIN_PHONE || '+91 98765 43210'
      });
    } catch (whatsappError) {
      console.error('Failed to send WhatsApp notification:', whatsappError);
      // Don't fail the entire request for WhatsApp issues
    }

    return NextResponse.json({
      success: true,
      data: {
        enquiryId: enquiry.id,
        status: enquiry.status,
        estimatedResponseTime: '2-4 hours',
        message: 'Enquiry submitted successfully. You will receive a confirmation email shortly.'
      }
    });

  } catch (error) {
    console.error('Error creating enquiry:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to submit enquiry. Please try again.'
        }
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Filter enquiries
    let filteredEnquiries = [...enquiries];

    if (status && status !== 'all') {
      filteredEnquiries = filteredEnquiries.filter(enquiry => enquiry.status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredEnquiries = filteredEnquiries.filter(enquiry =>
        enquiry.customerInfo.name.toLowerCase().includes(searchLower) ||
        enquiry.customerInfo.email.toLowerCase().includes(searchLower) ||
        enquiry.customerInfo.phone.includes(search) ||
        enquiry.id.toLowerCase().includes(searchLower)
      );
    }

    // Sort enquiries
   filteredEnquiries.sort((a, b) => {
  const getValue = (e: Enquiry): string | number => {
    switch (sortBy) {
      case 'customerName':
        return e.customerInfo.name;
      case 'totalValue':
        return e.totalEstimatedCost || 0;
      case 'status':
        return e.status;
      default:
        return new Date(e.createdAt).getTime();
    }
  };

  const aVal = getValue(a);
  const bVal = getValue(b);

  return sortOrder === 'desc'
    ? bVal > aVal ? 1 : -1
    : aVal > bVal ? 1 : -1;
});


    // Paginate
    const total = filteredEnquiries.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedEnquiries = filteredEnquiries.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      data: paginatedEnquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });

  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch enquiries'
        }
      },
      { status: 500 }
    );
  }
}