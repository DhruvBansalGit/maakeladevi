import { NextRequest, NextResponse } from 'next/server';
import { enquiryService } from '@/lib/services/enquiryService';
import { EnquiryNote } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const id = url.pathname.split('/').at(-2); // gets [id] from /api/admin/enquiries/[id]/notes

    const { content, author, type, isInternal } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Note content is required'
          }
        },
        { status: 400 }
      );
    }

    const noteData: Omit<EnquiryNote, 'id' | 'createdAt'> = {
      content: content.trim(),
      author: author || 'Admin',
      type: type || 'general',
      isInternal: isInternal || false
    };

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'Missing enquiry ID in route path'
          }
        },
        { status: 400 }
      );
    }

    await enquiryService.addNote(id, noteData);

    return NextResponse.json({
      success: true,
      message: 'Note added successfully'
    });
  } catch (error) {
    console.error('Error adding note:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to add note'
        }
      },
      { status: 500 }
    );
  }
}
