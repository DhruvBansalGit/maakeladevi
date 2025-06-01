import { NextRequest, NextResponse } from 'next/server';
import { graniteService } from '@/lib/services/graniteService';
import { GraniteFormData } from '@/types';

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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updateData: Partial<GraniteFormData> = await request.json();

    const updatedGranite = await graniteService.updateGranite(id, updateData);

    return NextResponse.json({
      success: true,
      data: updatedGranite,
      message: 'Granite updated successfully'
    });

  } catch (error) {
    console.error('Error updating granite:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: 'Failed to update granite' 
        } 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await graniteService.deleteGranite(id);

    return NextResponse.json({
      success: true,
      message: 'Granite deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting granite:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: 'Failed to delete granite' 
        } 
      },
      { status: 500 }
    );
  }
}
