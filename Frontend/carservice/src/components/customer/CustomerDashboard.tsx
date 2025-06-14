import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Car, 
  Clock, 
  DollarSign, 
  Heart, 
  Star, 
  Bell, 
  User, 
  CreditCard,
  History,
  Settings,
  ArrowRight,
  TrendingUp,
  MapPin,
  Phone,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

interface CustomerDashboardProps {
  onClose: () => void;
  onNavigate: (page: string) => void;
}

interface DashboardStats {
  totalBookings: number;
  completedServices: number;
  totalSpent: number;
  favoriteWorkshops: number;
  upcomingBookings: number;
  pendingReviews: number;
}

interface RecentBooking {
  id: string;
  workshopName: string;
  service: string;
  date: Date;
  status: 'completed' | 'upcoming' | 'in_progress' | 'cancelled';
  amount: number;
  rating?: number;
}

interface Notification {
  id: string;
  type: 'reminder' | 'booking' | 'review' | 'promotion';
  title: string;
  message: string;
  date: Date;
  isRead: boolean;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onClose, onNavigate }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    completedServices: 0,
    totalSpent: 0,
    favoriteWorkshops: 0,
    upcomingBookings: 0,
    pendingReviews: 0
  });
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      setStats({
        totalBookings: 24,
        completedServices: 18,
        totalSpent: 4250,
        favoriteWorkshops: 5,
        upcomingBookings: 2,
        pendingReviews: 3
      });

      setRecentBookings([
        {
          id: '1',
          workshopName: 'ورشة الخليج للسيارات',
          service: 'تغيير زيت المحرك',
          date: new Date(Date.now() + 24 * 60 * 60 * 1000),
          status: 'upcoming',
          amount: 150
        },
        {
          id: '2',
          workshopName: 'مركز النجم الذهبي',
          service: 'فحص شامل للسيارة',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          status: 'completed',
          amount: 200,
          rating: 5
        },
        {
          id: '3',
          workshopName: 'ورشة السرعة',
          service: 'إصلاح الفرامل',
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          status: 'completed',
          amount: 300
        }
      ]);

      setNotifications([
        {
          id: '1',
          type: 'reminder',
          title: 'تذكير بالموعد',
          message: 'لديك موعد غداً في ورشة الخليج للسيارات الساعة 10:00 ص',
          date: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isRead: false
        },
        {
          id: '2',
          type: 'review',
          title: 'قيم الخدمة',
          message: 'يرجى تقييم خدمة الفحص الشامل في مركز النجم الذهبي',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000),
          isRead: false
        },
        {
          id: '3',
          type: 'promotion',
          title: 'عرض خاص',
          message: 'خصم 20% على خدمات تغيير الزيت هذا الأسبوع',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          isRead: true
        }
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: RecentBooking['status']) => {
    switch (status) {
      case 'upcoming': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-purple-600 bg-purple-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: RecentBooking['status']) => {
    switch (status) {
      case 'upcoming': return 'قادم';
      case 'completed': return 'مكتمل';
      case 'in_progress': return 'قيد التنفيذ';
      case 'cancelled': return 'ملغي';
      default: return 'غير معروف';
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'reminder': return <Clock className="text-blue-600" size={20} />;
      case 'booking': return <Calendar className="text-green-600" size={20} />;
      case 'review': return <Star className="text-yellow-600" size={20} />;
      case 'promotion': return <TrendingUp className="text-purple-600" size={20} />;
      default: return <Bell className="text-gray-600" size={20} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
              <p className="text-gray-600">مرحباً بك، أحمد محمد</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => onNavigate('workshop-list')}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors text-center"
          >
            <Car className="w-8 h-8 mx-auto mb-2" />
            <span className="font-medium">حجز خدمة</span>
          </button>
          <button
            onClick={() => onNavigate('booking-history')}
            className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition-colors text-center"
          >
            <History className="w-8 h-8 mx-auto mb-2" />
            <span className="font-medium">سجل الحجوزات</span>
          </button>
          <button
            onClick={() => onNavigate('favorites')}
            className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg transition-colors text-center"
          >
            <Heart className="w-8 h-8 mx-auto mb-2" />
            <span className="font-medium">المفضلة</span>
          </button>
          <button
            onClick={() => onNavigate('profile')}
            className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg transition-colors text-center"
          >
            <User className="w-8 h-8 mx-auto mb-2" />
            <span className="font-medium">الملف الشخصي</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">إجمالي الحجوزات</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                <p className="text-green-600 text-sm">+3 هذا الشهر</p>
              </div>
              <Calendar className="text-blue-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">الخدمات المكتملة</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedServices}</p>
                <p className="text-green-600 text-sm">معدل إتمام 95%</p>
              </div>
              <CheckCircle className="text-green-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">إجمالي المبلغ المدفوع</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSpent.toLocaleString()} ر.س</p>
                <p className="text-blue-600 text-sm">متوسط 177 ر.س/خدمة</p>
              </div>
              <DollarSign className="text-green-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">الورش المفضلة</p>
                <p className="text-2xl font-bold text-gray-900">{stats.favoriteWorkshops}</p>
                <p className="text-purple-600 text-sm">ورش موثوقة</p>
              </div>
              <Heart className="text-red-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">المواعيد القادمة</p>
                <p className="text-2xl font-bold text-gray-900">{stats.upcomingBookings}</p>
                <p className="text-blue-600 text-sm">خلال الأسبوع القادم</p>
              </div>
              <Clock className="text-blue-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">التقييمات المعلقة</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingReviews}</p>
                <p className="text-yellow-600 text-sm">في انتظار التقييم</p>
              </div>
              <Star className="text-yellow-600" size={32} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">الحجوزات الأخيرة</h2>
                <button
                  onClick={() => onNavigate('booking-history')}
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  عرض الكل
                  <ArrowRight className="mr-1" size={16} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{booking.workshopName}</h3>
                      <p className="text-sm text-gray-600">{booking.service}</p>
                      <p className="text-sm text-gray-500">
                        {booking.date.toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                    <div className="text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                      <p className="text-sm font-bold text-gray-900 mt-1">{booking.amount} ر.س</p>
                      {booking.rating && (
                        <div className="flex items-center justify-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < booking.rating! ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">الإشعارات</h2>
                <button
                  onClick={() => onNavigate('notifications')}
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  عرض الكل
                  <ArrowRight className="mr-1" size={16} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {notifications.slice(0, 4).map((notification) => (
                  <div key={notification.id} className={`flex items-start p-4 rounded-lg ${notification.isRead ? 'bg-gray-50' : 'bg-blue-50'}`}>
                    <div className="ml-3 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${notification.isRead ? 'text-gray-900' : 'text-blue-900'}`}>
                        {notification.title}
                      </h3>
                      <p className={`text-sm ${notification.isRead ? 'text-gray-600' : 'text-blue-700'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.date.toLocaleDateString('ar-SA')} في {notification.date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">روابط سريعة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => onNavigate('payment-methods')}
              className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <CreditCard className="text-blue-600 ml-3" size={20} />
              <span className="text-gray-700">طرق الدفع</span>
            </button>
            <button
              onClick={() => onNavigate('reviews')}
              className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Star className="text-yellow-600 ml-3" size={20} />
              <span className="text-gray-700">التقييمات</span>
            </button>
            <button
              onClick={() => onNavigate('notifications')}
              className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="text-purple-600 ml-3" size={20} />
              <span className="text-gray-700">الإشعارات</span>
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="text-gray-600 ml-3" size={20} />
              <span className="text-gray-700">الإعدادات</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;