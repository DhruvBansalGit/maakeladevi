import { ref, set, get, update, remove, push, query, orderByChild, equalTo } from 'firebase/database';
import { firedatabase } from '@/lib/firebase';
import { Granite, GraniteFormData } from '@/types';
import { generateId } from '@/utils/helpers';

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
      const graniteId = generateId();
      const granite: any = {
        id: graniteId,
        ...graniteData,
        images: this.transformImages(graniteData.images || []),
        sizes: this.transformSizes(graniteData.sizes),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: 'active'
      };

      const graniteRef = ref(firedatabase, `granites/${graniteId}`);
      await set(graniteRef, granite);
      
      return this.transformGraniteData(granite);
    } catch (error) {
      console.error('Error creating granite:', error);
      throw error;
    }
  }

  // Update granite
  async updateGranite(id: string, updates: Partial<GraniteFormData>): Promise<Granite> {
    try {
      const updateData: any = {
        ...updates,
        updatedAt: Date.now()
      };

      if (updates.images) {
        updateData.images = this.transformImages(updates.images);
      }

      if (updates.sizes) {
        updateData.sizes = this.transformSizes(updates.sizes);
      }

      const graniteRef = ref(firedatabase, `granites/${id}`);
      await update(graniteRef, updateData);
      
      // Return updated granite
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
  private transformGraniteData(data: any): Granite {
    return {
      ...data,
      images: data.images ? Object.values(data.images) : [],
      sizes: data.sizes ? Object.values(data.sizes) : [],
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt)
    };
  }

  // Transform images for Firebase storage
  private transformImages(images: any[]): Record<string, any> {
    const transformedImages: Record<string, any> = {};
    images.forEach((image, index) => {
      const imageId = image.id || `img_${Date.now()}_${index}`;
      transformedImages[imageId] = {
        ...image,
        id: imageId
      };
    });
    return transformedImages;
  }

  // Transform sizes for Firebase storage
  private transformSizes(sizes: any[]): Record<string, any> {
    const transformedSizes: Record<string, any> = {};
    sizes.forEach((size, index) => {
      const sizeId = size.id || `size_${Date.now()}_${index}`;
      transformedSizes[sizeId] = {
        ...size,
        id: sizeId
      };
    });
    return transformedSizes;
  }
}

export const graniteService = new GraniteService();

// File: lib/services/enquiryService.ts
