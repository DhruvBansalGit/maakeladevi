import { ref, set, get, update, remove, query, orderByChild, equalTo } from 'firebase/database';
import { firedatabase } from '@/lib/firebase';
import { Granite, GraniteFormData, GraniteImage, GraniteSize } from '@/types';
import { generateId } from '@/utils/helpers';
type FirebaseGranite = Omit<Granite, 'createdAt' | 'updatedAt' | 'images' | 'sizes'> & {
  createdAt: number;
  updatedAt: number;
  images: Record<string, GraniteImage>;
  sizes: Record<string, GraniteSize>;
};
export class GraniteService {
  private granitesRef = ref(firedatabase, 'granites');

  // Get all granites
  async getAllGranites(): Promise<Granite[]> {
    try {
      const snapshot = await get(this.granitesRef);
      if (!snapshot.exists()) return [];
      
      const data = snapshot.val();
      return Object.values(data).map(this.transformGraniteData);
    } catch (error) {
      console.error('Error fetching granites:', error);
      throw error;
    }
  }

  

  // Get granite by ID
  async getGraniteById(id: string): Promise<Granite | null> {
    try {
      const graniteRef = ref(firedatabase, `granites/${id}`);
      const snapshot = await get(graniteRef);
      
      if (!snapshot.exists()) return null;
      
      return this.transformGraniteData(snapshot.val());
    } catch (error) {
      console.error('Error fetching granite:', error);
      throw error;
    }
  }

  // Create new granite
async createGranite(graniteData: GraniteFormData): Promise<Granite> {
  try {
    const id = generateId();

    const dataToStore: Omit<Granite, 'createdAt' | 'updatedAt' | 'images' | 'sizes'> & {
      createdAt: number;
      updatedAt: number;
      images: Record<string, GraniteImage>;
      sizes: Record<string, GraniteSize>;
    } = {
      id,
      ...graniteData,
      images: this.transformImages(graniteData.images || []),
      sizes: this.transformSizes(graniteData.sizes),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: 'active'
    };

    const graniteRef = ref(firedatabase, `granites/${id}`);
    await set(graniteRef, dataToStore);

    return this.transformGraniteData(dataToStore);
  } catch (error) {
    console.error('Error creating granite:', error);
    throw error;
  }
}



  // Update granite
async updateGranite(id: string, updates: Partial<GraniteFormData>): Promise<Granite> {
  try {
   const baseData: Partial<Omit<Granite, 'createdAt' | 'updatedAt' | 'images' | 'sizes'>> = { ...updates };

const updateData: Partial<Omit<Granite, 'createdAt' | 'updatedAt' | 'images' | 'sizes'>> & {
  updatedAt: number;
  images?: Record<string, GraniteImage>;
  sizes?: Record<string, GraniteSize>;
} = {
  ...baseData,
  updatedAt: Date.now(),
};

if (updates.images) {
  updateData.images = this.transformImages(updates.images);
}

if (updates.sizes) {
  updateData.sizes = this.transformSizes(updates.sizes);
}

    const graniteRef = ref(firedatabase, `granites/${id}`);
    await update(graniteRef, updateData);

    const updatedGranite = await this.getGraniteById(id);
    if (!updatedGranite) throw new Error('Granite not found after update');

    return updatedGranite;
  } catch (error) {
    console.error('Error updating granite:', error);
    throw error;
  }
}



  // Delete granite
  async deleteGranite(id: string): Promise<void> {
    try {
      const graniteRef = ref(firedatabase, `granites/${id}`);
      await remove(graniteRef);
    } catch (error) {
      console.error('Error deleting granite:', error);
      throw error;
    }
  }

  // Search granites
  async searchGranites(searchTerm: string): Promise<Granite[]> {
    try {
      const allGranites = await this.getAllGranites();
      const searchLower = searchTerm.toLowerCase();
      
      return allGranites.filter(granite =>
        granite.name.toLowerCase().includes(searchLower) ||
        granite.description.toLowerCase().includes(searchLower) ||
        granite.color.toLowerCase().includes(searchLower) ||
        granite.origin.toLowerCase().includes(searchLower)
      );
    } catch (error) {
      console.error('Error searching granites:', error);
      throw error;
    }
  }

  // Get granites by category
  async getGranitesByCategory(category: string): Promise<Granite[]> {
    try {
      const categoryQuery = query(this.granitesRef, orderByChild('category'), equalTo(category));
      const snapshot = await get(categoryQuery);
      
      if (!snapshot.exists()) return [];
      
      const data = snapshot.val();
      return Object.values(data).map(this.transformGraniteData);
    } catch (error) {
      console.error('Error fetching granites by category:', error);
      throw error;
    }
  }

  // Transform Firebase data to Granite type
private transformGraniteData(data: unknown): Granite {
  const raw = data as FirebaseGranite

  const granite: Granite = {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    price: raw.price,
    priceUnit: raw.priceUnit,
    category: raw.category,
    origin: raw.origin,
    color: raw.color,
    pattern: raw.pattern,
    finish: raw.finish,
    thickness: raw.thickness,
    availability: raw.availability,
    images: raw.images ? Object.values(raw.images) as GraniteImage[] : [],
    specifications: raw.specifications,
    sizes: raw.sizes ? Object.values(raw.sizes) as GraniteSize[] : [],
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
    featured: raw.featured,
    popular: raw.popular,
    status: raw.status
  };

  return granite;
}

  // Transform images for Firebase storage
 private transformImages(images: GraniteImage[]): Record<string, GraniteImage> {
  const transformed: Record<string, GraniteImage> = {};
  images.forEach((img, index) => {
    const imageId = img.id || `img_${Date.now()}_${index}`;
    transformed[imageId] = { ...img, id: imageId };
  });
  return transformed;
}

  // Transform sizes for Firebase storage
private transformSizes(sizes: Omit<GraniteSize, 'id'>[]): Record<string, GraniteSize> {
  const transformed: Record<string, GraniteSize> = {};
  sizes.forEach((size, index) => {
    const sizeId = `size_${Date.now()}_${index}`; // ✅ always generate ID
    transformed[sizeId] = { ...size, id: sizeId };
  });
  return transformed;
}
}

export const graniteService = new GraniteService();

// File: lib/services/enquiryService.ts
