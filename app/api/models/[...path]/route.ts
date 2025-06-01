import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

function getPathSegments(request: NextRequest): string[] {
  const base = '/api/models/'; // adjust if your folder is different
  const pathname = request.nextUrl.pathname;
  const relativePath = pathname.slice(pathname.indexOf(base) + base.length);
  return relativePath.split('/').filter(Boolean);
}

export async function GET(request: NextRequest) {
  try {
    const segments = getPathSegments(request);
    const filePath = segments.join('/');
    const fullPath = path.join(process.cwd(), 'public', 'models', filePath);

    const publicModelsDir = path.join(process.cwd(), 'public', 'models');
    const resolvedPath = path.resolve(fullPath);

    if (!resolvedPath.startsWith(publicModelsDir)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    try {
      await fs.access(resolvedPath);
    } catch {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }

    const fileBuffer = await fs.readFile(resolvedPath);

    const ext = path.extname(filePath).toLowerCase();
    const contentType = {
      '.glb': 'model/gltf-binary',
      '.gltf': 'model/gltf+json',
      '.fbx': 'application/octet-stream'
    }[ext] || 'application/octet-stream';

    const response = new NextResponse(fileBuffer);
    response.headers.set('Content-Type', contentType);
    response.headers.set('Content-Length', fileBuffer.length.toString());
    response.headers.set('Cache-Control', 'public, max-age=31536000');
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET');

    return response;

  } catch (error) {
    console.error('Error serving model file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function HEAD(request: NextRequest) {
  try {
    const segments = getPathSegments(request);
    const filePath = segments.join('/');
    const fullPath = path.join(process.cwd(), 'public', 'models', filePath);

    const publicModelsDir = path.join(process.cwd(), 'public', 'models');
    const resolvedPath = path.resolve(fullPath);

    if (!resolvedPath.startsWith(publicModelsDir)) {
      return new NextResponse(null, { status: 403 });
    }

    const stats = await fs.stat(resolvedPath);

    const response = new NextResponse(null);
    response.headers.set('Content-Length', stats.size.toString());
    response.headers.set('Cache-Control', 'public, max-age=31536000');
    response.headers.set('Access-Control-Allow-Origin', '*');

    return response;

  } catch (error) {
    console.error(error);
    return new NextResponse(null, { status: 404 });
  }
}
