import { NextRequest, NextResponse } from 'next/server';
import { graniteService } from '@/lib/services/graniteService';
import { GraniteFormData } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const availability = searchParams.get('availability') || '';
    const featured = searchParams.get('featured');
    const popular = searchParams.get('popular');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let granites = await graniteService.getAllGranites();

    // Apply filters
    if (search) {
      granites = await graniteService.searchGranites(search);
    }

    if (category && category !== 'all') {
      granites = granites.filter(g => g.category === category);
    }

    if (availability && availability !== 'all') {
      granites = granites.filter(g => g.availability === availability);
    }

    if (featured !== null && featured !== undefined) {
      granites = granites.filter(g => g.featured === (featured === 'true'));
    }

    if (popular !== null && popular !== undefined) {
      granites = granites.filter(g => g.popular === (popular === 'true'));
    }

    // Sort by updated date (newest first)
    granites.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    // Pagination
    const total = granites.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedGranites = granites.slice(startIndex, startIndex + limit);

    // Calculate stats
    const stats = {
      total: granites.length,
      inStock: granites.filter(g => g.availability === 'in-stock').length,
      outOfStock: granites.filter(g => g.availability === 'out-of-stock').length,
      featured: granites.filter(g => g.featured).length,
      popular: granites.filter(g => g.popular).length,
      categories: {
        standard: granites.filter(g => g.category === 'standard').length,
        premium: granites.filter(g => g.category === 'premium').length,
        luxury: granites.filter(g => g.category === 'luxury').length,
        economy: granites.filter(g => g.category === 'economy').length,
      },
      totalValue: granites.reduce((sum, g) => sum + (g.price * g.sizes.reduce((s, size) => s + size.stock, 0)), 0)
    };

    return NextResponse.json({
      success: true,
      data: paginatedGranites,
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
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

export async function POST(request: NextRequest) {
  try {
    const graniteData: GraniteFormData = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'price', 'category', 'origin', 'color', 'pattern'];
    for (const field of requiredFields) {
      if (!graniteData[field as keyof GraniteFormData]) {
        return NextResponse.json(
          { 
            success: false, 
            error: { 
              code: 'VALIDATION_ERROR', 
              message: `${field} is required` 
            } 
          },
          { status: 400 }
        );
      }
    }

    const newGranite = await graniteService.createGranite(graniteData);

    return NextResponse.json({
      success: true,
      data: newGranite,
      message: 'Granite created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating granite:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: 'Failed to create granite' 
        } 
      },
      { status: 500 }
    );
  }
}