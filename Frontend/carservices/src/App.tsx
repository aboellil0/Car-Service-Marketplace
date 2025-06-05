import React, { useState } from 'react';
import Home from './components/Home';
import Welcome from './components/Welcome';
import UsernameStep from './components/steps/UsernameStep';
import PasswordStep from './components/steps/PasswordStep';
import PhoneStep from './components/steps/PhoneStep';
import BusinessDetailsStep from './components/steps/BusinessDetailsStep';
import CityStep from './components/steps/CityStep';
import SuccessStep from './components/steps/SuccessStep';
import { FormData, Step, cities, states } from './components/types';


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
    alert('سيتم تطوير خدمة الطوارئ قريباً');
  };

  // Handle explore services or register
  const handleExploreOrRegister = () => {
    if (isAuthenticated) {
      alert('سيتم تحويلك إلى صفحة الخدمات');
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

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 'home':
        return (
          <Home
            isAuthenticated={isAuthenticated}
            onEmergencyService={handleEmergencyService}
            onExploreOrRegister={handleExploreOrRegister}
          />
        );

      case 'welcome':
        return <Welcome onUserTypeSelect={handleUserTypeSelect} />;
      
      case 'username':
        return (
          <UsernameStep
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      
      case 'password':
        return (
          <PasswordStep
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      
      case 'phone':
        return (
          <PhoneStep
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      
      case 'business-details':
        return (
          <BusinessDetailsStep
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onNext={handleNext}
            onBack={handleBack}
            states={states}
          />
        );
      
      case 'city':
        return (
          <CityStep
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onNext={handleNext}
            onBack={handleBack}
            cities={cities}
          />
        );
      
      case 'success':
        return (
          <SuccessStep
            userType={formData.userType}
            onGoToHome={goToHome}
          />
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