import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Phone, 
  Car, 
  MapPin, 
  X, 
  ArrowRight, 
  Loader2,
  Navigation,
  RefreshCw
} from 'lucide-react';

interface EmergencyFormData {
  emergencyType: string;
  description: string;
  phone: string;
  vehicleDetails: string;
  city: string;
  location: {
    latitude: number | null;
    longitude: number | null;
  };
}

interface EmergencyPageProps {
  onClose: () => void;
}

const EmergencyPage: React.FC<EmergencyPageProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<EmergencyFormData>({
    emergencyType: '',
    description: '',
    phone: '',
    vehicleDetails: '',
    city: '',
    location: {
      latitude: null,
      longitude: null
    }
  });

  const [errors, setErrors] = useState<Partial<EmergencyFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Auto-refresh location every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (formData.location.latitude && formData.location.longitude) {
        getCurrentLocation(false);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [formData.location]);

  const emergencyTypes = [
    'حادث مروري',
    'عطل في السيارة',
    'إطار مثقوب',
    'نفاد الوقود',
    'بطارية فارغة',
    'مشكلة في المحرك',
    'أخرى'
  ];

  const cities = [
    'الرياض',
    'جدة',
    'مكة المكرمة',
    'المدينة المنورة',
    'الدمام',
    'الخبر',
    'تبوك',
    'أبها',
    'القطيف',
    'الطائف',
    'حائل',
    'نجران',
    'الجبيل',
    'الخرج',
    'ينبع',
    'بريدة',
    'عرعر',
    'سكاكا',
    'جازان',
    'الباحة'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (errors[name as keyof EmergencyFormData]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const getCurrentLocation = async (showLoading = true) => {
    if (showLoading) setIsGettingLocation(true);
    setLocationError('');

    try {
      if (!navigator.geolocation) {
        throw new Error('الموقع الجغرافي غير مدعوم في هذا المتصفح');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      setFormData(prev => ({
        ...prev,
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
      }));
    } catch (error) {
      setLocationError('تعذر الحصول على الموقع. يرجى المحاولة مرة أخرى.');
      console.error('Location error:', error);
    } finally {
      if (showLoading) setIsGettingLocation(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<EmergencyFormData> = {};

    if (!formData.emergencyType) {
      newErrors.emergencyType = 'يرجى اختيار نوع الطوارئ';
    }

    if (!formData.phone) {
      newErrors.phone = 'يرجى إدخال رقم الهاتف';
    } else if (!/^\d{10,11}$/.test(formData.phone)) {
      newErrors.phone = 'يرجى إدخال رقم هاتف صحيح (10-11 رقم)';
    }

    if (!formData.vehicleDetails.trim()) {
      newErrors.vehicleDetails = 'يرجى إدخال تفاصيل السيارة';
    }

    if (!formData.city) {
      newErrors.city = 'يرجى اختيار المدينة';
    }

    if (!formData.location.latitude || !formData.location.longitude) {
      setLocationError('يرجى تحديد الموقع الحالي');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && !locationError;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmation(true);
    }
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    setShowConfirmation(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-gray-900">تم إرسال طلب المساعدة!</h1>
          <p className="text-gray-600 mb-6">
            سيتم التواصل معك خلال دقائق قليلة. يرجى البقاء في مكان آمن.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-medium">رقم الطلب: #EM{Date.now().toString().slice(-6)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-50">
      {/* Emergency Header */}
      <div className="bg-red-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center">
            <AlertTriangle className="ml-3" size={24} />
            <h1 className="text-xl font-bold">طلب مساعدة طارئة</h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-700 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-red-100 border-b border-red-200 p-4">
        <div className="max-w-md mx-auto">
          <p className="text-red-800 text-sm font-medium mb-2">أرقام الطوارئ:</p>
          <div className="flex justify-between text-red-700 text-sm">
            <span>الشرطة: 999</span>
            <span>الإسعاف: 997</span>
            <span>الدفاع المدني: 998</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-auto">
          {/* Status Messages */}
          {submitStatus === 'error' && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Emergency Type */}
            <div className="form-group">
              <label htmlFor="emergencyType" className="form-label text-red-700">
                نوع الطوارئ *
              </label>
              <div className="relative">
                <select
                  id="emergencyType"
                  name="emergencyType"
                  value={formData.emergencyType}
                  onChange={handleChange}
                  className={`form-input ${errors.emergencyType ? 'border-red-500' : 'border-red-300'}`}
                  dir="rtl"
                >
                  <option value="" disabled>اختر نوع الطوارئ</option>
                  {emergencyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <AlertTriangle className="form-icon text-red-500" size={20} />
              </div>
              {errors.emergencyType && <p className="text-red-500 text-sm mt-1">{errors.emergencyType}</p>}
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label htmlFor="phone" className="form-label text-red-700">
                رقم الهاتف *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`form-input ${errors.phone ? 'border-red-500' : 'border-red-300'}`}
                  placeholder="ادخل رقم الهاتف"
                  dir="rtl"
                />
                <Phone className="form-icon text-red-500" size={20} />
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Vehicle Details */}
            <div className="form-group">
              <label htmlFor="vehicleDetails" className="form-label text-red-700">
                تفاصيل السيارة *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="vehicleDetails"
                  name="vehicleDetails"
                  value={formData.vehicleDetails}
                  onChange={handleChange}
                  className={`form-input ${errors.vehicleDetails ? 'border-red-500' : 'border-red-300'}`}
                  placeholder="مثال: تويوتا كامري 2020"
                  dir="rtl"
                />
                <Car className="form-icon text-red-500" size={20} />
              </div>
              {errors.vehicleDetails && <p className="text-red-500 text-sm mt-1">{errors.vehicleDetails}</p>}
            </div>

            {/* City */}
            <div className="form-group">
              <label htmlFor="city" className="form-label text-red-700">
                المدينة *
              </label>
              <div className="relative">
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`form-input ${errors.city ? 'border-red-500' : 'border-red-300'}`}
                  dir="rtl"
                >
                  <option value="" disabled>اختر المدينة</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <MapPin className="form-icon text-red-500" size={20} />
              </div>
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>

            {/* Current Location */}
            <div className="form-group">
              <label className="form-label text-red-700">
                الموقع الحالي *
              </label>
              <button
                type="button"
                onClick={() => getCurrentLocation()}
                disabled={isGettingLocation}
                className="w-full flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-700 font-medium py-3 px-4 rounded-lg transition duration-200 border border-red-300"
              >
                {isGettingLocation ? (
                  <Loader2 className="animate-spin ml-2" size={20} />
                ) : (
                  <Navigation className="ml-2" size={20} />
                )}
                {isGettingLocation ? 'جاري تحديد الموقع...' : 'تحديد الموقع الحالي'}
              </button>
              
              {formData.location.latitude && formData.location.longitude && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-green-700 text-sm">
                      تم تحديد الموقع بنجاح
                    </p>
                    <RefreshCw 
                      className="text-green-600 cursor-pointer hover:text-green-800" 
                      size={16}
                      onClick={() => getCurrentLocation()}
                    />
                  </div>
                  <p className="text-green-600 text-xs mt-1">
                    {formData.location.latitude.toFixed(6)}, {formData.location.longitude.toFixed(6)}
                  </p>
                </div>
              )}
              
              {locationError && <p className="text-red-500 text-sm mt-1">{locationError}</p>}
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description" className="form-label text-red-700">
                وصف إضافي (اختياري)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-input min-h-[80px] border-red-300"
                placeholder="اكتب أي تفاصيل إضافية تساعد في تقديم المساعدة"
                dir="rtl"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-4 px-6 rounded-lg transition duration-200 text-lg flex items-center justify-center"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin ml-2" size={20} />
                ) : (
                  <AlertTriangle className="ml-2" size={20} />
                )}
                {isSubmitting ? 'جاري الإرسال...' : 'طلب المساعدة الآن'}
              </button>
              
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition duration-200"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-4">تأكيد طلب المساعدة</h3>
              <p className="text-gray-600 mb-6">
                هل أنت متأكد من إرسال طلب المساعدة الطارئة؟
              </p>
              <div className="flex space-x-3 space-x-reverse">
                <button
                  onClick={confirmSubmit}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
                >
                  نعم، أرسل الطلب
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition duration-200"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyPage;