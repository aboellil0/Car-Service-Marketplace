import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Phone, 
  Car, 
  MapPin, 
  X, 
  Clock,
  CheckCircle,
  XCircle,
  Navigation,
  User,
  MessageSquare,
  ExternalLink,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react';

interface EmergencyRequest {
  id: string;
  customerName: string;
  phone: string;
  emergencyType: string;
  description: string;
  vehicleDetails: string;
  city: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  requestTime: Date;
  estimatedArrival?: number;
  priority: 'high' | 'medium' | 'low';
  distance?: number;
}

interface WorkshopEmergencyPageProps {
  onClose: () => void;
}

const WorkshopEmergencyPage: React.FC<WorkshopEmergencyPageProps> = ({ onClose }) => {
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<EmergencyRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'in_progress'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseType, setResponseType] = useState<'accept' | 'reject'>('accept');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  // Mock data for demonstration
  useEffect(() => {
    const mockRequests: EmergencyRequest[] = [
      {
        id: 'EM001',
        customerName: 'أحمد محمد',
        phone: '0501234567',
        emergencyType: 'عطل في السيارة',
        description: 'السيارة لا تعمل والمحرك يصدر أصوات غريبة',
        vehicleDetails: 'تويوتا كامري 2018',
        city: 'الرياض',
        location: {
          latitude: 24.7136,
          longitude: 46.6753,
          address: 'شارع الملك فهد، الرياض'
        },
        status: 'pending',
        requestTime: new Date(Date.now() - 5 * 60 * 1000),
        priority: 'high',
        distance: 2.5
      },
      {
        id: 'EM002',
        customerName: 'فاطمة علي',
        phone: '0507654321',
        emergencyType: 'إطار مثقوب',
        description: 'إطار أمامي مثقوب في الطريق السريع',
        vehicleDetails: 'هوندا أكورد 2020',
        city: 'الرياض',
        location: {
          latitude: 24.6877,
          longitude: 46.7219,
          address: 'طريق الملك عبدالعزيز، الرياض'
        },
        status: 'pending',
        requestTime: new Date(Date.now() - 12 * 60 * 1000),
        priority: 'medium',
        distance: 5.2
      },
      {
        id: 'EM003',
        customerName: 'خالد السعد',
        phone: '0509876543',
        emergencyType: 'بطارية فارغة',
        description: 'البطارية فارغة ولا تعمل السيارة',
        vehicleDetails: 'نيسان التيما 2019',
        city: 'الرياض',
        location: {
          latitude: 24.7453,
          longitude: 46.6291,
          address: 'حي العليا، الرياض'
        },
        status: 'accepted',
        requestTime: new Date(Date.now() - 25 * 60 * 1000),
        priority: 'medium',
        distance: 3.8,
        estimatedArrival: 15
      }
    ];

    setTimeout(() => {
      setRequests(mockRequests);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredRequests = requests.filter(request => {
    const matchesFilter = filter === 'all' || request.status === filter;
    const matchesSearch = request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.emergencyType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.vehicleDetails.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleRequestResponse = (request: EmergencyRequest, type: 'accept' | 'reject') => {
    setSelectedRequest(request);
    setResponseType(type);
    setShowResponseModal(true);
  };

  const submitResponse = () => {
    if (!selectedRequest) return;

    const updatedRequests = requests.map(req => {
      if (req.id === selectedRequest.id) {
        return {
          ...req,
          status: responseType === 'accept' ? 'accepted' as const : 'cancelled' as const,
          estimatedArrival: responseType === 'accept' ? parseInt(estimatedTime) : undefined
        };
      }
      return req;
    });

    setRequests(updatedRequests);
    setShowResponseModal(false);
    setSelectedRequest(null);
    setEstimatedTime('');
    setResponseMessage('');
  };

  const updateRequestStatus = (requestId: string, newStatus: EmergencyRequest['status']) => {
    const updatedRequests = requests.map(req => {
      if (req.id === requestId) {
        return { ...req, status: newStatus };
      }
      return req;
    });
    setRequests(updatedRequests);
  };

  const getStatusColor = (status: EmergencyRequest['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'accepted': return 'text-blue-600 bg-blue-100';
      case 'in_progress': return 'text-purple-600 bg-purple-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: EmergencyRequest['status']) => {
    switch (status) {
      case 'pending': return 'في الانتظار';
      case 'accepted': return 'مقبول';
      case 'in_progress': return 'قيد التنفيذ';
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغي';
      default: return 'غير معروف';
    }
  };

  const getPriorityColor = (priority: EmergencyRequest['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    return `منذ ${hours} ساعة`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin w-8 h-8 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل طلبات الطوارئ...</p>
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
              <AlertTriangle className="text-red-600 ml-3" size={24} />
              <h1 className="text-xl font-bold text-gray-900">طلبات الطوارئ</h1>
              <span className="mr-3 bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-medium">
                {filteredRequests.filter(r => r.status === 'pending').length} جديد
              </span>
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
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="البحث في الطلبات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  dir="rtl"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {[
                { key: 'all', label: 'الكل' },
                { key: 'pending', label: 'في الانتظار' },
                { key: 'accepted', label: 'مقبول' },
                { key: 'in_progress', label: 'قيد التنفيذ' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات طوارئ</h3>
              <p className="text-gray-600">لا توجد طلبات طوارئ تطابق المعايير المحددة</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ml-3 ${getPriorityColor(request.priority)}`}></div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{request.emergencyType}</h3>
                        <p className="text-sm text-gray-600">طلب رقم: {request.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                        {getStatusText(request.status)}
                      </span>
                      <span className="text-sm text-gray-500">{formatTimeAgo(request.requestTime)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center">
                      <User className="text-gray-400 ml-2" size={16} />
                      <div>
                        <p className="text-sm text-gray-600">العميل</p>
                        <p className="font-medium">{request.customerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="text-gray-400 ml-2" size={16} />
                      <div>
                        <p className="text-sm text-gray-600">الهاتف</p>
                        <p className="font-medium">{request.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Car className="text-gray-400 ml-2" size={16} />
                      <div>
                        <p className="text-sm text-gray-600">السيارة</p>
                        <p className="font-medium">{request.vehicleDetails}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="text-gray-400 ml-2" size={16} />
                      <div>
                        <p className="text-sm text-gray-600">المسافة</p>
                        <p className="font-medium">{request.distance} كم</p>
                      </div>
                    </div>
                  </div>

                  {request.description && (
                    <div className="mb-4">
                      <div className="flex items-start">
                        <MessageSquare className="text-gray-400 ml-2 mt-1" size={16} />
                        <div>
                          <p className="text-sm text-gray-600">الوصف</p>
                          <p className="text-gray-800">{request.description}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.open(`https://maps.google.com/?q=${request.location.latitude},${request.location.longitude}`, '_blank')}
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Navigation className="ml-1" size={16} />
                        <span className="text-sm">عرض الموقع</span>
                        <ExternalLink className="mr-1" size={12} />
                      </button>
                      <button
                        onClick={() => window.open(`tel:${request.phone}`)}
                        className="flex items-center text-green-600 hover:text-green-800 transition-colors"
                      >
                        <Phone className="ml-1" size={16} />
                        <span className="text-sm">اتصال</span>
                      </button>
                    </div>

                    <div className="flex gap-2">
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleRequestResponse(request, 'reject')}
                            className="flex items-center bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-colors"
                          >
                            <XCircle className="ml-1" size={16} />
                            رفض
                          </button>
                          <button
                            onClick={() => handleRequestResponse(request, 'accept')}
                            className="flex items-center bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg transition-colors"
                          >
                            <CheckCircle className="ml-1" size={16} />
                            قبول
                          </button>
                        </>
                      )}
                      {request.status === 'accepted' && (
                        <button
                          onClick={() => updateRequestStatus(request.id, 'in_progress')}
                          className="flex items-center bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors"
                        >
                          <Clock className="ml-1" size={16} />
                          بدء العمل
                        </button>
                      )}
                      {request.status === 'in_progress' && (
                        <button
                          onClick={() => updateRequestStatus(request.id, 'completed')}
                          className="flex items-center bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg transition-colors"
                        >
                          <CheckCircle className="ml-1" size={16} />
                          إتمام
                        </button>
                      )}
                      {request.estimatedArrival && (
                        <div className="flex items-center text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                          <Clock className="ml-1" size={16} />
                          <span className="text-sm">الوصول خلال {request.estimatedArrival} دقيقة</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Response Modal */}
      {showResponseModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                responseType === 'accept' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {responseType === 'accept' ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-600" />
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">
                {responseType === 'accept' ? 'قبول طلب الطوارئ' : 'رفض طلب الطوارئ'}
              </h3>
              <p className="text-gray-600">
                طلب رقم: {selectedRequest.id} - {selectedRequest.customerName}
              </p>
            </div>

            {responseType === 'accept' && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  الوقت المتوقع للوصول (بالدقائق) *
                </label>
                <input
                  type="number"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="مثال: 15"
                  min="1"
                  max="120"
                  dir="rtl"
                />
              </div>
            )}

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                رسالة إضافية (اختياري)
              </label>
              <textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                placeholder={responseType === 'accept' ? 'سأكون معك قريباً...' : 'عذراً، لا يمكنني تلبية الطلب حالياً...'}
                dir="rtl"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowResponseModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={submitResponse}
                disabled={responseType === 'accept' && !estimatedTime}
                className={`flex-1 font-bold py-3 px-4 rounded-lg transition-colors ${
                  responseType === 'accept'
                    ? 'bg-green-600 hover:bg-green-700 text-white disabled:bg-green-400'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {responseType === 'accept' ? 'قبول الطلب' : 'رفض الطلب'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkshopEmergencyPage;