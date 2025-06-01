// File: types/index.ts

// Granite types
export interface Granite {
  id: string;
  name: string;
  description: string;
  price: number;
  priceUnit: 'sqft' | 'slab';
  category: 'premium' | 'standard' | 'economy' | 'luxury'; // Added luxury for admin
  origin: string;
  color: string;
  pattern: string;
  finish: string[];
  thickness: number[];
  availability: 'in-stock' | 'pre-order' | 'out-of-stock';
  images: GraniteImage[];
  specifications: GraniteSpecifications;
  sizes: GraniteSize[];
  createdAt: Date;
  updatedAt: Date;
  featured: boolean;
  popular: boolean;
}

export interface GraniteImage {
  id: string;
  url: string;
  alt: string;
  type: 'primary' | 'gallery' | 'texture' | '3d-texture' | 'secondary'; // Added secondary
  order: number;
  cloudinaryPublicId?: string; // Added for Cloudinary integration
  width?: number; // Added for image dimensions
  height?: number; // Added for image dimensions
}

export interface GraniteSpecifications {
  density: number;
  porosity: number;
  compressiveStrength: number;
  flexuralStrength: number;
  abrasionResistance: string;
  frostResistance: boolean;
  acidResistance: string;
  applications: string[];
}

export interface GraniteSize {
  id: string;
  length: number;
  width: number;
  thickness: number;
  unit: 'mm' | 'cm' | 'inch';
  stock: number;
  price: number;
}

// Enquiry types
export interface Enquiry {
  id: string;
  customerInfo: CustomerInfo;
  selectedGranites: SelectedGranite[];
  projectDetails: ProjectDetails;
  status: EnquiryStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  notes: EnquiryNote[];
  totalEstimatedCost?: number;
  createdAt: Date;
  updatedAt: Date;
  followUpDate?: Date;
  lastContactedAt?: Date; // Added for admin tracking
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address?: Address; // Made optional for admin flexibility
  company?: string;
  source: 'website' | 'referral' | 'social-media' | 'advertisement' | 'walk-in' | 'phone' | 'email' | 'admin'; // Added admin sources
}

export interface Address {
  street?: string; // Made optional
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface SelectedGranite {
  graniteId: string;
  granite?: Granite; // Made optional for flexibility
  selectedSize?: GraniteSize; // Made optional
  quantity: number;
  selectedFinish?: string; // Made optional
  selectedThickness?: number; // Made optional
  estimatedArea?: number; // Made optional
  unit?: 'sqft' | 'sqm'; // Made optional
  notes?: string;
  size?: string; // Added for simple size description
}

export interface ProjectDetails {
  projectType?: 'residential' | 'commercial' | 'industrial'; // Made optional
  application?: 'kitchen' | 'bathroom' | 'flooring' | 'wall-cladding' | 'outdoor' | 'other'; // Made optional
  timeline?: 'immediate' | '1-month' | '3-months' | '6-months' | 'flexible'; // Made optional
  budget?: {
    min: number;
    max: number;
    currency: 'INR' | 'USD';
  }; // Made optional
  installationRequired?: boolean;
  designConsultationRequired?: boolean;
  measurementRequired?: boolean;
  description?: string;
}

export type EnquiryStatus = 
  | 'new' 
  | 'pending' // Added for admin workflow
  | 'contacted' 
  | 'in-progress' // Added for admin workflow
  | 'quoted' 
  | 'negotiating' 
  | 'confirmed' 
  | 'in-production' 
  | 'ready-for-delivery' 
  | 'delivered' 
  | 'completed' 
  | 'cancelled' 
  | 'on-hold';

// Updated EnquiryNote with additional admin types
export interface EnquiryNote {
  id: string;
  content: string;
  author: string;
  type: 'internal' | 'customer-communication' | 'status-update' | 'general' | 'admin-response' | 'email-sent' | 'whatsapp-sent';
  isInternal?: boolean; // Added for admin notes
  createdAt: Date;
}

// Admin types
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'super-admin' | 'admin' | 'manager' | 'sales';
  permissions: Permission[];
  lastLogin: Date;
  createdAt: Date;
  isActive: boolean;
}

export interface Permission {
  resource: 'granites' | 'enquiries' | 'users' | 'analytics' | 'settings';
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

// Admin-specific interfaces
export interface AdminEnquiry extends Enquiry {
  timeline?: Array<{
    id: string;
    action: string;
    timestamp: Date;
    user: string;
    details: string;
  }>;
  metrics?: {
    responseTime: string;
    daysOpen: number;
    lastActivity: Date;
    totalInteractions: number;
  };
}

export interface AdminDashboardStats {
  granites: {
    total: number;
    inStock: number;
    outOfStock: number;
    featured: number;
    popular: number;
    categories: {
      standard: number;
      premium: number;
      luxury: number;
      economy: number;
    };
    totalValue: number;
  };
  enquiries: {
    total: number;
    new: number;
    pending: number;
    inProgress: number;
    contacted: number;
    quoted: number;
    completed: number;
    cancelled: number;
    totalValue: number;
    averageValue: number;
    highPriority: number;
    needsAttention: number;
    responseTime: {
      average: string;
      target: string;
    };
    conversionRate: string;
  };
  recentActivity: Array<{
    id: string;
    type: 'granite_created' | 'granite_updated' | 'enquiry_received' | 'enquiry_updated' | 'enquiry_completed';
    title: string;
    description: string;
    timestamp: Date;
    user?: string;
  }>;
}

// Filter interfaces for admin
export interface GraniteFilters {
  search?: string;
  category?: string;
  availability?: string;
  featured?: boolean;
  popular?: boolean;
  sortBy?: 'name' | 'price' | 'category' | 'stock' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface EnquiryFilters {
  search?: string;
  status?: string;
  priority?: string;
  source?: string;
  assignedTo?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'createdAt' | 'customerName' | 'totalValue' | 'status' | 'priority';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Bulk operation interfaces
export interface BulkGraniteOperation {
  action: 'delete' | 'update' | 'feature' | 'unfeature';
  graniteIds: string[];
  updateData?: Partial<Granite>;
}

export interface BulkEnquiryOperation {
  action: 'updateStatus' | 'updatePriority' | 'assign' | 'delete';
  enquiryIds: string[];
  updateData?: {
    status?: EnquiryStatus;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    assignedTo?: string;
    notifyCustomer?: boolean;
    updatedBy?: string;
  };
}

// Communication interfaces
export interface EmailData {
  to: string;
  subject: string;
  message: string;
  template?: string;
  cc?: string[];
  enquiry?: Enquiry;
}

export interface WhatsAppData {
  to: string;
  message: string;
  template?: string;
}

// File upload interface
export interface UploadedFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: Date;
  uploadedBy?: string;
}

// 3D Viewer types
export interface Viewer3DConfig {
  modelUrl: string;
  textureUrl: string;
  environmentMap?: string;
  lighting: LightingConfig;
  camera: CameraConfig;
  controls: ControlsConfig;
}

export interface LightingConfig {
  ambient: {
    intensity: number;
    color: string;
  };
  directional: {
    intensity: number;
    color: string;
    position: [number, number, number];
  };
  point?: {
    intensity: number;
    color: string;
    position: [number, number, number];
  };
}

export interface CameraConfig {
  position: [number, number, number];
  fov: number;
  near: number;
  far: number;
}

export interface ControlsConfig {
  enableZoom: boolean;
  enablePan: boolean;
  enableRotate: boolean;
  maxZoom: number;
  minZoom: number;
  maxPolarAngle: number;
  minPolarAngle: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats?: any; // Added for admin dashboard stats
  filters?: any; // Added for filter options
  message?: string; // Added for success messages
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

// Paginated response interface
export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface EnquiryFormData {
  customerInfo: CustomerInfo;
  selectedGranites: SelectedGranite[];
  projectDetails: ProjectDetails;
  additionalNotes?: string;
}

export interface GraniteFormData {
  name: string;
  description: string;
  price: number;
  priceUnit: 'sqft' | 'slab';
  category: 'premium' | 'standard' | 'economy' | 'luxury';
  origin: string;
  color: string;
  pattern: string;
  finish: string[];
  thickness: number[];
  availability: 'in-stock' | 'pre-order' | 'out-of-stock';
  specifications: GraniteSpecifications;
  sizes: Omit<GraniteSize, 'id'>[];
  featured: boolean;
  popular: boolean;
  images?: GraniteImage[]; // Added for admin form
}

// Email/WhatsApp types
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
  type: 'enquiry-confirmation' | 'quote' | 'follow-up' | 'status-update';
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
  type: 'enquiry-confirmation' | 'quote' | 'follow-up' | 'status-update';
}

export interface NotificationData {
  enquiry: Enquiry;
  customer: CustomerInfo;
  selectedGranites: SelectedGranite[];
  totalValue: number;
  adminEmail: string;
  adminPhone: string;
  template?: string; // Added for email template selection
}

// Analytics types
export interface AnalyticsData {
  enquiries: {
    total: number;
    thisMonth: number;
    thisWeek: number;
    byStatus: Record<EnquiryStatus, number>;
    bySource: Record<string, number>;
    conversionRate: number;
  };
  granites: {
    total: number;
    mostViewed: Granite[];
    mostEnquired: Granite[];
    byCategory: Record<string, number>;
  };
  revenue: {
    thisMonth: number;
    lastMonth: number;
    growth: number;
    byMonth: { month: string; amount: number }[];
  };
}

// Component Props types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  onClose?: () => void;
}