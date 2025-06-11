import React, { useState } from 'react';
import { 
  Mail, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  RefreshCw,
  Clock
} from 'lucide-react';

interface ForgotPasswordPageProps {
  onClose: () => void;
  onBackToLogin: () => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onClose, onBackToLogin }) => {
  const [step, setStep] = useState<'email' | 'sent' | 'reset'>('email');
  const [formData, setFormData] = useState({
    email: '',
    resetCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateEmail = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'يرجى إدخال البريد الإلكتروني';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'يرجى إدخال بريد إلكتروني صحيح';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateResetCode = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.resetCode.trim()) {
      newErrors.resetCode = 'يرجى إدخال رمز التحقق';
    } else if (formData.resetCode.length !== 6) {
      newErrors.resetCode = 'رمز التحقق يجب أن يكون 6 أرقام';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateNewPassword = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'يرجى إدخال كلمة المرور الجديدة';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'يرجى تأكيد كلمة المرور';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'كلمات المرور غير متطابقة';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStep('sent');
      setResendCooldown(60); // 60 seconds cooldown
      
      // Start countdown
      const countdown = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      setErrors({ email: 'حدث خطأ في إرسال البريد. يرجى المحاولة مرة أخرى.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateResetCode()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock verification - accept "123456" as valid code
      if (formData.resetCode === '123456') {
        setStep('reset');
      } else {
        setErrors({ resetCode: 'رمز التحقق غير صحيح' });
      }
    } catch (error) {
      setErrors({ resetCode: 'حدث خطأ في التحقق. يرجى المحاولة مرة أخرى.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateNewPassword()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success and redirect to login
      setTimeout(() => {
        onBackToLogin();
      }, 3000);
    } catch (error) {
      setErrors({ newPassword: 'حدث خطأ في إعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResendCooldown(60);
      
      // Start countdown
      const countdown = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      setErrors({ general: 'حدث خطأ في إعادة الإرسال. يرجى المحاولة مرة أخرى.' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailStep = () => (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">نسيت كلمة المرور؟</h1>
        <p className="text-gray-600">لا تقلق، سنرسل لك رابط إعادة تعيين كلمة المرور</p>
      </div>

      <form onSubmit={handleSendResetEmail} className="space-y-6">
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            البريد الإلكتروني
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="ادخل بريدك الإلكتروني"
              dir="rtl"
            />
            <Mail className="form-icon" size={20} />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
        >
          {isLoading ? (
            <Loader2 className="animate-spin ml-2" size={20} />
          ) : (
            <ArrowRight className="ml-2" size={20} />
          )}
          {isLoading ? 'جاري الإرسال...' : 'إرسال رمز التحقق'}
        </button>
      </form>
    </div>
  );

  const renderSentStep = () => (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">تم إرسال الرمز!</h1>
        <p className="text-gray-600 mb-4">
          تم إرسال رمز التحقق إلى بريدك الإلكتروني
        </p>
        <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
          {formData.email}
        </p>
      </div>

      <form onSubmit={handleVerifyCode} className="space-y-6">
        <div className="form-group">
          <label htmlFor="resetCode" className="form-label">
            رمز التحقق
          </label>
          <div className="relative">
            <input
              type="text"
              id="resetCode"
              name="resetCode"
              value={formData.resetCode}
              onChange={handleChange}
              className={`form-input text-center text-2xl tracking-widest ${errors.resetCode ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="123456"
              maxLength={6}
              dir="ltr"
            />
          </div>
          {errors.resetCode && (
            <p className="text-red-500 text-sm mt-1">{errors.resetCode}</p>
          )}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
            <p className="text-yellow-800 text-sm">
              <strong>للاختبار:</strong> استخدم الرمز <span className="font-mono">123456</span>
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
        >
          {isLoading ? (
            <Loader2 className="animate-spin ml-2" size={20} />
          ) : (
            <ArrowRight className="ml-2" size={20} />
          )}
          {isLoading ? 'جاري التحقق...' : 'تحقق من الرمز'}
        </button>

        <div className="text-center">
          <p className="text-gray-600 text-sm mb-2">لم تستلم الرمز؟</p>
          <button
            type="button"
            onClick={handleResendCode}
            disabled={resendCooldown > 0 || isLoading}
            className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 transition-colors flex items-center justify-center mx-auto"
          >
            {resendCooldown > 0 ? (
              <>
                <Clock className="ml-2" size={16} />
                إعادة الإرسال خلال {resendCooldown} ثانية
              </>
            ) : (
              <>
                <RefreshCw className="ml-2" size={16} />
                إعادة إرسال الرمز
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  const renderResetStep = () => (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">إعادة تعيين كلمة المرور</h1>
        <p className="text-gray-600">اختر كلمة مرور جديدة وقوية لحسابك</p>
      </div>

      {isLoading && step === 'reset' && formData.newPassword && formData.confirmPassword ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">تم بنجاح!</h2>
          <p className="text-gray-600 mb-4">تم إعادة تعيين كلمة المرور بنجاح</p>
          <p className="text-sm text-gray-500">سيتم توجيهك لصفحة تسجيل الدخول...</p>
        </div>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              كلمة المرور الجديدة
            </label>
            <div className="relative">
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`form-input ${errors.newPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="ادخل كلمة المرور الجديدة"
                dir="rtl"
              />
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

          <div className="form-group">
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
                className={`form-input ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="أعد كتابة كلمة المرور"
                dir="rtl"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="animate-spin ml-2" size={20} />
            ) : (
              <ArrowRight className="ml-2" size={20} />
            )}
            {isLoading ? 'جاري الحفظ...' : 'حفظ كلمة المرور الجديدة'}
          </button>
        </form>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-blue-800"></div>
        
        {/* Error Messages */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 ml-2 flex-shrink-0" />
            <p className="text-red-700 text-sm">{errors.general}</p>
          </div>
        )}

        {/* Render Current Step */}
        {step === 'email' && renderEmailStep()}
        {step === 'sent' && renderSentStep()}
        {step === 'reset' && renderResetStep()}

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={onBackToLogin}
            className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="ml-2" size={16} />
            العودة لتسجيل الدخول
          </button>
          
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;