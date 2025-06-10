import React, { useState } from 'react';
import { UserCircle, Lock, Phone, MapPin, ArrowRight, ArrowLeft, Home, Car, Building2, Link, AlertTriangle, Search } from 'lucide-react';
import EmergencyPage from './components/EmergencyPage';
import WorkshopEmergencyPage from './components/WorkshopEmergencyPage';
import WorkshopListPage from './components/WorkshopListPage';
import WorkshopOwnerDashboard from './components/WorkshopOwnerDashboard';

// Define types for our form data
type FormData = {
  username: string;
  password: string;
  confirmPassword: string;
  phone: string;
  city: string;
  userType: 'customer' | 'workshop' | '';
  businessName?: string;
  address?: string;
  state?: string;
  mapLink?: string;
};

// Define the steps of our registration process
type Step = 'home' | 'welcome' | 'username' | 'password' | 'phone' | 'city' | 'business-details' | 'success' | 'emergency' | 'workshop-emergency' | 'workshop-list' | 'workshop-dashboard';

function App() {
  // State to track the current step and form data
  const [currentStep, setCurrentStep] = useState<Step>('home');
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: '',
    userType: '',
    businessName: '',
    address: '',
    state: '',
    mapLink: '',
  });

  // State for form validation errors
  const [errors, setErrors] = useState<Partial<FormData>>({});
  
  // Mock authentication state (replace with real auth later)
  const [isAuthenticated] = useState(false);
  const [userRole] = useState<'customer' | 'workshop' | null>('workshop'); // Mock workshop owner for demo

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // For username, only allow English letters, numbers, and underscores
    if (name === 'username') {
      const englishValue = value.replace(/[^a-zA-Z0-9_]/g, '');
      setFormData({ ...formData, [name]: englishValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error when user types
    if (errors[name as keyof FormData]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Handle emergency service request
  const handleEmergencyService = () => {
    if (userRole === 'workshop') {
      setCurrentStep('workshop-emergency');
    } else {
      setCurrentStep('emergency');
    }
  };

  // Handle explore services or register
  const handleExploreOrRegister = () => {
    if (isAuthenticated) {
      if (userRole === 'workshop') {
        setCurrentStep('workshop-dashboard');
      } else {
        setCurrentStep('workshop-list');
      }
    } else {
      setCurrentStep('welcome');
    }
  };

  // Handle user type selection
  const handleUserTypeSelect = (type: 'customer' | 'workshop') => {
    setFormData({ ...formData, userType: type });
    setCurrentStep('username');
  };

  // Validate the current step
  const validateStep = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    switch (currentStep) {
      case 'username':
        if (!formData.username.trim()) {
          newErrors.username = 'يرجى إدخال اسم المستخدم';
        } else if (formData.username.length < 3) {
          newErrors.username = 'يجب أن يكون اسم المستخدم 3 أحرف على الأقل';
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
          newErrors.username = 'يجب أن يحتوي اسم المستخدم على أحرف إنجليزية وأرقام وشرطة سفلية فقط';
        } else if (!/\d/.test(formData.username)) {
          newErrors.username = 'يجب أن يحتوي اسم المستخدم على رقم واحد على الأقل';
        }
        break;
      
      case 'password':
        if (!formData.password) {
          newErrors.password = 'يرجى إدخال كلمة المرور';
        } else if (formData.password.length < 6) {
          newErrors.password = 'يجب أن تكون كلمة المرور 6 أحرف على الأقل';
        }
        
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = 'يرجى تأكيد كلمة المرور';
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'كلمات المرور غير متطابقة';
        }
        break;
      
      case 'phone':
        if (!formData.phone) {
          newErrors.phone = 'يرجى إدخال رقم الهاتف';
        } else if (!/^\d{10,11}$/.test(formData.phone)) {
          newErrors.phone = 'يرجى إدخال رقم هاتف صحيح (10-11 رقم)';
        }
        break;
      
      case 'city':
        if (!formData.city) {
          newErrors.city = 'يرجى اختيار المدينة';
        }
        break;

      case 'business-details':
        if (!formData.businessName?.trim()) {
          newErrors.businessName = 'يرجى إدخال اسم الورشة';
        }
        if (!formData.address?.trim()) {
          newErrors.address = 'يرجى إدخال عنوان الورشة';
        }
        if (!formData.state?.trim()) {
          newErrors.state = 'يرجى إدخال المنطقة';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next button click
  const handleNext = () => {
    if (!validateStep()) return;
    
    switch (currentStep) {
      case 'username':
        setCurrentStep('password');
        break;
      case 'password':
        setCurrentStep('phone');
        break;
      case 'phone':
        if (formData.userType === 'workshop') {
          setCurrentStep('business-details');
        } else {
          setCurrentStep('city');
        }
        break;
      case 'business-details':
        setCurrentStep('city');
        break;
      case 'city':
        setCurrentStep('success');
        break;
    }
  };

  // Handle back button click
  const handleBack = () => {
    switch (currentStep) {
      case 'welcome':
        setCurrentStep('home');
        break;
      case 'username':
        setCurrentStep('welcome');
        break;
      case 'password':
        setCurrentStep('username');
        break;
      case 'phone':
        setCurrentStep('password');
        break;
      case 'business-details':
        setCurrentStep('phone');
        break;
      case 'city':
        if (formData.userType === 'workshop') {
          setCurrentStep('business-details');
        } else {
          setCurrentStep('phone');
        }
        break;
    }
  };

  // Handle going to home page after successful registration
  const goToHome = () => {
    setCurrentStep('home');
  };

  // Handle closing emergency page
  const handleCloseEmergency = () => {
    setCurrentStep('home');
  };

  // Handle closing workshop emergency page
  const handleCloseWorkshopEmergency = () => {
    setCurrentStep('home');
  };

  // Handle closing workshop list page
  const handleWorkshopList = () => {
    setCurrentStep('workshop-list');
  };

  // Handle closing workshop dashboard
  const handleeWorkshopDashboard = () => {
    setCurrentStep('workshop-dashboard');
  };

  // Handle closing workshop list page
  const handleCloseWorkshopList = () => {
    setCurrentStep('home');
  };

  // Handle closing workshop dashboard
  const handleCloseWorkshopDashboard = () => {
    setCurrentStep('home');
  };

  // List of cities in Saudi Arabia
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
    'الباحة',
  ];

  // List of states/regions in Saudi Arabia
  const states = [
    'المنطقة الشرقية',
    'منطقة الرياض',
    'منطقة مكة المكرمة',
    'منطقة المدينة المنورة',
    'منطقة القصيم',
    'منطقة حائل',
    'منطقة تبوك',
    'منطقة الحدود الشمالية',
    'منطقة جازان',
    'منطقة نجران',
    'منطقة الباحة',
    'منطقة الجوف',
    'منطقة عسير',
  ];

  // Show emergency page if current step is emergency
  if (currentStep === 'emergency') {
    return <EmergencyPage onClose={handleCloseEmergency} />;
  }

  // Show workshop emergency page if current step is workshop-emergency
  if (currentStep === 'workshop-emergency') {
    return <WorkshopEmergencyPage onClose={handleCloseWorkshopEmergency} />;
  }

  // Show workshop list page if current step is workshop-list
  if (currentStep === 'workshop-list') {
    return <WorkshopListPage onClose={handleCloseWorkshopList} />;
  }

  // Show workshop dashboard if current step is workshop-dashboard
  if (currentStep === 'workshop-dashboard') {
    return <WorkshopOwnerDashboard onClose={handleCloseWorkshopDashboard} />;
  }

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 'home':
        return (
          <div className="text-center">
            <div className="mb-12">
              <h1 className="text-4xl font-bold mb-6 text-primary-900">خدمات السيارات</h1>
              <p className="text-xl text-gray-600 mb-8">منصتك الشاملة لخدمات السيارات في المملكة العربية السعودية</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <Car className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                  <h2 className="text-xl font-bold mb-2">خدمات الصيانة</h2>
                  <p className="text-gray-600 mb-4">احصل على أفضل خدمات الصيانة لسيارتك من ورش معتمدة</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <AlertTriangle className="w-12 h-12 text-secondary-600 mx-auto mb-4" />
                  <h2 className="text-xl font-bold mb-2">خدمة الطوارئ</h2>
                  <p className="text-gray-600 mb-4">مساعدة فورية على مدار الساعة في حالات الطوارئ</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-4 w-full max-w-xs mx-auto">
              <button
                onClick={handleEmergencyService}
                className="btn-secondary flex items-center justify-center"
              >
                <AlertTriangle className="ml-2" size={24} />
                <span>
                  {userRole === 'workshop' ? 'إدارة طلبات الطوارئ' : 'طلب خدمة طوارئ'}
                </span>
              </button>
              
              <button
                onClick={handleeWorkshopDashboard}
                className="btn-secondary flex items-center justify-center"
              >
                <AlertTriangle className="ml-2" size={24} />
                <span>
                  workshop 
                </span>
              </button>
              
              <button
                onClick={handleWorkshopList}
                className="btn-secondary flex items-center justify-center"
              >
                <AlertTriangle className="ml-2" size={24} />
                <span>
                  workshop list 
                </span>
              </button>

              <button
                onClick={handleExploreOrRegister}
                className="btn-primary flex items-center justify-center"
              >
                {isAuthenticated ? (
                  <>
                    {userRole === 'workshop' ? (
                      <>
                        <Building2 className="ml-2" size={24} />
                        <span>لوحة تحكم الورشة</span>
                      </>
                    ) : (
                      <>
                        <Search className="ml-2" size={24} />
                        <span>استعرض الخدمات</span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <UserCircle className="ml-2" size={24} />
                    <span>سجل الآن</span>
                  </>
                )}
              </button>
            </div>
          </div>
        );

      case 'welcome':
        return (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-8 text-primary-900">مرحباً بك في خدمات السيارات!</h1>
            <p className="text-xl mb-10">هل تريد التسجيل كـ:</p>
            
            <div className="flex flex-col space-y-4 w-full max-w-xs mx-auto">
              <button
                onClick={() => handleUserTypeSelect('customer')}
                className="btn-primary flex items-center justify-center"
              >
                <UserCircle className="ml-2" size={24} />
                <span>عميل جديد</span>
              </button>
              
              <button
                onClick={() => handleUserTypeSelect('workshop')}
                className="btn-secondary flex items-center justify-center"
              >
                <Car className="ml-2" size={24} />
                <span>صاحب ورشة</span>
              </button>
            </div>
          </div>
        );
      
      case 'username':
        return (
          <div>
            <h1 className="text-2xl font-bold mb-2 text-primary-900">الخطوة 1: اسم المستخدم</h1>
            <p className="mb-2 text-gray-600">يرجى كتابة اسم تختاره لحسابك.</p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-yellow-700">
                <strong>تنبيه هام:</strong> يجب كتابة اسم المستخدم بالحروف الإنجليزية ويجب أن يحتوي على رقم واحد على الأقل. احفظ اسم المستخدم جيداً لأنك ستحتاجه لتسجيل الدخول لاحقاً.
              </p>
            </div>
            
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                اسم المستخدم (بالإنجليزية فقط)
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`form-input ${errors.username ? 'border-red-500' : ''}`}
                  placeholder="Enter username here"
                  dir="ltr"
                />
                <UserCircle className="form-icon" size={20} />
              </div>
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>
            
            <div className="flex justify-between mt-8">
              <button onClick={handleBack} className="btn-outline flex items-center">
                <ArrowLeft size={16} className="ml-1" />
                رجوع
              </button>
              <button onClick={handleNext} className="btn-primary flex items-center">
                التالي
                <ArrowRight size={16} className="mr-1" />
              </button>
            </div>
          </div>
        );
      
      case 'password':
        return (
          <div>
            <h1 className="text-2xl font-bold mb-2 text-primary-900">الخطوة 2: كلمة المرور</h1>
            <p className="mb-6 text-gray-600">يرجى كتابة كلمة سر قوية لحسابك.</p>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="ادخل كلمة السر هنا"
                  dir="rtl"
                />
                <Lock className="form-icon" size={20} />
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            
            <div className="form-group mt-4">
              <label htmlFor="confirmPassword" className="form-label">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-input ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder="أعد كتابة كلمة السر للتأكيد"
                  dir="rtl"
                />
                <Lock className="form-icon" size={20} />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
            
            <div className="flex justify-between mt-8">
              <button onClick={handleBack} className="btn-outline flex items-center">
                <ArrowLeft size={16} className="ml-1" />
                رجوع
              </button>
              <button onClick={handleNext} className="btn-primary flex items-center">
                التالي
                <ArrowRight size={16} className="mr-1" />
              </button>
            </div>
          </div>
        );
      
      case 'phone':
        return (
          <div>
            <h1 className="text-2xl font-bold mb-2 text-primary-900">الخطوة 3: رقم الهاتف</h1>
            <p className="mb-6 text-gray-600">يرجى كتابة رقم هاتفك للتواصل معك.</p>
            
            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                رقم الهاتف
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`form-input ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder="ادخل رقم الهاتف هنا"
                  dir="rtl"
                />
                <Phone className="form-icon" size={20} />
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
            
            <div className="flex justify-between mt-8">
              <button onClick={handleBack} className="btn-outline flex items-center">
                <ArrowLeft size={16} className="ml-1" />
                رجوع
              </button>
              <button onClick={handleNext} className="btn-primary flex items-center">
                التالي
                <ArrowRight size={16} className="mr-1" />
              </button>
            </div>
          </div>
        );

      case 'business-details':
        return (
          <div>
            <h1 className="text-2xl font-bold mb-2 text-primary-900">معلومات الورشة</h1>
            <p className="mb-6 text-gray-600">يرجى إدخال معلومات ورشتك.</p>
            
            <div className="form-group">
              <label htmlFor="businessName" className="form-label">
                اسم الورشة
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className={`form-input ${errors.businessName ? 'border-red-500' : ''}`}
                  placeholder="ادخل اسم الورشة"
                  dir="rtl"
                />
                <Building2 className="form-icon" size={20} />
              </div>
              {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="address" className="form-label">
                عنوان الورشة
              </label>
              <div className="relative">
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`form-input min-h-[100px] ${errors.address ? 'border-red-500' : ''}`}
                  placeholder="ادخل العنوان التفصيلي للورشة"
                  dir="rtl"
                />
              </div>
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="state" className="form-label">
                المنطقة
              </label>
              <div className="relative">
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`form-input ${errors.state ? 'border-red-500' : ''}`}
                  dir="rtl"
                >
                  <option value="" disabled>اختر المنطقة</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                <MapPin className="form-icon" size={20} />
              </div>
              {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="mapLink" className="form-label">
                رابط الموقع على الخريطة (اختياري)
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="mapLink"
                  name="mapLink"
                  value={formData.mapLink}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://maps.google.com/..."
                  dir="ltr"
                />
                <Link className="form-icon" size={20} />
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <button onClick={handleBack} className="btn-outline flex items-center">
                <ArrowLeft size={16} className="ml-1" />
                رجوع
              </button>
              <button onClick={handleNext} className="btn-primary flex items-center">
                التالي
                <ArrowRight size={16} className="mr-1" />
              </button>
            </div>
          </div>
        );
      
      case 'city':
        return (
          <div>
            <h1 className="text-2xl font-bold mb-2 text-primary-900">
              {formData.userType === 'workshop' ? 'المدينة' : 'الخطوة 4 من 4: مدينتك'}
            </h1>
            <p className="mb-6 text-gray-600">
              {formData.userType === 'workshop' 
                ? 'يرجى اختيار المدينة التي تقع فيها ورشتك.'
                : 'يرجى اختيار المدينة التي تسكن بها.'}
            </p>
            
            <div className="form-group">
              <label htmlFor="city" className="form-label">
                المدينة
              </label>
              <div className="relative">
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`form-input ${errors.city ? 'border-red-500' : ''}`}
                  dir="rtl"
                >
                  <option value="" disabled>اختر المدينة</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <MapPin className="form-icon" size={20} />
              </div>
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>
            
            <div className="flex justify-between mt-8">
              <button onClick={handleBack} className="btn-outline flex items-center">
                <ArrowLeft size={16} className="ml-1" />
                رجوع
              </button>
              <button onClick={handleNext} className="btn-primary flex items-center">
                إتمام التسجيل
                <ArrowRight size={16} className="mr-1" />
              </button>
            </div>
          </div>
        );
      
      case 'success':
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold mb-4 text-primary-900">تم التسجيل بنجاح!</h1>
            <p className="text-xl mb-8 text-gray-600">
              {formData.userType === 'workshop'
                ? 'مرحباً بك في مجتمع مقدمي خدمات السيارات!'
                : 'أهلاً بك في عالم خدمات السيارات!'}
            </p>
            
            <button
              onClick={goToHome}
              className="btn-primary flex items-center justify-center mx-auto"
            >
              <Home className="ml-2" size={20} />
              <span>الذهاب إلى الصفحة الرئيسية</span>
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-8 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto">
        {/* Progress bar (only show for steps between username and city) */}
        {['username', 'password', 'phone', 'business-details', 'city'].includes(currentStep) && (
          <div className="mb-8">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 transition-all duration-300"
                style={{
                  width: currentStep === 'username' ? '20%' :
                         currentStep === 'password' ? '40%' :
                         currentStep === 'phone' ? '60%' :
                         currentStep === 'business-details' ? '80%' : '100%'
                }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Render the current step */}
        {renderStep()}
      </div>
    </div>
  );
}

export default App;