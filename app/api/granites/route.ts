//api/granite/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { graniteService } from '@/lib/services/graniteService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const featured = searchParams.get('featured');
    const popular = searchParams.get('popular');

    let granites = await graniteService.getAllGranites();

    // Apply filters
    if (search) {
      granites = await graniteService.searchGranites(search);
    }

    if (category && category !== 'all') {
      granites = granites.filter(g => g.category === category);
    }

    if (featured === 'true') {
      granites = granites.filter(g => g.featured);
    }

    if (popular === 'true') {
      granites = granites.filter(g => g.popular);
    }

    // Filter only active and in-stock granites for public API
    granites = granites.filter(g => g.availability === 'in-stock');

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
