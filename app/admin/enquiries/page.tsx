'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Mail, 
  Phone, 
  MessageSquare, 
  ArrowLeft,
  Eye,
  Clock,
  CheckCircle,
  User,
  Package,
  ExternalLink,
  Download,
  RefreshCw,
  X
} from 'lucide-react';

interface Enquiry {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;
  granites: Array<{
    id: string;
    name: string;
    quantity: number;
    size: string;
  }>;
  message?: string;
  status: 'pending' | 'contacted' | 'quoted' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  source: 'website' | 'phone' | 'email' | 'referral';
  totalEstimatedValue?: number;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  notes: Array<{
    id: string;
    content: string;
    createdBy: string;
    createdAt: string;
  }>;
}

// Mock data - replace with actual API calls
const mockEnquiries: Enquiry[] = [
  {
    id: '1',
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul.sharma@example.com',
    customerPhone: '+91 9876543210',
    customerAddress: 'Sector 14, Gurugram, Haryana',
    granites: [
      { id: '1', name: 'Kashmir White', quantity: 50, size: '3000x1500x20mm' },
      { id: '2', name: 'Black Galaxy', quantity: 25, size: '3000x1500x20mm' }
    ],
    message: 'Looking for kitchen countertops and bathroom vanities. Please provide quote with installation.',
    status: 'pending',
    priority: 'high',
    source: 'website',
    totalEstimatedValue: 125000,
    createdAt: '2025-05-30T10:30:00Z',
    updatedAt: '2025-05-30T10:30:00Z',
    assignedTo: 'Sales Team',
    notes: []
  },
  {
    id: '2',
    customerName: 'Priya Patel',
    customerEmail: 'priya.patel@example.com',
    customerPhone: '+91 9876543211',
    customerAddress: 'DLF Phase 2, Gurugram, Haryana',
    granites: [
      { id: '3', name: 'Tan Brown', quantity: 30, size: '3000x1500x20mm' }
    ],
    message: 'Need granite for office reception area. Timeline is 2 weeks.',
    status: 'contacted',
    priority: 'medium',
    source: 'phone',
    totalEstimatedValue: 45000,
    createdAt: '2025-05-30T09:15:00Z',
    updatedAt: '2025-05-30T11:20:00Z',
    assignedTo: 'Amit Kumar',
    notes: [
      {
        id: '1',
        content: 'Customer called back. Scheduling site visit for tomorrow.',
        createdBy: 'Amit Kumar',
        createdAt: '2025-05-30T11:20:00Z'
      }
    ]
  },
  {
    id: '3',
    customerName: 'Amit Kumar',
    customerEmail: 'amit.kumar@example.com',
    customerPhone: '+91 9876543212',
    granites: [
      { id: '4', name: 'Imperial Red', quantity: 40, size: '3000x1500x20mm' },
      { id: '5', name: 'Blue Pearl', quantity: 20, size: '3000x1500x30mm' }
    ],
    message: 'Commercial project - hotel lobby flooring',
    status: 'quoted',
    priority: 'high',
    source: 'referral',
    totalEstimatedValue: 180000,
    createdAt: '2025-05-29T16:45:00Z',
    updatedAt: '2025-05-30T14:30:00Z',
    assignedTo: 'Rajesh Singh',
    notes: [
      {
        id: '2',
        content: 'Quote sent via email. Waiting for customer response.',
        createdBy: 'Rajesh Singh',
        createdAt: '2025-05-30T14:30:00Z'
      }
    ]
  },
  {
    id: '4',
    customerName: 'Sneha Gupta',
    customerEmail: 'sneha.gupta@example.com',
    customerPhone: '+91 9876543213',
    customerAddress: 'Cyber City, Gurugram, Haryana',
    granites: [
      { id: '6', name: 'Green Forest', quantity: 35, size: '3000x1500x20mm' }
    ],
    status: 'completed',
    priority: 'low',
    source: 'website',
    totalEstimatedValue: 70000,
    createdAt: '2025-05-28T14:20:00Z',
    updatedAt: '2025-05-30T16:00:00Z',
    assignedTo: 'Neha Sharma',
    notes: [
      {
        id: '3',
        content: 'Installation completed successfully. Customer very satisfied.',
        createdBy: 'Neha Sharma',
        createdAt: '2025-05-30T16:00:00Z'
      }
    ]
  }
];

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(mockEnquiries);
  const [filteredEnquiries, setFilteredEnquiries] = useState<Enquiry[]>(mockEnquiries);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'value' | 'priority'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const statuses = ['all', 'pending', 'contacted', 'quoted', 'completed', 'cancelled'];
  const priorities = ['all', 'low', 'medium', 'high'];
  const sources = ['all', 'website', 'phone', 'email', 'referral'];

  useEffect(() => {
    filterAndSortEnquiries();
  }, [searchTerm, selectedStatus, selectedPriority, selectedSource, sortBy, sortOrder, enquiries]);

  const filterAndSortEnquiries = () => {
    const filtered = enquiries.filter(enquiry => {
      const matchesSearch = 
        enquiry.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.granites.some(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = selectedStatus === 'all' || enquiry.status === selectedStatus;
      const matchesPriority = selectedPriority === 'all' || enquiry.priority === selectedPriority;
      const matchesSource = selectedSource === 'all' || enquiry.source === selectedSource;

      return matchesSearch && matchesStatus && matchesPriority && matchesSource;
    });

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'value':
          comparison = (a.totalEstimatedValue || 0) - (b.totalEstimatedValue || 0);
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    setFilteredEnquiries(filtered);
  };

  const updateEnquiryStatus = async (enquiryId: string, newStatus: string) => {
    setLoading(true);
    try {
      // Replace with actual API call
      setEnquiries(prev => prev.map(e =>
        e.id === enquiryId 
          ? { ...e, status: newStatus as Enquiry['status'], updatedAt: new Date().toISOString() }
          : e
      ));
    } catch (error) {
      console.error('Error updating enquiry status:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      contacted: 'bg-blue-100 text-blue-800 border-blue-200',
      quoted: 'bg-purple-100 text-purple-800 border-purple-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-orange-100 text-orange-800',
      high: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${styles[priority as keyof typeof styles]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const getSourceIcon = (source: string) => {
    const icons = {
      website: <Package className="w-4 h-4" />,
      phone: <Phone className="w-4 h-4" />,
      email: <Mail className="w-4 h-4" />,
      referral: <User className="w-4 h-4" />
    };
    
    return icons[source as keyof typeof icons] || <Package className="w-4 h-4" />;
  };

  // Stats calculation
  const stats = {
    total: enquiries.length,
    pending: enquiries.filter(e => e.status === 'pending').length,
    contacted: enquiries.filter(e => e.status === 'contacted').length,
    completed: enquiries.filter(e => e.status === 'completed').length,
    totalValue: enquiries.reduce((sum, e) => sum + (e.totalEstimatedValue || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin"
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Enquiry Management</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Contacted</p>
                <p className="text-xl font-bold text-gray-900">{stats.contacted}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.totalValue)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search enquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-500"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : 
                   status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-500"
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>
                  {priority === 'all' ? 'All Priority' : 
                   priority.charAt(0).toUpperCase() + priority.slice(1)}
                </option>
              ))}
            </select>

            {/* Source Filter */}
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-500"
            >
              {sources.map(source => (
                <option key={source} value={source}>
                  {source === 'all' ? 'All Sources' : 
                   source.charAt(0).toUpperCase() + source.slice(1)}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field as 'date' | 'value' | 'priority');
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-500"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="value-desc">Highest Value</option>
              <option value="value-asc">Lowest Value</option>
              <option value="priority-desc">High Priority</option>
            </select>
          </div>
        </div>

        {/* Enquiries Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEnquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10">
                          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {enquiry.customerName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {enquiry.customerName}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {enquiry.customerEmail}
                          </div>
                          {enquiry.customerPhone && (
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {enquiry.customerPhone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {enquiry.granites.slice(0, 2).map((granite, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium text-gray-900">{granite.name}</span>
                            <span className="text-gray-500 ml-2">({granite.quantity} sq ft)</span>
                          </div>
                        ))}
                        {enquiry.granites.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{enquiry.granites.length - 2} more
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-2">
                        {getStatusBadge(enquiry.status)}
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          {getSourceIcon(enquiry.source)}
                          <span>{enquiry.source}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityBadge(enquiry.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {enquiry.totalEstimatedValue 
                          ? formatCurrency(enquiry.totalEstimatedValue)
                          : 'TBD'
                        }
                      </div>
                      {enquiry.assignedTo && (
                        <div className="text-xs text-gray-500">
                          Assigned to: {enquiry.assignedTo}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(enquiry.createdAt)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Updated: {formatDate(enquiry.updatedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedEnquiry(enquiry);
                            setShowDetailModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {/* Status Update Dropdown */}
                        <select
                          value={enquiry.status}
                          onChange={(e) => updateEnquiryStatus(enquiry.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-600"
                          disabled={loading}
                        >
                          <option value="pending">Pending</option>
                          <option value="contacted">Contacted</option>
                          <option value="quoted">Quoted</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>

                        <a
                          href={`mailto:${enquiry.customerEmail}`}
                          className="text-green-600 hover:text-green-900 transition-colors"
                          title="Send Email"
                        >
                          <Mail className="w-4 h-4" />
                        </a>

                        <a
                          href={`tel:${enquiry.customerPhone}`}
                          className="text-amber-600 hover:text-amber-900 transition-colors"
                          title="Call Customer"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* No Results */}
        {filteredEnquiries.length === 0 && (
          <div className="text-center py-12">
            <Mail className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No enquiries found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or check back later for new enquiries.
            </p>
          </div>
        )}

        {/* Pagination would go here */}
        {filteredEnquiries.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {filteredEnquiries.length} of {enquiries.length} enquiries
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                Previous
              </button>
              <span className="px-3 py-1 text-sm bg-amber-100 text-amber-800 rounded">
                1
              </span>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enquiry Detail Modal */}
      {showDetailModal && selectedEnquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Enquiry Details - {selectedEnquiry.customerName}
                </h2>
                <p className="text-sm text-gray-600">
                  ID: {selectedEnquiry.id} | Created: {formatDate(selectedEnquiry.createdAt)}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedEnquiry(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{selectedEnquiry.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <a href={`mailto:${selectedEnquiry.customerEmail}`} className="text-blue-600 hover:text-blue-800">
                        {selectedEnquiry.customerEmail}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <a href={`tel:${selectedEnquiry.customerPhone}`} className="text-blue-600 hover:text-blue-800">
                        {selectedEnquiry.customerPhone}
                      </a>
                    </div>
                    {selectedEnquiry.customerAddress && (
                      <div className="flex items-start gap-2">
                        <Package className="w-4 h-4 text-gray-500 mt-1" />
                        <span>{selectedEnquiry.customerAddress}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Enquiry Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Status:</span>
                      {getStatusBadge(selectedEnquiry.status)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Priority:</span>
                      {getPriorityBadge(selectedEnquiry.priority)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Source:</span>
                      <div className="flex items-center gap-1">
                        {getSourceIcon(selectedEnquiry.source)}
                        <span className="capitalize">{selectedEnquiry.source}</span>
                      </div>
                    </div>
                    {selectedEnquiry.assignedTo && (
                      <div className="flex items-center justify-between">
                        <span>Assigned to:</span>
                        <span className="font-medium">{selectedEnquiry.assignedTo}</span>
                      </div>
                    )}
                    {selectedEnquiry.totalEstimatedValue && (
                      <div className="flex items-center justify-between">
                        <span>Estimated Value:</span>
                        <span className="font-bold text-green-600">
                          {formatCurrency(selectedEnquiry.totalEstimatedValue)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Requested Granites */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Requested Granites</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2">Granite Name</th>
                        <th className="text-left py-2">Quantity</th>
                        <th className="text-left py-2">Size</th>
                        <th className="text-left py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEnquiry.granites.map((granite, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-2 font-medium">{granite.name}</td>
                          <td className="py-2">{granite.quantity} sq ft</td>
                          <td className="py-2 text-sm text-gray-600">{granite.size}</td>
                          <td className="py-2">
                            <Link
                              href={`/granites/${granite.id}`}
                              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Customer Message */}
              {selectedEnquiry.message && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Message</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedEnquiry.message}</p>
                </div>
              )}

              {/* Notes */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Internal Notes</h3>
                {selectedEnquiry.notes.length > 0 ? (
                  <div className="space-y-3">
                    {selectedEnquiry.notes.map((note) => (
                      <div key={note.id} className="bg-white rounded p-3 border border-gray-200">
                        <p className="text-gray-700 mb-2">{note.content}</p>
                        <div className="text-xs text-gray-500">
                          By {note.createdBy} on {formatDate(note.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No notes added yet.</p>
                )}
                
                {/* Add Note Form */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <textarea
                    placeholder="Add a note..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
                    rows={3}
                  />
                  <button className="mt-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Add Note
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                  <Mail className="w-4 h-4" />
                  Send Email
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp
                </button>
              </div>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedEnquiry(null);
                }}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}