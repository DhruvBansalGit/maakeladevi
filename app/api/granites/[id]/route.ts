import { NextRequest, NextResponse } from 'next/server';
import { graniteService } from '@/lib/services/graniteService';

function getGraniteIdFromPath(pathname: string): string | null {
  const segments = pathname.split('/');
  return segments.at(-1) || null;
}

export async function GET(request: NextRequest) {
  try {
    const id = getGraniteIdFromPath(request.nextUrl.pathname);
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Missing granite ID in URL'
          }
        },
        { status: 400 }
      );
    }

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
