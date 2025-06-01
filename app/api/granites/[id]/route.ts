//api/granites/[id]/route
import { NextRequest, NextResponse } from 'next/server';
import { graniteService } from '@/lib/services/graniteService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const granite = await graniteService.getGraniteById(id);

    if (!granite) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'NOT_FOUND', 
            message: 'Granite not found' 
          } 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: granite
    });

  } catch (error) {
    console.error('Error fetching granite:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: 'Failed to fetch granite' 
        } 
      },
      { status: 500 }
    );
  }
}