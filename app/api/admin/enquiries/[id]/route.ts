import { NextRequest, NextResponse } from 'next/server';
import { enquiryService } from '@/lib/services/enquiryService';

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').at(-1); // extract [id]

    if (!id) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Missing enquiry ID'
        }
      }, { status: 400 });
    }

    const enquiry = await enquiryService.getEnquiryById(id);

    if (!enquiry) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Enquiry not found'
          }
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: enquiry
    });
  } catch (error) {
    console.error('Error fetching enquiry:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch enquiry'
        }
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').at(-1); // extract [id]

    if (!id) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Missing enquiry ID'
        }
      }, { status: 400 });
    }

    const updateData = await request.json();
    const updatedEnquiry = await enquiryService.updateEnquiry(id, updateData);

    return NextResponse.json({
      success: true,
      data: updatedEnquiry,
      message: 'Enquiry updated successfully'
    });

  } catch (error) {
    console.error('Error updating enquiry:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update enquiry'
        }
      },
      { status: 500 }
    );
  }
}
