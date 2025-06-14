import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Star, TrendingUp, AlertTriangle, Check, X, ArrowLeft, Filter, BookMarked as MarkAsRead, Trash2, Settings, Clock, Car, DollarSign, Gift } from 'lucide-react';

interface Notification {
  id: string;
  type: 'booking' | 'reminder' | 'review' | 'promotion' | 'payment' | 'emergency' | 'system';
  title: string;
  message: string;
  date: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  actionText?: string;
  relatedBookingId?: string;
  imageUrl?: string;
}

interface NotificationsPageProps {
  onClose: () => void;
  onBack: () => void;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ onClose, onBack }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'booking' | 'promotion'>('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'reminder',
          title: 'تذكير بالموعد',
          message: 'لديك موعد غداً في ورشة الخليج للسيارات الساعة 10:00 ص لخدمة تغيير زيت المحرك',
          date: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isRead: false,
          priority: 'high',
          actionText: 'عرض التفاصيل',
          relatedBookingId: 'BK001'
        },
        {
          id: '2',
          type: 'review',
          title: 'قيم الخدمة',
          message: 'يرجى تقييم خدمة الفحص الشامل في مركز النجم الذهبي. رأيك يهمنا!',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000),
          isRead: false,
          priority: 'medium',
          actionText: 'تقييم الآن',
          relatedBookingId: 'BK002'
        },
        {
          id: '3',
          type: 'promotion',
          title: 'عرض خاص - خصم 20%',
          message: 'خصم 20% على جميع خدمات تغيير الزيت هذا الأسبوع. لا تفوت الفرصة!',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          isRead: true,
          priority: 'medium',
          actionText: 'استفد من العرض',
          imageUrl: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg'
        },
        {
          id: '4',
          type: 'booking',
          title: 'تم تأكيد الحجز',
          message: 'تم تأكيد حجزك في ورشة السرعة لخدمة إصلاح الفرامل يوم الأحد الساعة 2:00 م',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          isRead: true,
          priority: 'medium',
          actionText: 'عرض الحجز',
          relatedBookingId: 'BK003'
        },
        {
          id: '5',
          type: 'payment',
          title: 'تم الدفع بنجاح',
          message: 'تم دفع مبلغ 150 ر.س لخدمة تغيير زيت المحرك في ورشة الخليج للسيارات',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          isRead: true,
          priority: 'low',
          actionText: 'عرض الفاتورة'
        },
        {
          id: '6',
          type: 'system',
          title: 'تحديث التطبيق',
          message: 'تم إصدار تحديث جديد للتطبيق يتضمن تحسينات في الأداء وميزات جديدة',
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          isRead: false,
          priority: 'low',
          actionText: 'تحديث الآن'
        },
        {
          id: '7',
          type: 'emergency',
          title: 'تم استلام طلب الطوارئ',
          message: 'تم استلام طلب المساعدة الطارئة وسيتم التواصل معك خلال 10 دقائق',
          date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          isRead: true,
          priority: 'high',
          actionText: 'تتبع الطلب'
        }
      ];

      setNotifications(mockNotifications);
      setFilteredNotifications(mockNotifications);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter notifications
  useEffect(() => {
    let filtered = notifications;

    switch (filter) {
      case 'unread':
        filtered = notifications.filter(n => !n.isRead);
        break;
      case 'booking':
        filtered = notifications.filter(n => ['booking', 'reminder'].includes(n.type));
        break;
      case 'promotion':
        filtered = notifications.filter(n => n.type === 'promotion');
        break;
      default:
        filtered = notifications;
    }

    setFilteredNotifications(filtered);
  }, [notifications, filter]);

  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
    setSelectedNotifications(selectedNotifications.filter(id => id !== notificationId));
  };

  const deleteSelected = () => {
    setNotifications(notifications.filter(n => !selectedNotifications.includes(n.id)));
    setSelectedNotifications([]);
  };

  const toggleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const selectAll = () => {
    setSelectedNotifications(filteredNotifications.map(n => n.id));
  };

  const deselectAll = () => {
    setSelectedNotifications([]);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'booking': return <Calendar className="text-blue-600" size={20} />;
      case 'reminder': return <Clock className="text-orange-600" size={20} />;
      case 'review': return <Star className="text-yellow-600" size={20} />;
      case 'promotion': return <Gift className="text-purple-600" size={20} />;
      case 'payment': return <DollarSign className="text-green-600" size={20} />;
      case 'emergency': return <AlertTriangle className="text-red-600" size={20} />;
      case 'system': return <Settings className="text-gray-600" size={20} />;
      default: return <Bell className="text-gray-600" size={20} />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'الآن';
    if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `منذ ${diffInDays} يوم`;
    
    return date.toLocaleDateString('ar-SA');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الإشعارات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full ml-3"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">الإشعارات</h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-600">{unreadCount} إشعار غير مقروء</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Settings size={20} />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Filters */}
            <div className="flex gap-2">
              {[
                { key: 'all', label: 'الكل', count: notifications.length },
                { key: 'unread', label: 'غير مقروء', count: unreadCount },
                { key: 'booking', label: 'الحجوزات', count: notifications.filter(n => ['booking', 'reminder'].includes(n.type)).length },
                { key: 'promotion', label: 'العروض', count: notifications.filter(n => n.type === 'promotion').length }
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {selectedNotifications.length > 0 ? (
                <>
                  <button
                    onClick={deleteSelected}
                    className="flex items-center bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg transition-colors text-sm"
                  >
                    <Trash2 className="ml-1" size={16} />
                    حذف المحدد ({selectedNotifications.length})
                  </button>
                  <button
                    onClick={deselectAll}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg transition-colors text-sm"
                  >
                    إلغاء التحديد
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={selectAll}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg transition-colors text-sm"
                  >
                    تحديد الكل
                  </button>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="flex items-center bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg transition-colors text-sm"
                    >
                      <Check className="ml-1" size={16} />
                      تحديد كمقروء
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد إشعارات</h3>
            <p className="text-gray-600">
              {filter === 'unread' 
                ? 'جميع الإشعارات مقروءة' 
                : 'لا توجد إشعارات تطابق المعايير المحددة'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow-sm border-l-4 ${getPriorityColor(notification.priority)} ${
                  !notification.isRead ? 'bg-blue-50' : ''
                } ${selectedNotifications.includes(notification.id) ? 'ring-2 ring-blue-500' : ''}`}
              >
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Selection Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={() => toggleSelectNotification(notification.id)}
                      className="mt-1"
                    />

                    {/* Icon */}
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`font-bold ${!notification.isRead ? 'text-blue-900' : 'text-gray-900'}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(notification.date)}
                          </span>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                      </div>

                      <p className={`text-sm mb-3 ${!notification.isRead ? 'text-blue-700' : 'text-gray-600'}`}>
                        {notification.message}
                      </p>

                      {/* Image */}
                      {notification.imageUrl && (
                        <img
                          src={notification.imageUrl}
                          alt=""
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {notification.actionText && (
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
                              {notification.actionText}
                            </button>
                          )}
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm transition-colors"
                            >
                              تحديد كمقروء
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">إعدادات الإشعارات</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">إشعارات الحجوزات</h4>
                  <p className="text-sm text-gray-600">تذكيرات المواعيد وتحديثات الحجز</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">العروض والخصومات</h4>
                  <p className="text-sm text-gray-600">إشعارات العروض الخاصة</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">طلبات التقييم</h4>
                  <p className="text-sm text-gray-600">طلبات تقييم الخدمات المكتملة</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">تحديثات النظام</h4>
                  <p className="text-sm text-gray-600">إشعارات التحديثات والصيانة</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                حفظ الإعدادات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;