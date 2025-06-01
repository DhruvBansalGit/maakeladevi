'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Mail, 
  Eye, 
  Plus, 
  TrendingUp, 
  Users, 
  ShoppingCart,
  BarChart3,
  Calendar,
  Bell,
  Settings,
  LogOut
} from 'lucide-react';

interface DashboardStats {
  totalGranites: number;
  totalEnquiries: number;
  pendingEnquiries: number;
  monthlyViews: number;
  popularGranites: Array<{
    id: string;
    name: string;
    views: number;
    enquiries: number;
  }>;
  recentEnquiries: Array<{
    id: string;
    customerName: string;
    customerEmail: string;
    granites: string[];
    createdAt: string;
    status: 'pending' | 'contacted' | 'completed';
  }>;
}

// Mock data - replace with actual API calls
const mockStats: DashboardStats = {
  totalGranites: 25,
  totalEnquiries: 148,
  pendingEnquiries: 12,
  monthlyViews: 2847,
  popularGranites: [
    { id: '1', name: 'Kashmir White', views: 234, enquiries: 18 },
    { id: '2', name: 'Black Galaxy', views: 198, enquiries: 15 },
    { id: '3', name: 'Tan Brown', views: 167, enquiries: 12 },
  ],
  recentEnquiries: [
    {
      id: '1',
      customerName: 'Rahul Sharma',
      customerEmail: 'rahul@example.com',
      granites: ['Kashmir White', 'Black Galaxy'],
      createdAt: '2025-05-30T10:30:00Z',
      status: 'pending'
    },
    {
      id: '2',
      customerName: 'Priya Patel',
      customerEmail: 'priya@example.com',
      granites: ['Tan Brown'],
      createdAt: '2025-05-30T09:15:00Z',
      status: 'contacted'
    },
    {
      id: '3',
      customerName: 'Amit Kumar',
      customerEmail: 'amit@example.com',
      granites: ['Blue Pearl', 'Imperial Red'],
      createdAt: '2025-05-29T16:45:00Z',
      status: 'pending'
    }
  ]
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch dashboard stats
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      // const response = await fetch('/api/admin/dashboard');
      // const data = await response.json();
      // setStats(data);
      
      // Simulate API delay
      setTimeout(() => {
        setStats(mockStats);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
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

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      contacted: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-black">
        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/admin/granites/new"
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add New Granite
            </Link>
            <Link
              href="/admin/granites"
              className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 border border-gray-300 shadow-sm"
            >
              <Package className="w-5 h-5" />
              Manage Granites
            </Link>
            <Link
              href="/admin/enquiries"
              className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 border border-gray-300 shadow-sm"
            >
              <Mail className="w-5 h-5" />
              View Enquiries
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Granites</p>
                <p className="text-3xl font-bold">{stats.totalGranites}</p>
              </div>
              <Package className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-6 rounded-2xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">Total Enquiries</p>
                <p className="text-3xl font-bold">{stats.totalEnquiries}</p>
              </div>
              <Mail className="w-8 h-8 text-amber-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-2xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Pending Enquiries</p>
                <p className="text-3xl font-bold">{stats.pendingEnquiries}</p>
              </div>
              <Bell className="w-8 h-8 text-red-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Monthly Views</p>
                <p className="text-3xl font-bold">{stats.monthlyViews.toLocaleString()}</p>
              </div>
              <Eye className="w-8 h-8 text-green-200" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Popular Granites */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Popular Granites</h2>
              <TrendingUp className="w-5 h-5 text-amber-500" />
            </div>
            <div className="space-y-4">
              {stats.popularGranites.map((granite, index) => (
                <div key={granite.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{granite.name}</h3>
                      <p className="text-sm text-gray-600">{granite.views} views</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{granite.enquiries}</p>
                    <p className="text-sm text-gray-600">enquiries</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/admin/analytics"
              className="block text-center mt-4 text-amber-600 hover:text-amber-700 font-medium transition-colors"
            >
              View Detailed Analytics →
            </Link>
          </div>

          {/* Recent Enquiries */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Enquiries</h2>
              <Mail className="w-5 h-5 text-blue-500" />
            </div>
            <div className="space-y-4">
              {stats.recentEnquiries.map((enquiry) => (
                <div key={enquiry.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{enquiry.customerName}</h3>
                      <p className="text-sm text-gray-600">{enquiry.customerEmail}</p>
                    </div>
                    {getStatusBadge(enquiry.status)}
                  </div>
                  <div className="mb-2">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Granites:</span> {enquiry.granites.join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">{formatDate(enquiry.createdAt)}</p>
                    <Link
                      href={`/admin/enquiries/${enquiry.id}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/admin/enquiries"
              className="block text-center mt-4 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              View All Enquiries →
            </Link>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">New Customers</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
                <p className="text-sm text-green-600">+12% this month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">8.2%</p>
                <p className="text-sm text-green-600">+2.1% this month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Revenue Growth</p>
                <p className="text-2xl font-bold text-gray-900">+18%</p>
                <p className="text-sm text-green-600">vs last month</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}