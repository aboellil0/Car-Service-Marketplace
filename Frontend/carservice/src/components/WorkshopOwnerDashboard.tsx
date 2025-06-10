import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Calendar, 
  Car, 
  Clock, 
  DollarSign, 
  Edit, 
  Eye, 
  MapPin, 
  Phone, 
  Plus, 
  Settings, 
  Star, 
  TrendingUp, 
  Users, 
  X,
  Save,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  isActive: boolean;
}

interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  service: string;
  scheduledDate: Date;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  totalAmount: number;
  vehicleDetails: string;
}

interface WorkshopProfile {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  openingHours: string;
  specialties: string[];
  images: string[];
}

interface WorkshopOwnerDashboardProps {
  onClose: () => void;
}

const WorkshopOwnerDashboard: React.FC<WorkshopOwnerDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'services' | 'profile'>('dashboard');
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profile, setProfile] = useState<WorkshopProfile>({
    name: 'ورشة الخليج للسيارات',
    description: 'ورشة متخصصة في صيانة جميع أنواع السيارات مع خبرة 15 عام',
    address: 'شارع الملك فهد، حي العليا',
    city: 'الرياض',
    state: 'منطقة الرياض',
    phone: '0112345678',
    email: 'info@gulf-auto.com',
    openingHours: '8:00 ص - 10:00 م',
    specialties: ['تويوتا', 'هوندا', 'نيسان'],
    images: ['https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg']
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newService, setNewService] = useState<Partial<Service>>({
    name: '',
    description: '',
    price: 0,
    duration: 60,
    category: '',
    isActive: true
  });

  const serviceCategories = [
    'صيانة عامة',
    'تغيير زيت',
    'فحص دوري',
    'إصلاح المحرك',
    'إصلاح الفرامل',
    'تكييف السيارة',
    'كهرباء السيارة',
    'إطارات'
  ];

  // Mock data
  useEffect(() => {
    const mockServices: Service[] = [
      {
        id: '1',
        name: 'تغيير زيت المحرك',
        description: 'تغيير زيت المحرك مع الفلتر',
        price: 150,
        duration: 30,
        category: 'تغيير زيت',
        isActive: true
      },
      {
        id: '2',
        name: 'فحص شامل للسيارة',
        description: 'فحص شامل لجميع أجزاء السيارة',
        price: 200,
        duration: 120,
        category: 'فحص دوري',
        isActive: true
      },
      {
        id: '3',
        name: 'إصلاح الفرامل',
        description: 'فحص وإصلاح نظام الفرامل',
        price: 300,
        duration: 90,
        category: 'إصلاح الفرامل',
        isActive: false
      }
    ];

    const mockBookings: Booking[] = [
      {
        id: '1',
        customerName: 'أحمد محمد',
        customerPhone: '0501234567',
        service: 'تغيير زيت المحرك',
        scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: 'confirmed',
        totalAmount: 150,
        vehicleDetails: 'تويوتا كامري 2020'
      },
      {
        id: '2',
        customerName: 'فاطمة علي',
        customerPhone: '0507654321',
        service: 'فحص شامل للسيارة',
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: 'pending',
        totalAmount: 200,
        vehicleDetails: 'هوندا أكورد 2019'
      }
    ];

    setServices(mockServices);
    setBookings(mockBookings);
  }, []);

  const handleServiceSubmit = () => {
    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? { ...editingService, ...newService } : s));
    } else {
      const service: Service = {
        id: Date.now().toString(),
        name: newService.name!,
        description: newService.description!,
        price: newService.price!,
        duration: newService.duration!,
        category: newService.category!,
        isActive: newService.isActive!
      };
      setServices([...services, service]);
    }
    setShowServiceModal(false);
    setEditingService(null);
    setNewService({
      name: '',
      description: '',
      price: 0,
      duration: 60,
      category: '',
      isActive: true
    });
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setNewService(service);
    setShowServiceModal(true);
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(services.filter(s => s.id !== serviceId));
  };

  const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, status } : b));
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'in_progress': return 'text-purple-600 bg-purple-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return 'في الانتظار';
      case 'confirmed': return 'مؤكد';
      case 'in_progress': return 'قيد التنفيذ';
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغي';
      default: return 'غير معروف';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">الحجوزات اليوم</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <Calendar className="text-blue-600" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">الإيرادات الشهرية</p>
              <p className="text-2xl font-bold text-gray-900">15,750 ر.س</p>
            </div>
            <DollarSign className="text-green-600" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">العملاء الجدد</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <Users className="text-purple-600" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">متوسط التقييم</p>
              <p className="text-2xl font-bold text-gray-900">4.8</p>
            </div>
            <Star className="text-yellow-600" size={32} />
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">الحجوزات الأخيرة</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {bookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{booking.customerName}</h3>
                  <p className="text-sm text-gray-600">{booking.service} - {booking.vehicleDetails}</p>
                  <p className="text-sm text-gray-500">
                    {booking.scheduledDate.toLocaleDateString('ar-SA')} في {booking.scheduledDate.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                    {getStatusText(booking.status)}
                  </span>
                  <span className="font-bold text-green-600">{booking.totalAmount} ر.س</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">إدارة الحجوزات</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{booking.customerName}</h3>
                  <p className="text-gray-600">{booking.service}</p>
                  <p className="text-sm text-gray-500">{booking.vehicleDetails}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                  {getStatusText(booking.status)}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center">
                  <Phone className="text-gray-400 ml-2" size={16} />
                  <span className="text-gray-700">{booking.customerPhone}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="text-gray-400 ml-2" size={16} />
                  <span className="text-gray-700">
                    {booking.scheduledDate.toLocaleDateString('ar-SA')}
                  </span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="text-gray-400 ml-2" size={16} />
                  <span className="text-gray-700">{booking.totalAmount} ر.س</span>
                </div>
              </div>

              <div className="flex gap-2">
                {booking.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                      className="flex items-center bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg transition-colors text-sm"
                    >
                      <CheckCircle className="ml-1" size={16} />
                      تأكيد
                    </button>
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                      className="flex items-center bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg transition-colors text-sm"
                    >
                      <XCircle className="ml-1" size={16} />
                      إلغاء
                    </button>
                  </>
                )}
                {booking.status === 'confirmed' && (
                  <button
                    onClick={() => updateBookingStatus(booking.id, 'in_progress')}
                    className="flex items-center bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg transition-colors text-sm"
                  >
                    <Clock className="ml-1" size={16} />
                    بدء العمل
                  </button>
                )}
                {booking.status === 'in_progress' && (
                  <button
                    onClick={() => updateBookingStatus(booking.id, 'completed')}
                    className="flex items-center bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg transition-colors text-sm"
                  >
                    <CheckCircle className="ml-1" size={16} />
                    إتمام
                  </button>
                )}
                <button
                  onClick={() => window.open(`tel:${booking.customerPhone}`)}
                  className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors text-sm"
                >
                  <Phone className="ml-1" size={16} />
                  اتصال
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">إدارة الخدمات</h2>
          <button
            onClick={() => setShowServiceModal(true)}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="ml-2" size={16} />
            إضافة خدمة
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div key={service.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {service.category}
                  </span>
                </div>
                <div className={`w-3 h-3 rounded-full ${service.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-green-600">{service.price} ر.س</span>
                <span className="text-sm text-gray-500">{service.duration} دقيقة</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditService(service)}
                  className="flex items-center bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg transition-colors text-sm flex-1"
                >
                  <Edit className="ml-1" size={14} />
                  تعديل
                </button>
                <button
                  onClick={() => handleDeleteService(service.id)}
                  className="flex items-center bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg transition-colors text-sm"
                >
                  <Trash2 className="ml-1" size={14} />
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">ملف الورشة</h2>
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {isEditingProfile ? <Save className="ml-2" size={16} /> : <Edit className="ml-2" size={16} />}
            {isEditingProfile ? 'حفظ' : 'تعديل'}
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">اسم الورشة</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                disabled={!isEditingProfile}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
              <textarea
                value={profile.description}
                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                disabled={!isEditingProfile}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 min-h-[100px]"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                disabled={!isEditingProfile}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                dir="rtl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المدينة</label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  disabled={!isEditingProfile}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المنطقة</label>
                <input
                  type="text"
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  disabled={!isEditingProfile}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  dir="rtl"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                disabled={!isEditingProfile}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                disabled={!isEditingProfile}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ساعات العمل</label>
              <input
                type="text"
                value={profile.openingHours}
                onChange={(e) => setProfile({ ...profile, openingHours: e.target.value })}
                disabled={!isEditingProfile}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">التخصصات</label>
              <input
                type="text"
                value={profile.specialties.join(', ')}
                onChange={(e) => setProfile({ ...profile, specialties: e.target.value.split(', ') })}
                disabled={!isEditingProfile}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder="مثال: تويوتا, هوندا, نيسان"
                dir="rtl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم الورشة</h1>
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

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8 space-x-reverse">
            {[
              { key: 'dashboard', label: 'الرئيسية', icon: BarChart3 },
              { key: 'bookings', label: 'الحجوزات', icon: Calendar },
              { key: 'services', label: 'الخدمات', icon: Car },
              { key: 'profile', label: 'الملف الشخصي', icon: Settings }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="ml-2" size={16} />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'services' && renderServices()}
        {activeTab === 'profile' && renderProfile()}
      </div>

      {/* Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">
                {editingService ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
              </h3>
              <button
                onClick={() => {
                  setShowServiceModal(false);
                  setEditingService(null);
                  setNewService({
                    name: '',
                    description: '',
                    price: 0,
                    duration: 60,
                    category: '',
                    isActive: true
                  });
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اسم الخدمة</label>
                <input
                  type="text"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                <textarea
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                  dir="rtl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">السعر (ر.س)</label>
                  <input
                    type="number"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المدة (دقيقة)</label>
                  <input
                    type="number"
                    value={newService.duration}
                    onChange={(e) => setNewService({ ...newService, duration: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="15"
                    step="15"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الفئة</label>
                <select
                  value={newService.category}
                  onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  dir="rtl"
                >
                  <option value="">اختر الفئة</option>
                  {serviceCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={newService.isActive}
                  onChange={(e) => setNewService({ ...newService, isActive: e.target.checked })}
                  className="ml-2"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">الخدمة متاحة</label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowServiceModal(false);
                  setEditingService(null);
                  setNewService({
                    name: '',
                    description: '',
                    price: 0,
                    duration: 60,
                    category: '',
                    isActive: true
                  });
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleServiceSubmit}
                disabled={!newService.name || !newService.category}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                {editingService ? 'تحديث' : 'إضافة'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkshopOwnerDashboard;