import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Calendar, 
  Star, 
  Clock,
  Car,
  Target,
  ArrowUp,
  ArrowDown,
  Filter,
  Download,
  RefreshCw,
  Eye,
  MapPin
} from 'lucide-react';

interface AnalyticsData {
  revenue: {
    total: number;
    change: number;
    trend: 'up' | 'down';
    monthly: { month: string; amount: number }[];
  };
  bookings: {
    total: number;
    change: number;
    trend: 'up' | 'down';
    completed: number;
    cancelled: number;
    pending: number;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    change: number;
    trend: 'up' | 'down';
  };
  rating: {
    average: number;
    total: number;
    distribution: { stars: number; count: number }[];
  };
  services: {
    name: string;
    bookings: number;
    revenue: number;
    change: number;
  }[];
  performance: {
    responseTime: number;
    completionRate: number;
    customerSatisfaction: number;
  };
}

interface AnalyticsDashboardProps {
  onClose: () => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ onClose }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'bookings' | 'customers'>('revenue');

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      const mockData: AnalyticsData = {
        revenue: {
          total: 45750,
          change: 12.5,
          trend: 'up',
          monthly: [
            { month: 'يناير', amount: 35000 },
            { month: 'فبراير', amount: 38000 },
            { month: 'مارس', amount: 42000 },
            { month: 'أبريل', amount: 45750 },
            { month: 'مايو', amount: 48000 },
            { month: 'يونيو', amount: 52000 }
          ]
        },
        bookings: {
          total: 156,
          change: 8.3,
          trend: 'up',
          completed: 142,
          cancelled: 8,
          pending: 6
        },
        customers: {
          total: 89,
          new: 23,
          returning: 66,
          change: 15.2,
          trend: 'up'
        },
        rating: {
          average: 4.7,
          total: 134,
          distribution: [
            { stars: 5, count: 89 },
            { stars: 4, count: 32 },
            { stars: 3, count: 8 },
            { stars: 2, count: 3 },
            { stars: 1, count: 2 }
          ]
        },
        services: [
          { name: 'تغيير زيت المحرك', bookings: 45, revenue: 6750, change: 12 },
          { name: 'فحص شامل للسيارة', bookings: 28, revenue: 5600, change: 8 },
          { name: 'إصلاح الفرامل', bookings: 22, revenue: 6600, change: -5 },
          { name: 'صيانة تكييف السيارة', bookings: 18, revenue: 4500, change: 15 },
          { name: 'كهرباء السيارة', bookings: 15, revenue: 3750, change: 3 }
        ],
        performance: {
          responseTime: 12,
          completionRate: 94,
          customerSatisfaction: 4.7
        }
      };

      setAnalyticsData(mockData);
      setIsLoading(false);
    }, 1000);
  }, [timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getChangeIcon = (trend: 'up' | 'down') => {
    return trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />;
  };

  const getChangeColor = (trend: 'up' | 'down') => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل التحليلات...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="text-blue-600 ml-3" size={24} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">لوحة التحليلات</h1>
                <p className="text-gray-600">تحليلات مفصلة لأداء ورشتك</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                dir="rtl"
              >
                <option value="week">الأسبوع الماضي</option>
                <option value="month">الشهر الماضي</option>
                <option value="quarter">الربع الماضي</option>
                <option value="year">السنة الماضية</option>
              </select>
              <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                <Download className="ml-2" size={16} />
                تصدير التقرير
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="text-green-600" size={24} />
              </div>
              <div className={`flex items-center ${getChangeColor(analyticsData.revenue.trend)}`}>
                {getChangeIcon(analyticsData.revenue.trend)}
                <span className="text-sm font-medium mr-1">{analyticsData.revenue.change}%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(analyticsData.revenue.total)}
            </h3>
            <p className="text-gray-600 text-sm">إجمالي الإيرادات</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="text-blue-600" size={24} />
              </div>
              <div className={`flex items-center ${getChangeColor(analyticsData.bookings.trend)}`}>
                {getChangeIcon(analyticsData.bookings.trend)}
                <span className="text-sm font-medium mr-1">{analyticsData.bookings.change}%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{analyticsData.bookings.total}</h3>
            <p className="text-gray-600 text-sm">إجمالي الحجوزات</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="text-purple-600" size={24} />
              </div>
              <div className={`flex items-center ${getChangeColor(analyticsData.customers.trend)}`}>
                {getChangeIcon(analyticsData.customers.trend)}
                <span className="text-sm font-medium mr-1">{analyticsData.customers.change}%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{analyticsData.customers.total}</h3>
            <p className="text-gray-600 text-sm">إجمالي العملاء</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="text-yellow-600" size={24} />
              </div>
              <div className="text-green-600 flex items-center">
                <ArrowUp size={16} />
                <span className="text-sm font-medium mr-1">0.2</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{analyticsData.rating.average}</h3>
            <p className="text-gray-600 text-sm">متوسط التقييم</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">الإيرادات الشهرية</h2>
              <div className="flex gap-2">
                {['revenue', 'bookings', 'customers'].map((metric) => (
                  <button
                    key={metric}
                    onClick={() => setSelectedMetric(metric as any)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      selectedMetric === metric
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {metric === 'revenue' ? 'الإيرادات' : 
                     metric === 'bookings' ? 'الحجوزات' : 'العملاء'}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-64 flex items-end justify-between gap-2">
              {analyticsData.revenue.monthly.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-600 rounded-t-lg transition-all duration-300 hover:bg-blue-700"
                    style={{ height: `${(data.amount / 60000) * 100}%` }}
                  ></div>
                  <p className="text-xs text-gray-600 mt-2 text-center">{data.month}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">مؤشرات الأداء</h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">وقت الاستجابة</span>
                  <span className="font-bold text-gray-900">{analyticsData.performance.responseTime} دقيقة</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${Math.min((30 - analyticsData.performance.responseTime) / 30 * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">معدل الإتمام</span>
                  <span className="font-bold text-gray-900">{analyticsData.performance.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${analyticsData.performance.completionRate}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">رضا العملاء</span>
                  <span className="font-bold text-gray-900">{analyticsData.performance.customerSatisfaction}/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-600 h-2 rounded-full"
                    style={{ width: `${(analyticsData.performance.customerSatisfaction / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Services */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">أفضل الخدمات</h2>
            
            <div className="space-y-4">
              {analyticsData.services.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{service.name}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-600">{service.bookings} حجز</span>
                      <span className="text-sm font-medium text-green-600">
                        {formatCurrency(service.revenue)}
                      </span>
                    </div>
                  </div>
                  <div className={`flex items-center ${service.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {service.change >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                    <span className="text-sm font-medium mr-1">{Math.abs(service.change)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">توزيع التقييمات</h2>
            
            <div className="space-y-3">
              {analyticsData.rating.distribution.map((rating) => (
                <div key={rating.stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm font-medium">{rating.stars}</span>
                    <Star className="text-yellow-500 fill-current" size={14} />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${(rating.count / analyticsData.rating.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{rating.count}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-900">متوسط التقييم</p>
                  <p className="text-2xl font-bold text-blue-600">{analyticsData.rating.average}/5</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-blue-700">إجمالي التقييمات</p>
                  <p className="text-lg font-bold text-blue-600">{analyticsData.rating.total}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Status Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">نظرة عامة على الحجوزات</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="text-green-600" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-1">{analyticsData.bookings.completed}</h3>
              <p className="text-green-700 text-sm">حجوزات مكتملة</p>
            </div>

            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="text-yellow-600" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-yellow-600 mb-1">{analyticsData.bookings.pending}</h3>
              <p className="text-yellow-700 text-sm">حجوزات معلقة</p>
            </div>

            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="text-red-600" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-red-600 mb-1">{analyticsData.bookings.cancelled}</h3>
              <p className="text-red-700 text-sm">حجوزات ملغية</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;