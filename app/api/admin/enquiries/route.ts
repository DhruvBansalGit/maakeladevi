import { NextRequest, NextResponse } from 'next/server';
import { enquiryService } from '@/lib/services/enquiryService';
import { EnquiryFormData } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const priority = searchParams.get('priority') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let enquiries = await enquiryService.getAllEnquiries();

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      enquiries = enquiries.filter(enquiry => 
        enquiry.customerInfo.name.toLowerCase().includes(searchLower) ||
        enquiry.customerInfo.email.toLowerCase().includes(searchLower) ||
        enquiry.customerInfo.phone.includes(search) ||
        enquiry.id.toLowerCase().includes(searchLower)
      );
    }

    if (status && status !== 'all') {
      enquiries = enquiries.filter(enquiry => enquiry.status === status);
    }

    if (priority && priority !== 'all') {
      enquiries = enquiries.filter(enquiry => enquiry.priority === priority);
    }

    // Sort by creation date (newest first)
    enquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Pagination
    const total = enquiries.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedEnquiries = enquiries.slice(startIndex, startIndex + limit);

    // Calculate stats
    const stats = {
      total: enquiries.length,
      new: enquiries.filter(e => e.status === 'new').length,
      pending: enquiries.filter(e => e.status === 'pending').length,
      contacted: enquiries.filter(e => e.status === 'contacted').length,
      quoted: enquiries.filter(e => e.status === 'quoted').length,
      completed: enquiries.filter(e => e.status === 'completed').length,
      cancelled: enquiries.filter(e => e.status === 'cancelled').length,
      totalValue: enquiries.reduce((sum, e) => sum + (e.totalEstimatedCost || 0), 0),
      averageValue: enquiries.length > 0 ? enquiries.reduce((sum, e) => sum + (e.totalEstimatedCost || 0), 0) / enquiries.length : 0,
      highPriority: enquiries.filter(e => e.priority === 'high' || e.priority === 'urgent').length,
    };

    return NextResponse.json({
      success: true,
      data: paginatedEnquiries,
      stats,
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

export async function POST(request: NextRequest) {
  try {
    const enquiryData: EnquiryFormData & { totalValue?: number } = await request.json();

    // Validate required fields
    if (!enquiryData.customerInfo?.name || !enquiryData.customerInfo?.email) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Customer name and email are required' 
          } 
        },
        { status: 400 }
      );
    }

    if (!enquiryData.selectedGranites || enquiryData.selectedGranites.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'At least one granite must be selected' 
          } 
        },
        { status: 400 }
      );
    }

    const newEnquiry = await enquiryService.createEnquiry(enquiryData);

    return NextResponse.json({
      success: true,
      data: {
        enquiryId: newEnquiry.id,
        status: newEnquiry.status,
        estimatedResponseTime: '2-4 hours',
        message: 'Enquiry submitted successfully. You will receive a confirmation email shortly.'
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating enquiry:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: 'Failed to submit enquiry' 
        } 
      },
      { status: 500 }
    );
  }
}
