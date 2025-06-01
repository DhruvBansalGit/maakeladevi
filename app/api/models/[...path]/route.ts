import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePath = params.path.join('/');
    const fullPath = path.join(process.cwd(), 'public', 'models', filePath);

    // Security check - ensure path is within models directory
    const publicModelsDir = path.join(process.cwd(), 'public', 'models');
    const resolvedPath = path.resolve(fullPath);
    
    if (!resolvedPath.startsWith(publicModelsDir)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Check if file exists
    try {
      await fs.access(resolvedPath);
    } catch {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }

    // Read file
    const fileBuffer = await fs.readFile(resolvedPath);
    
    // Determine content type based on file extension
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (ext) {
      case '.glb':
        contentType = 'model/gltf-binary';
        break;
      case '.gltf':
        contentType = 'model/gltf+json';
        break;
      case '.fbx':
        contentType = 'application/octet-stream';
        break;
      default:
        contentType = 'application/octet-stream';
    }

    // Set appropriate headers
    const response = new NextResponse(fileBuffer);
    response.headers.set('Content-Type', contentType);
    response.headers.set('Content-Length', fileBuffer.length.toString());
    response.headers.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET');
    
    return response;

  } catch (error) {
    console.error('Error serving model file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle HEAD requests for preflight checks
export async function HEAD(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePath = params.path.join('/');
    const fullPath = path.join(process.cwd(), 'public', 'models', filePath);

    // Security check
    const publicModelsDir = path.join(process.cwd(), 'public', 'models');
    const resolvedPath = path.resolve(fullPath);
    
    if (!resolvedPath.startsWith(publicModelsDir)) {
      return new NextResponse(null, { status: 403 });
    }

    // Check if file exists and get stats
    const stats = await fs.stat(resolvedPath);
    
    const response = new NextResponse(null);
    response.headers.set('Content-Length', stats.size.toString());
    response.headers.set('Cache-Control', 'public, max-age=31536000');
    response.headers.set('Access-Control-Allow-Origin', '*');
    
    return response;

  } catch (error) {
    console.log(error)
    return new NextResponse(null, { status: 404 });
  }
}