import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Upload, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle,
  FileText,
  Camera,
  User,
  CreditCard,
  Shield,
  Star
} from 'lucide-react';

interface RegistrationData {
  // Basic Information
  workshopName: string;
  ownerName: string;
  email: string;
  phone: string;
  alternatePhone: string;
  
  // Location
  address: string;
  city: string;
  state: string;
  postalCode: string;
  coordinates: { lat: number; lng: number } | null;
  
  // Business Details
  businessType: string;
  establishedYear: string;
  employeeCount: string;
  workingHours: {
    open: string;
    close: string;
    workingDays: string[];
  };
  
  // Services
  services: string[];
  specialties: string[];
  
  // Documents
  documents: {
    businessLicense: File | null;
    taxCertificate: File | null;
    insuranceCertificate: File | null;
    ownerID: File | null;
  };
  
  // Images
  images: File[];
  
  // Banking
  bankDetails: {
    bankName: string;
    accountNumber: string;
    iban: string;
    accountHolderName: string;
  };
}

interface WorkshopRegistrationProps {
  onClose: () => void;
  onComplete: () => void;
}

const WorkshopRegistration: React.FC<WorkshopRegistrationProps> = ({ onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationData>({
    workshopName: '',
    ownerName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    coordinates: null,
    businessType: '',
    establishedYear: '',
    employeeCount: '',
    workingHours: {
      open: '08:00',
      close: '18:00',
      workingDays: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday']
    },
    services: [],
    specialties: [],
    documents: {
      businessLicense: null,
      taxCertificate: null,
      insuranceCertificate: null,
      ownerID: null
    },
    images: [],
    bankDetails: {
      bankName: '',
      accountNumber: '',
      iban: '',
      accountHolderName: ''
    }
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 6;

  const cities = [
    'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 
    'الخبر', 'تبوك', 'أبها', 'القطيف', 'الطائف'
  ];

  const states = [
    'منطقة الرياض', 'منطقة مكة المكرمة', 'المنطقة الشرقية', 
    'منطقة المدينة المنورة', 'منطقة القصيم', 'منطقة حائل'
  ];

  const businessTypes = [
    'ورشة صيانة عامة',
    'مركز خدمة سيارات',
    'ورشة متخصصة',
    'مركز إطارات',
    'ورشة كهرباء سيارات',
    'مركز تكييف سيارات'
  ];

  const availableServices = [
    'صيانة عامة', 'تغيير زيت', 'فحص دوري', 'إصلاح المحرك',
    'إصلاح الفرامل', 'تكييف السيارة', 'كهرباء السيارة', 'إطارات',
    'صيانة ناقل الحركة', 'فحص كمبيوتر', 'صيانة نظام العادم'
  ];

  const carBrands = [
    'تويوتا', 'هوندا', 'نيسان', 'هيونداي', 'كيا', 'شيفروليه',
    'فورد', 'BMW', 'مرسيدس', 'أودي', 'لكزس', 'إنفينيتي'
  ];

  const workingDays = [
    { key: 'sunday', label: 'الأحد' },
    { key: 'monday', label: 'الاثنين' },
    { key: 'tuesday', label: 'الثلاثاء' },
    { key: 'wednesday', label: 'الأربعاء' },
    { key: 'thursday', label: 'الخميس' },
    { key: 'friday', label: 'الجمعة' },
    { key: 'saturday', label: 'السبت' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => {
      const parentValue = prev[parent as keyof RegistrationData];
      if (typeof parentValue === 'object' && parentValue !== null) {
        return {
          ...prev,
          [parent]: { ...parentValue, [field]: value }
        };
      }
      return prev;
    });
  };

  const handleFileUpload = (field: string, file: File) => {
    setFormData(prev => ({
      ...prev,
      documents: { ...prev.documents, [field]: file }
    }));
  };

  const handleImageUpload = (files: FileList) => {
    const imageFiles = Array.from(files).slice(0, 5); // Max 5 images
    setFormData(prev => ({ ...prev, images: [...prev.images, ...imageFiles] }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    switch (step) {
      case 1:
        if (!formData.workshopName.trim()) newErrors.workshopName = 'اسم الورشة مطلوب';
        if (!formData.ownerName.trim()) newErrors.ownerName = 'اسم المالك مطلوب';
        if (!formData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
        if (!formData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
        break;
      case 2:
        if (!formData.address.trim()) newErrors.address = 'العنوان مطلوب';
        if (!formData.city) newErrors.city = 'المدينة مطلوبة';
        if (!formData.state) newErrors.state = 'المنطقة مطلوبة';
        break;
      case 3:
        if (!formData.businessType) newErrors.businessType = 'نوع النشاط مطلوب';
        if (!formData.establishedYear) newErrors.establishedYear = 'سنة التأسيس مطلوبة';
        if (formData.services.length === 0) newErrors.services = 'يجب اختيار خدمة واحدة على الأقل';
        break;
      case 4:
        if (!formData.documents.businessLicense) newErrors.businessLicense = 'السجل التجاري مطلوب';
        if (!formData.documents.taxCertificate) newErrors.taxCertificate = 'الشهادة الضريبية مطلوبة';
        break;
      case 5:
        if (!formData.bankDetails.bankName) newErrors.bankName = 'اسم البنك مطلوب';
        if (!formData.bankDetails.accountNumber) newErrors.accountNumber = 'رقم الحساب مطلوب';
        if (!formData.bankDetails.iban) newErrors.iban = 'رقم الآيبان مطلوب';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      onComplete();
    } catch (error) {
      setErrors({ general: 'حدث خطأ في التسجيل. يرجى المحاولة مرة أخرى.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Building2 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">معلومات أساسية</h2>
        <p className="text-gray-600">ابدأ بإدخال المعلومات الأساسية لورشتك</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">اسم الورشة *</label>
          <input
            type="text"
            value={formData.workshopName}
            onChange={(e) => handleInputChange('workshopName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.workshopName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="مثال: ورشة الخليج للسيارات"
            dir="rtl"
          />
          {errors.workshopName && <p className="text-red-500 text-sm mt-1">{errors.workshopName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">اسم المالك *</label>
          <input
            type="text"
            value={formData.ownerName}
            onChange={(e) => handleInputChange('ownerName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.ownerName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="الاسم الكامل"
            dir="rtl"
          />
          {errors.ownerName && <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="example@email.com"
            dir="ltr"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="05xxxxxxxx"
            dir="rtl"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">رقم هاتف إضافي</label>
          <input
            type="tel"
            value={formData.alternatePhone}
            onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="رقم هاتف احتياطي"
            dir="rtl"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <MapPin className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">موقع الورشة</h2>
        <p className="text-gray-600">حدد موقع ورشتك بدقة لتسهيل وصول العملاء</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">العنوان التفصيلي *</label>
          <textarea
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="العنوان الكامل مع اسم الحي والشارع"
            dir="rtl"
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">المدينة *</label>
            <select
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
              dir="rtl"
            >
              <option value="">اختر المدينة</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">المنطقة *</label>
            <select
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
              dir="rtl"
            >
              <option value="">اختر المنطقة</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الرمز البريدي</label>
            <input
              type="text"
              value={formData.postalCode}
              onChange={(e) => handleInputChange('postalCode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="12345"
              dir="ltr"
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <MapPin className="text-blue-600 ml-3 mt-1" size={20} />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">تحديد الموقع على الخريطة</h4>
              <p className="text-blue-700 text-sm mb-3">
                سيتم تحديد موقعك تلقائياً بناءً على العنوان، أو يمكنك تحديده يدوياً
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                تحديد الموقع على الخريطة
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Building2 className="w-16 h-16 text-purple-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">تفاصيل النشاط</h2>
        <p className="text-gray-600">أخبرنا عن نوع خدماتك وتخصصاتك</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">نوع النشاط *</label>
            <select
              value={formData.businessType}
              onChange={(e) => handleInputChange('businessType', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.businessType ? 'border-red-500' : 'border-gray-300'}`}
              dir="rtl"
            >
              <option value="">اختر نوع النشاط</option>
              {businessTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.businessType && <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">سنة التأسيس *</label>
            <input
              type="number"
              value={formData.establishedYear}
              onChange={(e) => handleInputChange('establishedYear', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.establishedYear ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="2020"
              min="1950"
              max={new Date().getFullYear()}
            />
            {errors.establishedYear && <p className="text-red-500 text-sm mt-1">{errors.establishedYear}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">عدد الموظفين</label>
            <select
              value={formData.employeeCount}
              onChange={(e) => handleInputChange('employeeCount', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              dir="rtl"
            >
              <option value="">اختر العدد</option>
              <option value="1-5">1-5 موظفين</option>
              <option value="6-10">6-10 موظفين</option>
              <option value="11-20">11-20 موظف</option>
              <option value="20+">أكثر من 20 موظف</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">ساعات العمل</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs text-gray-600 mb-2">من الساعة</label>
              <input
                type="time"
                value={formData.workingHours.open}
                onChange={(e) => handleNestedInputChange('workingHours', 'open', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-2">إلى الساعة</label>
              <input
                type="time"
                value={formData.workingHours.close}
                onChange={(e) => handleNestedInputChange('workingHours', 'close', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-xs text-gray-600 mb-2">أيام العمل</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {workingDays.map(day => (
                <label key={day.key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.workingHours.workingDays.includes(day.key)}
                    onChange={(e) => {
                      const days = e.target.checked 
                        ? [...formData.workingHours.workingDays, day.key]
                        : formData.workingHours.workingDays.filter(d => d !== day.key);
                      handleNestedInputChange('workingHours', 'workingDays', days);
                    }}
                    className="ml-2"
                  />
                  <span className="text-sm">{day.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">الخدمات المقدمة *</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableServices.map(service => (
              <label key={service} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.services.includes(service)}
                  onChange={(e) => {
                    const services = e.target.checked 
                      ? [...formData.services, service]
                      : formData.services.filter(s => s !== service);
                    handleInputChange('services', services);
                  }}
                  className="ml-2"
                />
                <span className="text-sm">{service}</span>
              </label>
            ))}
          </div>
          {errors.services && <p className="text-red-500 text-sm mt-1">{errors.services}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">التخصصات (ماركات السيارات)</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {carBrands.map(brand => (
              <label key={brand} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.specialties.includes(brand)}
                  onChange={(e) => {
                    const specialties = e.target.checked 
                      ? [...formData.specialties, brand]
                      : formData.specialties.filter(s => s !== brand);
                    handleInputChange('specialties', specialties);
                  }}
                  className="ml-2"
                />
                <span className="text-sm">{brand}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <FileText className="w-16 h-16 text-orange-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">المستندات المطلوبة</h2>
        <p className="text-gray-600">ارفع المستندات الرسمية المطلوبة للتحقق</p>
      </div>

      <div className="space-y-6">
        {[
          { key: 'businessLicense', label: 'السجل التجاري', required: true },
          { key: 'taxCertificate', label: 'الشهادة الضريبية', required: true },
          { key: 'insuranceCertificate', label: 'شهادة التأمين', required: false },
          { key: 'ownerID', label: 'هوية المالك', required: false }
        ].map(doc => (
          <div key={doc.key} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">
                {doc.label} {doc.required && <span className="text-red-500">*</span>}
              </h4>
              {formData.documents[doc.key as keyof typeof formData.documents] && (
                <Check className="text-green-600" size={20} />
              )}
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-2">اسحب الملف هنا أو انقر للاختيار</p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(doc.key, file);
                }}
                className="hidden"
                id={`file-${doc.key}`}
              />
              <label
                htmlFor={`file-${doc.key}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
              >
                اختيار ملف
              </label>
              <p className="text-xs text-gray-500 mt-2">PDF, JPG, PNG (حد أقصى 5MB)</p>
            </div>
            
            {formData.documents[doc.key as keyof typeof formData.documents] && (
              <p className="text-green-600 text-sm mt-2">
                تم رفع: {formData.documents[doc.key as keyof typeof formData.documents]?.name}
              </p>
            )}
            
            {errors[doc.key] && <p className="text-red-500 text-sm mt-1">{errors[doc.key]}</p>}
          </div>
        ))}

        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">صور الورشة (اختياري)</h4>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 mb-2">أضف صور للورشة (حد أقصى 5 صور)</p>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              multiple
              onChange={(e) => {
                if (e.target.files) handleImageUpload(e.target.files);
              }}
              className="hidden"
              id="workshop-images"
            />
            <label
              htmlFor="workshop-images"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
            >
              اختيار صور
            </label>
          </div>
          
          {formData.images.length > 0 && (
            <div className="mt-4">
              <p className="text-green-600 text-sm">تم رفع {formData.images.length} صورة</p>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`صورة ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <CreditCard className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">المعلومات البنكية</h2>
        <p className="text-gray-600">أدخل تفاصيل حسابك البنكي لاستلام المدفوعات</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">اسم البنك *</label>
            <select
              value={formData.bankDetails.bankName}
              onChange={(e) => handleNestedInputChange('bankDetails', 'bankName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.bankName ? 'border-red-500' : 'border-gray-300'}`}
              dir="rtl"
            >
              <option value="">اختر البنك</option>
              <option value="الراجحي">مصرف الراجحي</option>
              <option value="الأهلي">البنك الأهلي السعودي</option>
              <option value="سامبا">بنك سامبا</option>
              <option value="الرياض">بنك الرياض</option>
              <option value="البلاد">بنك البلاد</option>
            </select>
            {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">اسم صاحب الحساب *</label>
            <input
              type="text"
              value={formData.bankDetails.accountHolderName}
              onChange={(e) => handleNestedInputChange('bankDetails', 'accountHolderName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="الاسم كما هو مسجل في البنك"
              dir="rtl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">رقم الحساب *</label>
            <input
              type="text"
              value={formData.bankDetails.accountNumber}
              onChange={(e) => handleNestedInputChange('bankDetails', 'accountNumber', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.accountNumber ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="رقم الحساب البنكي"
              dir="ltr"
            />
            {errors.accountNumber && <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">رقم الآيبان *</label>
            <input
              type="text"
              value={formData.bankDetails.iban}
              onChange={(e) => handleNestedInputChange('bankDetails', 'iban', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.iban ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="SA00 0000 0000 0000 0000 0000"
              dir="ltr"
            />
            {errors.iban && <p className="text-red-500 text-sm mt-1">{errors.iban}</p>}
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="text-yellow-600 ml-3 mt-1" size={20} />
            <div>
              <h4 className="font-medium text-yellow-900 mb-1">ملاحظة مهمة</h4>
              <p className="text-yellow-800 text-sm">
                تأكد من صحة المعلومات البنكية. سيتم التحقق من هذه المعلومات قبل تفعيل حسابك.
                المدفوعات ستحول إلى هذا الحساب بعد خصم عمولة المنصة.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Check className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">مراجعة وإرسال</h2>
        <p className="text-gray-600">راجع جميع المعلومات قبل إرسال طلب التسجيل</p>
      </div>

      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">معلومات الورشة</h4>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-600">الاسم:</span> {formData.workshopName}</p>
              <p><span className="text-gray-600">المالك:</span> {formData.ownerName}</p>
              <p><span className="text-gray-600">النوع:</span> {formData.businessType}</p>
              <p><span className="text-gray-600">المدينة:</span> {formData.city}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">الخدمات</h4>
            <div className="flex flex-wrap gap-1">
              {formData.services.slice(0, 3).map(service => (
                <span key={service} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  {service}
                </span>
              ))}
              {formData.services.length > 3 && (
                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                  +{formData.services.length - 3} أخرى
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-medium text-blue-900 mb-3">الخطوات التالية</h4>
          <div className="space-y-2 text-blue-800 text-sm">
            <p>• سيتم مراجعة طلبك خلال 2-3 أيام عمل</p>
            <p>• ستتلقى إشعار بالبريد الإلكتروني عند الموافقة</p>
            <p>• يمكنك تتبع حالة الطلب من لوحة التحكم</p>
            <p>• بعد الموافقة، يمكنك البدء في استقبال الحجوزات</p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="text-yellow-600 ml-3 mt-1" size={20} />
            <div>
              <h4 className="font-medium text-yellow-900 mb-1">الشروط والأحكام</h4>
              <p className="text-yellow-800 text-sm mb-3">
                بالمتابعة، أنت توافق على شروط وأحكام المنصة وسياسة الخصوصية.
              </p>
              <label className="flex items-center">
                <input type="checkbox" className="ml-2" required />
                <span className="text-sm text-yellow-800">
                  أوافق على <a href="#" className="underline">الشروط والأحكام</a> و <a href="#" className="underline">سياسة الخصوصية</a>
                </span>
              </label>
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
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">تسجيل ورشة جديدة</h1>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">الخطوة {currentStep} من {totalSteps}</span>
            <span className="text-sm text-gray-600">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
          {currentStep === 6 && renderStep6()}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <ArrowLeft className="ml-2" size={16} />
              السابق
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                التالي
                <ArrowRight className="mr-2" size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full ml-2"></div>
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    إرسال الطلب
                    <Check className="mr-2" size={16} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopRegistration;