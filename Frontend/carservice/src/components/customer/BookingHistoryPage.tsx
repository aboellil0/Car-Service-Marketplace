import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Car, 
  Clock, 
  DollarSign, 
  Download, 
  Eye, 
  Filter, 
  MapPin, 
  Phone, 
  Search, 
  Star, 
  X,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Printer,
  RefreshCw
} from 'lucide-react';

interface Booking {
  id: string;
  workshopName: string;
  workshopPhone: string;
  workshopAddress: string;
  service: string;
  description: string;
  vehicleDetails: string;
  bookingDate: Date;
  serviceDate: Date;
  completionDate?: Date;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  amount: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  rating?: number;
  review?: string;
  invoiceNumber: string;
  duration: number;
  technician?: string;
  notes?: string;
}

interface BookingHistoryPageProps {
  onClose: () => void;
  onBack: () => void;
}

const BookingHistoryPage: React.FC<BookingHistoryPageProps> = ({ onClose, onBack }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      const mockBookings: Booking[] = [
        {
          id: 'BK001',
          workshopName: 'ورشة الخليج للسيارات',
          workshopPhone: '0112345678',
          workshopAddress: 'شارع الملك فهد، حي العليا، الرياض',
          service: 'تغيير زيت المحرك',
          description: 'تغيير زيت المحرك مع الفلتر وفحص السوائل',
          vehicleDetails: 'تويوتا كامري 2020 - أبيض',
          bookingDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          serviceDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          status: 'confirmed',
          amount: 150,
          paymentMethod: 'بطاقة ائتمان',
          paymentStatus: 'paid',
          invoiceNumber: 'INV-2024-001',
          duration: 30,
          technician: 'محمد أحمد'
        },
        {
          id: 'BK002',
          workshopName: 'مركز النجم الذهبي',
          workshopPhone: '0112345679',
          workshopAddress: 'طريق الملك عبدالعزيز، حي الملز، الرياض',
          service: 'فحص شامل للسيارة',
          description: 'فحص شامل لجميع أجزاء السيارة مع تقرير مفصل',
          vehicleDetails: 'هوندا أكورد 2019 - فضي',
          bookingDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          serviceDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          completionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          status: 'completed',
          amount: 200,
          paymentMethod: 'نقداً',
          paymentStatus: 'paid',
          rating: 5,
          review: 'خدمة ممتازة وفريق محترف',
          invoiceNumber: 'INV-2024-002',
          duration: 120,
          technician: 'علي محمد',
          notes: 'تم العثور على تسريب بسيط في نظام التبريد'
        },
        {
          id: 'BK003',
          workshopName: 'ورشة السرعة',
          workshopPhone: '0112345680',
          workshopAddress: 'شارع الأمير محمد بن عبدالعزيز، حي السليمانية، الرياض',
          service: 'إصلاح الفرامل',
          description: 'تغيير أقراص الفرامل الأمامية وتيل الفرامل',
          vehicleDetails: 'نيسان التيما 2018 - أسود',
          bookingDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          serviceDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          completionDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          status: 'completed',
          amount: 300,
          paymentMethod: 'تحويل بنكي',
          paymentStatus: 'paid',
          rating: 4,
          review: 'خدمة جيدة ولكن التأخير قليلاً',
          invoiceNumber: 'INV-2024-003',
          duration: 90,
          technician: 'خالد سعد'
        },
        {
          id: 'BK004',
          workshopName: 'مركز الصيانة المتقدم',
          workshopPhone: '0112345681',
          workshopAddress: 'طريق الدائري الشرقي، حي النرجس، الرياض',
          service: 'صيانة تكييف السيارة',
          description: 'تنظيف وصيانة نظام التكييف وتعبئة الفريون',
          vehicleDetails: 'لكزس ES 2021 - أزرق',
          bookingDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          serviceDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
          status: 'cancelled',
          amount: 250,
          paymentMethod: 'بطاقة ائتمان',
          paymentStatus: 'refunded',
          invoiceNumber: 'INV-2024-004',
          duration: 60,
          notes: 'تم الإلغاء بناءً على طلب العميل'
        }
      ];

      setBookings(mockBookings);
      setFilteredBookings(mockBookings);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter bookings
  useEffect(() => {
    let filtered = bookings.filter(booking => {
      const matchesSearch = booking.workshopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           booking.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           booking.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      
      let matchesDate = true;
      if (dateFilter !== 'all') {
        const now = new Date();
        const bookingDate = booking.serviceDate;
        
        switch (dateFilter) {
          case 'week':
            matchesDate = (now.getTime() - bookingDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
            break;
          case 'month':
            matchesDate = (now.getTime() - bookingDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
            break;
          case 'year':
            matchesDate = (now.getTime() - bookingDate.getTime()) <= 365 * 24 * 60 * 60 * 1000;
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter, dateFilter]);

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

  const getPaymentStatusColor = (status: Booking['paymentStatus']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'paid': return 'text-green-600 bg-green-100';
      case 'refunded': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusText = (status: Booking['paymentStatus']) => {
    switch (status) {
      case 'pending': return 'في الانتظار';
      case 'paid': return 'مدفوع';
      case 'refunded': return 'مسترد';
      default: return 'غير معروف';
    }
  };

  const handleDownloadInvoice = (booking: Booking) => {
    // Mock download functionality
    console.log('Downloading invoice for booking:', booking.id);
    alert(`تم تحميل فاتورة رقم ${booking.invoiceNumber}`);
  };

  const handlePrintInvoice = (booking: Booking) => {
    // Mock print functionality
    console.log('Printing invoice for booking:', booking.id);
    alert(`تم إرسال فاتورة رقم ${booking.invoiceNumber} للطباعة`);
  };

  if (selectedBooking) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <button
              onClick={() => setSelectedBooking(null)}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <ArrowLeft className="ml-2" size={20} />
              العودة للقائمة
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">تفاصيل الحجز</h1>
                <p className="text-gray-600">رقم الحجز: {selectedBooking.id}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownloadInvoice(selectedBooking)}
                  className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Download className="ml-2" size={16} />
                  تحميل الفاتورة
                </button>
                <button
                  onClick={() => handlePrintInvoice(selectedBooking)}
                  className="flex items-center bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Printer className="ml-2" size={16} />
                  طباعة
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Service Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Car className="ml-2 text-blue-600" size={20} />
                  معلومات الخدمة
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">اسم الخدمة</label>
                    <p className="text-lg font-medium text-gray-900">{selectedBooking.service}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">الوصف</label>
                    <p className="text-gray-700">{selectedBooking.description}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">تفاصيل السيارة</label>
                    <p className="text-gray-700">{selectedBooking.vehicleDetails}</p>
                  </div>
                  {selectedBooking.technician && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">الفني المسؤول</label>
                      <p className="text-gray-700">{selectedBooking.technician}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-600">مدة الخدمة</label>
                    <p className="text-gray-700">{selectedBooking.duration} دقيقة</p>
                  </div>
                </div>
              </div>

              {/* Workshop Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <MapPin className="ml-2 text-green-600" size={20} />
                  معلومات الورشة
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">اسم الورشة</label>
                    <p className="text-lg font-medium text-gray-900">{selectedBooking.workshopName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">العنوان</label>
                    <p className="text-gray-700">{selectedBooking.workshopAddress}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">رقم الهاتف</label>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-700">{selectedBooking.workshopPhone}</p>
                      <button
                        onClick={() => window.open(`tel:${selectedBooking.workshopPhone}`)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Phone size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes and Review */}
              {(selectedBooking.notes || selectedBooking.review) && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <FileText className="ml-2 text-purple-600" size={20} />
                    ملاحظات وتقييم
                  </h2>
                  <div className="space-y-4">
                    {selectedBooking.notes && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">ملاحظات الفني</label>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedBooking.notes}</p>
                      </div>
                    )}
                    {selectedBooking.review && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">تقييمك</label>
                        <div className="flex items-center gap-2 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${i < (selectedBooking.rating || 0) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                          <span className="text-gray-600">({selectedBooking.rating}/5)</span>
                        </div>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedBooking.review}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status and Dates */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold mb-4">حالة الحجز</h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.status)}`}>
                      {getStatusText(selectedBooking.status)}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">تاريخ الحجز</label>
                    <p className="text-gray-700">{selectedBooking.bookingDate.toLocaleDateString('ar-SA')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">تاريخ الخدمة</label>
                    <p className="text-gray-700">{selectedBooking.serviceDate.toLocaleDateString('ar-SA')}</p>
                  </div>
                  {selectedBooking.completionDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">تاريخ الإتمام</label>
                      <p className="text-gray-700">{selectedBooking.completionDate.toLocaleDateString('ar-SA')}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold mb-4">معلومات الدفع</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">المبلغ الإجمالي</label>
                    <p className="text-2xl font-bold text-green-600">{selectedBooking.amount} ر.س</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">طريقة الدفع</label>
                    <p className="text-gray-700">{selectedBooking.paymentMethod}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">حالة الدفع</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(selectedBooking.paymentStatus)}`}>
                      {getPaymentStatusText(selectedBooking.paymentStatus)}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">رقم الفاتورة</label>
                    <p className="text-gray-700 font-mono">{selectedBooking.invoiceNumber}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold mb-4">الإجراءات</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => handleDownloadInvoice(selectedBooking)}
                    className="w-full flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-4 rounded-lg transition-colors"
                  >
                    <Download className="ml-2" size={16} />
                    تحميل الفاتورة
                  </button>
                  <button
                    onClick={() => window.open(`tel:${selectedBooking.workshopPhone}`)}
                    className="w-full flex items-center justify-center bg-green-100 hover:bg-green-200 text-green-700 py-2 px-4 rounded-lg transition-colors"
                  >
                    <Phone className="ml-2" size={16} />
                    اتصال بالورشة
                  </button>
                  {selectedBooking.status === 'completed' && !selectedBooking.rating && (
                    <button className="w-full flex items-center justify-center bg-yellow-100 hover:bg-yellow-200 text-yellow-700 py-2 px-4 rounded-lg transition-colors">
                      <Star className="ml-2" size={16} />
                      تقييم الخدمة
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full ml-3"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">سجل الحجوزات</h1>
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

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="البحث في الحجوزات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                dir="rtl"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              dir="rtl"
            >
              <option value="all">جميع الحالات</option>
              <option value="pending">في الانتظار</option>
              <option value="confirmed">مؤكد</option>
              <option value="in_progress">قيد التنفيذ</option>
              <option value="completed">مكتمل</option>
              <option value="cancelled">ملغي</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              dir="rtl"
            >
              <option value="all">جميع التواريخ</option>
              <option value="week">الأسبوع الماضي</option>
              <option value="month">الشهر الماضي</option>
              <option value="year">السنة الماضية</option>
            </select>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDateFilter('all');
              }}
              className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className="ml-2" size={16} />
              إعادة تعيين
            </button>
          </div>
        </div>

        {/* Bookings List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل الحجوزات...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد حجوزات</h3>
            <p className="text-gray-600">لم يتم العثور على حجوزات تطابق المعايير المحددة</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{booking.workshopName}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-1">{booking.service}</p>
                    <p className="text-sm text-gray-500">رقم الحجز: {booking.id}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-green-600">{booking.amount} ر.س</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                      {getPaymentStatusText(booking.paymentStatus)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center">
                    <Calendar className="text-gray-400 ml-2" size={16} />
                    <div>
                      <p className="text-sm text-gray-600">تاريخ الخدمة</p>
                      <p className="font-medium">{booking.serviceDate.toLocaleDateString('ar-SA')}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="text-gray-400 ml-2" size={16} />
                    <div>
                      <p className="text-sm text-gray-600">المدة</p>
                      <p className="font-medium">{booking.duration} دقيقة</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Car className="text-gray-400 ml-2" size={16} />
                    <div>
                      <p className="text-sm text-gray-600">السيارة</p>
                      <p className="font-medium">{booking.vehicleDetails.split(' - ')[0]}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="text-gray-400 ml-2" size={16} />
                    <div>
                      <p className="text-sm text-gray-600">طريقة الدفع</p>
                      <p className="font-medium">{booking.paymentMethod}</p>
                    </div>
                  </div>
                </div>

                {booking.rating && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-gray-600">تقييمك:</span>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < booking.rating! ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-sm text-gray-600">({booking.rating}/5)</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="flex items-center bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg transition-colors text-sm"
                    >
                      <Eye className="ml-1" size={16} />
                      عرض التفاصيل
                    </button>
                    <button
                      onClick={() => handleDownloadInvoice(booking)}
                      className="flex items-center bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg transition-colors text-sm"
                    >
                      <Download className="ml-1" size={16} />
                      الفاتورة
                    </button>
                    <button
                      onClick={() => window.open(`tel:${booking.workshopPhone}`)}
                      className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors text-sm"
                    >
                      <Phone className="ml-1" size={16} />
                      اتصال
                    </button>
                  </div>
                  
                  {booking.status === 'completed' && !booking.rating && (
                    <button className="flex items-center bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-2 rounded-lg transition-colors text-sm">
                      <Star className="ml-1" size={16} />
                      تقييم الخدمة
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistoryPage;