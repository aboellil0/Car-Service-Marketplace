import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft,
  UserCircle,
  AlertCircle,
  Loader2,
  Shield
} from 'lucide-react';

interface LoginPageProps {
  onClose: () => void;
  onForgotPassword: () => void;
  onRegister: () => void;
  onLoginSuccess: (userType: 'customer' | 'workshop') => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ 
  onClose, 
  onForgotPassword, 
  onRegister, 
  onLoginSuccess 
}) => {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.emailOrUsername.trim()) {
      newErrors.emailOrUsername = 'يرجى إدخال البريد الإلكتروني أو اسم المستخدم';
    }

    if (!formData.password) {
      newErrors.password = 'يرجى إدخال كلمة المرور';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock authentication logic
      const isValidCredentials = formData.emailOrUsername === 'admin' && formData.password === 'password';
      
      if (isValidCredentials) {
        // Reset login attempts on successful login
        setLoginAttempts(0);
        // Mock user type determination
        const userType = formData.emailOrUsername.includes('workshop') ? 'workshop' : 'customer';
        onLoginSuccess(userType);
      } else {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
        if (newAttempts >= 5) {
          setIsLocked(true);
          setLockoutTime(300); // 5 minutes lockout
          setErrors({ general: 'تم قفل الحساب لمدة 5 دقائق بسبب المحاولات المتكررة' });
          
          // Start countdown
          const countdown = setInterval(() => {
            setLockoutTime(prev => {
              if (prev <= 1) {
                clearInterval(countdown);
                setIsLocked(false);
                setLoginAttempts(0);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          setErrors({ 
            general: `بيانات الدخول غير صحيحة. المحاولات المتبقية: ${5 - newAttempts}` 
          });
        }
      }
    } catch (error) {
      setErrors({ general: 'حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.' });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-blue-800"></div>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">تسجيل الدخول</h1>
          <p className="text-gray-600">مرحباً بك مرة أخرى في منصة خدمات السيارات</p>
        </div>

        {/* Error Messages */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 ml-2 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-700 text-sm">{errors.general}</p>
              {isLocked && (
                <p className="text-red-600 text-xs mt-1">
                  الوقت المتبقي: {formatTime(lockoutTime)}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email/Username Field */}
          <div className="form-group">
            <label htmlFor="emailOrUsername" className="form-label">
              البريد الإلكتروني أو اسم المستخدم
            </label>
            <div className="relative">
              <input
                type="text"
                id="emailOrUsername"
                name="emailOrUsername"
                value={formData.emailOrUsername}
                onChange={handleChange}
                className={`form-input ${errors.emailOrUsername ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="ادخل البريد الإلكتروني أو اسم المستخدم"
                dir="rtl"
                disabled={isLocked}
              />
              <Mail className="form-icon" size={20} />
            </div>
            {errors.emailOrUsername && (
              <p className="text-red-500 text-sm mt-1">{errors.emailOrUsername}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="ادخل كلمة المرور"
                dir="rtl"
                disabled={isLocked}
              />
              <Lock className="form-icon" size={20} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLocked}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="ml-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isLocked}
              />
              <span className="text-sm text-gray-700">تذكرني</span>
            </label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              disabled={isLocked}
            >
              نسيت كلمة المرور؟
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading || isLocked}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="animate-spin ml-2" size={20} />
            ) : (
              <ArrowRight className="ml-2" size={20} />
            )}
            {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>

          {/* Demo Credentials */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-600 mb-2 font-medium">بيانات تجريبية للاختبار:</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>اسم المستخدم: <span className="font-mono">admin</span></p>
              <p>كلمة المرور: <span className="font-mono">password</span></p>
            </div>
          </div>
        </form>

        {/* Register Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            ليس لديك حساب؟{' '}
            <button
              onClick={onRegister}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              disabled={isLocked}
            >
              سجل الآن
            </button>
          </p>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="flex items-center text-gray-500 hover:text-gray-700 transition-colors mx-auto"
            disabled={isLocked}
          >
            <ArrowLeft className="ml-2" size={16} />
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;