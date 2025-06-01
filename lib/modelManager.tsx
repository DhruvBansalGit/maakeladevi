// 3D Model Management System for Granite Website
import type { Texture } from 'three';
export interface ModelConfig {
  id: string;
  name: string;
  path: string;
  type: 'slab' | 'kitchen' | 'bathroom' | 'outdoor' | 'custom';
  size: number; // File size in MB
  polygons: number; // Triangle count
  textureMappings: string[]; // Which textures can be applied
  previewImage: string;
  description: string;
}


// Available 3D models configuration
export const availableModels: ModelConfig[] = [
  {
    id: 'granite-slab-basic',
    name: 'Basic Granite Slab',
    path: '/models/granite-slab/granite-slab.glb',
    type: 'slab',
    size: 2.1,
    polygons: 5000,
    textureMappings: ['diffuse', 'normal', 'roughness'],
    previewImage: '/images/model-previews/granite-slab.jpg',
    description: 'Simple rectangular granite slab for basic visualization'
  },
  {
    id: 'kitchen-counter-l-shape',
    name: 'L-Shaped Kitchen Counter',
    path: '/models/kitchen-counter/l-shape-counter.glb',
    type: 'kitchen',
    size: 4.8,
    polygons: 15000,
    textureMappings: ['diffuse', 'normal', 'roughness'],
    previewImage: '/images/model-previews/kitchen-l-shape.jpg',
    description: 'L-shaped kitchen counter with sink cutout'
  },
  {
    id: 'kitchen-counter-island',
    name: 'Kitchen Island',
    path: '/models/kitchen-counter/kitchen-island.glb',
    type: 'kitchen',
    size: 6.2,
    polygons: 22000,
    textureMappings: ['diffuse', 'normal', 'roughness'],
    previewImage: '/images/model-previews/kitchen-island.jpg',
    description: 'Large kitchen island with breakfast bar'
  },
  {
    id: 'bathroom-vanity-single',
    name: 'Single Bathroom Vanity',
    path: '/models/bathroom-vanity/single-vanity.glb',
    type: 'bathroom',
    size: 3.5,
    polygons: 12000,
    textureMappings: ['diffuse', 'normal', 'roughness'],
    previewImage: '/images/model-previews/bathroom-single.jpg',
    description: 'Single sink bathroom vanity counter'
  },
  {
    id: 'bathroom-vanity-double',
    name: 'Double Bathroom Vanity',
    path: '/models/bathroom-vanity/double-vanity.glb',
    type: 'bathroom',
    size: 5.1,
    polygons: 18000,
    textureMappings: ['diffuse', 'normal', 'roughness'],
    previewImage: '/images/model-previews/bathroom-double.jpg',
    description: 'Double sink bathroom vanity counter'
  },
  {
    id: 'outdoor-bbq-counter',
    name: 'Outdoor BBQ Counter',
    path: '/models/outdoor/bbq-counter.glb',
    type: 'outdoor',
    size: 7.3,
    polygons: 25000,
    textureMappings: ['diffuse', 'normal', 'roughness'],
    previewImage: '/images/model-previews/outdoor-bbq.jpg',
    description: 'Outdoor BBQ and prep counter'
  }
];

// Granite texture configurations
export interface TextureSet {
  graniteId: string;
  name: string;
  diffuse: string;
  normal?: string;
  roughness?: string;
  displacement?: string;
  metallic?: string;
}

export const graniteTextures: TextureSet[] = [
  {
    graniteId: '1',
    name: 'Kashmir White',
    diffuse: '/textures/granite/kashmir-white-diffuse.jpg',
    normal: '/textures/granite/kashmir-white-normal.jpg',
    roughness: '/textures/granite/kashmir-white-roughness.jpg'
  },
  {
    graniteId: '2',
    name: 'Black Galaxy',
    diffuse: '/textures/granite/black-galaxy-diffuse.jpg',
    normal: '/textures/granite/black-galaxy-normal.jpg',
    roughness: '/textures/granite/black-galaxy-roughness.jpg'
  },
  {
    graniteId: '3',
    name: 'Tan Brown',
    diffuse: '/textures/granite/tan-brown-diffuse.jpg',
    normal: '/textures/granite/tan-brown-normal.jpg',
    roughness: '/textures/granite/tan-brown-roughness.jpg'
  }
];

// Model management functions
export class ModelManager {
  static getModelById(id: string): ModelConfig | undefined {
    return availableModels.find(model => model.id === id);
  }

  static getModelsByType(type: ModelConfig['type']): ModelConfig[] {
    return availableModels.filter(model => model.type === type);
  }

  static getTextureSetForGranite(graniteId: string): TextureSet | undefined {
    return graniteTextures.find(texture => texture.graniteId === graniteId);
  }

  static getRecommendedModel(application: string): ModelConfig {
    const appModelMap: Record<string, string> = {
      'kitchen': 'kitchen-counter-l-shape',
      'bathroom': 'bathroom-vanity-single',
      'outdoor': 'outdoor-bbq-counter',
      'default': 'granite-slab-basic'
    };

    const modelId = appModelMap[application] || appModelMap.default;
    return this.getModelById(modelId) || availableModels[0];
  }

  static async preloadModel(modelPath: string): Promise<boolean> {
    try {
      const response = await fetch(modelPath, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  static async getModelFileSize(modelPath: string): Promise<number> {
    try {
      const response = await fetch(modelPath, { method: 'HEAD' });
      const contentLength = response.headers.get('content-length');
      return contentLength ? parseInt(contentLength) : 0;
    } catch {
      return 0;
    }
  }

  static getOptimalModelForDevice(): ModelConfig[] {
    // Check device capabilities
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEnd = navigator.hardwareConcurrency <= 4;

    if (isMobile || isLowEnd) {
      // Return smaller, optimized models for mobile/low-end devices
      return availableModels.filter(model => model.size <= 3.0 && model.polygons <= 10000);
    }

    return availableModels;
  }

  static generateModelPreviewUrl(modelId: string, graniteId: string): string {
    return `/api/model-preview?model=${modelId}&granite=${graniteId}`;
  }
}

// Model loading utilities
export async function loadModel(modelPath: string, onProgress?: (progress: number) => void) {
  try {
    const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');

    const loader = new GLTFLoader();
    
    return new Promise((resolve, reject) => {
      loader.load(
        modelPath,
        (gltf) => resolve(gltf),
        (progress) => {
          if (onProgress && progress.total > 0) {
            const percentage = (progress.loaded / progress.total) * 100;
            onProgress(Math.round(percentage));
          }
        },
        (error) => reject(error)
      );
    });
  } catch (error) {
    throw new Error(`Failed to load model: ${error}`);
  }
}

export async function loadTexture(texturePath: string): Promise<Texture> {
  try {
    const THREE = await import('three');
    const loader = new THREE.TextureLoader();
    
    return new Promise((resolve, reject) => {
      loader.load(texturePath, resolve, undefined, reject);
    });
  } catch (error) {
    throw new Error(`Failed to load texture: ${error}`);
  }
}

// Cache management for models and textures
class ModelCache {
  private static cache = new Map<string, unknown>();
  private static maxCacheSize = 50; // MB
  private static currentCacheSize = 0;

   static async get<T = unknown>(key: string): Promise<T | null> {
    return (this.cache.get(key) as T) || null;
  }

   static async set<T = unknown>(key: string, data: T, sizeInMB: number): Promise<void> {
    if (this.currentCacheSize + sizeInMB > this.maxCacheSize) {
      this.clear();
    }

    this.cache.set(key, data);
    this.currentCacheSize += sizeInMB;
  }

  static clear(): void {
    this.cache.clear();
    this.currentCacheSize = 0;
  }

  static delete(key: string): void {
    this.cache.delete(key);
  }
}

export { ModelCache };

// Model validation utilities
export function validateModelFile(file: File): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const maxSizeInMB = 20;
  const allowedFormats = ['.glb', '.gltf'];

  // Check file size
  if (file.size > maxSizeInMB * 1024 * 1024) {
    errors.push(`File size exceeds ${maxSizeInMB}MB limit`);
  }

  // Check file format
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  if (!allowedFormats.includes(fileExtension)) {
    errors.push(`Invalid file format. Allowed: ${allowedFormats.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Export default model manager instance
export default ModelManager;