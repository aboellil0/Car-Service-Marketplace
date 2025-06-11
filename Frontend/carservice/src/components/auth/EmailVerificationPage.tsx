import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  ArrowRight, 
  ArrowLeft,
  Clock,
  Loader2,
  Shield
} from 'lucide-react';

interface EmailVerificationPageProps {
  onClose: () => void;
  onVerificationSuccess: () => void;
  userEmail?: string;
}

const EmailVerificationPage: React.FC<EmailVerificationPageProps> = ({ 
  onClose, 
  onVerificationSuccess,
  userEmail = 'user@example.com'
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // Auto-focus on input and handle paste
  useEffect(() => {
    const input = document.getElementById('verificationCode');
    if (input) {
      input.focus();
    }
  }, []);

  // Handle paste event for verification code
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const pastedText = e.clipboardData?.getData('text');
      if (pastedText && /^\d{6}$/.test(pastedText)) {
        setVerificationCode(pastedText);
        handleVerification(pastedText);
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(value);
    setError('');

    // Auto-submit when 6 digits are entered
    if (value.length === 6) {
      handleVerification(value);
    }
  };

  const handleVerification = async (code: string = verificationCode) => {
    if (isLocked) return;
    
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock verification - accept "123456" as valid code
      if (code === '123456') {
        setIsVerified(true);
        setTimeout(() => {
          onVerificationSuccess();
        }, 2000);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= 5) {
          setIsLocked(true);
          setError('تم قفل التحقق لمدة 15 دقيقة بسبب المحاولات المتكررة');
          setTimeout(() => {
            setIsLocked(false);
            setAttempts(0);
          }, 15 * 60 * 1000); // 15 minutes
        } else {
          setError(`رمز التحقق غير صحيح. المحاولات المتبقية: ${5 - newAttempts}`);
        }
        setVerificationCode('');
      }
    } catch (error) {
      setError('حدث خطأ في التحقق. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || isLocked) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setResendCooldown(60); // 60 seconds cooldown
      setAttempts(0); // Reset attempts on resend
      
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
      setError('حدث خطأ في إعادة الإرسال. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-600 to-green-800"></div>
          
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">تم التحقق بنجاح!</h1>
          <p className="text-gray-600 mb-6">
            تم تفعيل حسابك بنجاح. يمكنك الآن الاستفادة من جميع خدمات المنصة.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 text-sm">
              مرحباً بك في منصة خدمات السيارات! نتطلع لخدمتك.
            </p>
          </div>
          
          <div className="flex items-center justify-center text-gray-500">
            <Loader2 className="animate-spin ml-2" size={16} />
            <span className="text-sm">جاري التوجيه...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-blue-800"></div>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">تحقق من بريدك الإلكتروني</h1>
          <p className="text-gray-600 mb-4">
            أرسلنا رمز التحقق إلى بريدك الإلكتروني
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-sm text-gray-700 font-medium">{userEmail}</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 ml-2 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Verification Form */}
        <div className="space-y-6">
          <div className="form-group">
            <label htmlFor="verificationCode" className="form-label text-center block">
              رمز التحقق
            </label>
            <div className="relative">
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={handleInputChange}
                className={`w-full px-4 py-4 text-center text-3xl tracking-widest border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  error ? 'border-red-500' : 'border-gray-300'
                } ${isLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder="123456"
                maxLength={6}
                disabled={isLoading || isLocked}
                dir="ltr"
              />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
                  <Loader2 className="animate-spin text-blue-600" size={24} />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              ادخل الرمز المكون من 6 أرقام
            </p>
          </div>

          {/* Demo Code Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-yellow-600 mt-0.5 ml-2 flex-shrink-0" />
              <div>
                <p className="text-yellow-800 text-sm font-medium mb-1">للاختبار:</p>
                <p className="text-yellow-700 text-sm">
                  استخدم الرمز <span className="font-mono bg-yellow-100 px-2 py-1 rounded">123456</span> للتحقق
                </p>
              </div>
            </div>
          </div>

          {/* Manual Verify Button */}
          <button
            onClick={() => handleVerification()}
            disabled={verificationCode.length !== 6 || isLoading || isLocked}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="animate-spin ml-2" size={20} />
            ) : (
              <ArrowRight className="ml-2" size={20} />
            )}
            {isLoading ? 'جاري التحقق...' : 'تحقق من الرمز'}
          </button>

          {/* Resend Section */}
          <div className="text-center space-y-3">
            <p className="text-gray-600 text-sm">لم تستلم الرمز؟</p>
            
            <button
              onClick={handleResendCode}
              disabled={resendCooldown > 0 || isLoading || isLocked}
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

            {/* Help Text */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-600">
                تحقق من مجلد الرسائل غير المرغوب فيها (Spam) إذا لم تجد الرسالة في صندوق الوارد
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={onClose}
            className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isLoading}
          >
            <ArrowLeft className="ml-2" size={16} />
            العودة
          </button>
          
          <div className="text-xs text-gray-400">
            المحاولة {attempts}/5
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;