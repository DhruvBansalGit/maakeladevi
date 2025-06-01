import { NextRequest, NextResponse } from 'next/server';
import { graniteService } from '@/lib/services/graniteService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim().toLowerCase() || '';
    const category = searchParams.get('category')?.toLowerCase() || '';
    const featured = searchParams.get('featured') === 'true';
    const popular = searchParams.get('popular') === 'true';

    // Fetch all granites once, and filter below
    let granites = await graniteService.getAllGranites();

    if (search) {
      granites = granites.filter(g =>
        g.name.toLowerCase().includes(search) ||
        g.description.toLowerCase().includes(search) ||
        g.color.toLowerCase().includes(search) ||
        g.origin.toLowerCase().includes(search)
      );
    }

    if (category && category !== 'all') {
      granites = granites.filter(g => g.category === category);
    }

    if (featured) {
      granites = granites.filter(g => g.featured);
    }

    if (popular) {
      granites = granites.filter(g => g.popular);
    }

    // Only return in-stock & active granites for public API
    granites = granites.filter(g => g.availability === 'in-stock' && g.status === 'active');

    return NextResponse.json({
      success: true,
      data: granites
    });
  } catch (error) {
    console.error('Error fetching granites:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch granites'
        }
      },
      { status: 500 }
    );
  }
}
