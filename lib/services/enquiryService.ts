import { ref, set, get, update, query, orderByChild, equalTo } from 'firebase/database';
import { firedatabase } from '@/lib/firebase';
import { Enquiry, EnquiryFormData, EnquiryNote, SelectedGranite } from '@/types';
import { generateId } from '@/utils/helpers';
type FirebaseEnquiry = Omit<Enquiry, 'createdAt' | 'updatedAt' | 'notes' | 'selectedGranites'> & {
  createdAt: number;
  updatedAt: number;
  selectedGranites: Record<string, SelectedGranite>; // replace with better type if available
  notes: Record<string, EnquiryNote>;
};

export class EnquiryService {
  private enquiriesRef = ref(firedatabase, 'enquiries');

  // Get all enquiries
  async getAllEnquiries(): Promise<Enquiry[]> {
    try {
      const snapshot = await get(this.enquiriesRef);
      if (!snapshot.exists()) return [];
      
      const data = snapshot.val();
      return Object.values(data).map((entry) => this.transformEnquiryData(entry as Record<string, unknown>));
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      throw error;
    }
  }

  // Get enquiry by ID
  async getEnquiryById(id: string): Promise<Enquiry | null> {
    try {
      const enquiryRef = ref(firedatabase, `enquiries/${id}`);
      const snapshot = await get(enquiryRef);
      
      if (!snapshot.exists()) return null;
      
      return this.transformEnquiryData(snapshot.val());
    } catch (error) {
      console.error('Error fetching enquiry:', error);
      throw error;
    }
  }

  // Create new enquiry
  async createEnquiry(enquiryData: EnquiryFormData & { totalValue?: number }): Promise<Enquiry> {
    try {
      const enquiryId = generateId();
      const enquiry: FirebaseEnquiry = {
        id: enquiryId,
        customerInfo: enquiryData.customerInfo,
        selectedGranites: this.transformSelectedGranites(enquiryData.selectedGranites),
        projectDetails: enquiryData.projectDetails || {},
        status: 'new',
        priority: 'medium',
        notes: enquiryData.additionalNotes ? {
          [`note_${Date.now()}`]: {
            id: `note_${Date.now()}`,
            content: enquiryData.additionalNotes,
            author: 'Customer',
            type: 'customer-communication',
            isInternal: false,
            createdAt: new Date()
          }
        } : {},
        totalEstimatedCost: enquiryData.totalValue || 0,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      const enquiryRef = ref(firedatabase, `enquiries/${enquiryId}`);
      await set(enquiryRef, enquiry);
      
      return this.transformEnquiryData(enquiry);
    } catch (error) {
      console.error('Error creating enquiry:', error);
      throw error;
    }
  }

  // Update enquiry
  async updateEnquiry(id: string, updates: Partial<Enquiry>): Promise<Enquiry> {
    try {
      const updateData: Partial<Omit<Enquiry, 'updatedAt'>> & { updatedAt: number } = {
        ...updates,
        updatedAt: Date.now()
      };

      const enquiryRef = ref(firedatabase, `enquiries/${id}`);
      await update(enquiryRef, updateData);
      
      // Return updated enquiry
      const updatedEnquiry = await this.getEnquiryById(id);
      if (!updatedEnquiry) throw new Error('Enquiry not found after update');
      
      return updatedEnquiry;
    } catch (error) {
      console.error('Error updating enquiry:', error);
      throw error;
    }
  }

  // Add note to enquiry
  async addNote(enquiryId: string, note: Omit<EnquiryNote, 'id' | 'createdAt'>): Promise<void> {
    try {
      const noteId = `note_${Date.now()}`;
      const noteData = {
        id: noteId,
        ...note,
        createdAt: Date.now()
      };

      const noteRef = ref(firedatabase, `enquiries/${enquiryId}/notes/${noteId}`);
      await set(noteRef, noteData);

      // Update enquiry timestamp
      const enquiryRef = ref(firedatabase, `enquiries/${enquiryId}`);
      await update(enquiryRef, { updatedAt: Date.now() });
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  }

  // Get enquiries by status
  async getEnquiriesByStatus(status: string): Promise<Enquiry[]> {
    try {
      const statusQuery = query(this.enquiriesRef, orderByChild('status'), equalTo(status));
      const snapshot = await get(statusQuery);
      
      if (!snapshot.exists()) return [];
      
      const data = snapshot.val() as Record<string, Record<string, unknown>>;
      return Object.values(data).map(this.transformEnquiryData);
    } catch (error) {
      console.error('Error fetching enquiries by status:', error);
      throw error;
    }
  }

  // Transform Firebase data to Enquiry type
  private transformEnquiryData(data: Record<string, unknown>): Enquiry {
  return {
    id: data.id as string,
    customerInfo: data.customerInfo as Enquiry['customerInfo'],
    projectDetails: data.projectDetails as Enquiry['projectDetails'],
    status: data.status as Enquiry['status'],
    priority: data.priority as Enquiry['priority'],
    selectedGranites: data.selectedGranites
      ? (Object.values(data.selectedGranites) as Enquiry['selectedGranites'])
      : [],
   notes: data.notes
  ? (Object.values(data.notes)
      .sort((a: EnquiryNote, b: EnquiryNote) => a.createdAt.getTime() - b.createdAt.getTime())
    ) as Enquiry['notes']
  : [],
    createdAt: new Date(data.createdAt as number),
    updatedAt: new Date(data.updatedAt as number),
    followUpDate: data.followUpDate ? new Date(data.followUpDate as number) : undefined,
    lastContactedAt: data.lastContactedAt ? new Date(data.lastContactedAt as number) : undefined,
  };
}

  // Transform selected granites for Firebase storage
  private transformSelectedGranites(granites: SelectedGranite[]): Record<string, SelectedGranite> {
    const transformed: Record<string, SelectedGranite> = {};
    granites.forEach((granite, index) => {
      const id = `selection_${Date.now()}_${index}`;
      transformed[id] = granite;
    });
    return transformed;
  }
}

export const enquiryService = new EnquiryService();