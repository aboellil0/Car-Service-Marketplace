import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Smartphone, 
  Key, 
  QrCode, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Download,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

interface TwoFactorAuthPageProps {
  onClose: () => void;
  onSetupComplete: () => void;
  onSkip?: () => void;
}

const TwoFactorAuthPage: React.FC<TwoFactorAuthPageProps> = ({ 
  onClose, 
  onSetupComplete,
  onSkip 
}) => {
  const [step, setStep] = useState<'intro' | 'setup' | 'verify' | 'backup' | 'complete'>('intro');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [secretKey] = useState('JBSWY3DPEHPK3PXP'); // Mock secret key
  const [qrCodeUrl] = useState('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/CarService:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=CarService');
  const [backupCodes] = useState([
    '1a2b3c4d',
    '5e6f7g8h',
    '9i0j1k2l',
    '3m4n5o6p',
    '7q8r9s0t',
    'u1v2w3x4',
    'y5z6a7b8',
    'c9d0e1f2'
  ]);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedBackup, setCopiedBackup] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const authenticatorApps = [
    { name: 'Google Authenticator', icon: '🔐', ios: 'https://apps.apple.com/app/google-authenticator/id388497605', android: 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2' },
    { name: 'Microsoft Authenticator', icon: '🛡️', ios: 'https://apps.apple.com/app/microsoft-authenticator/id983156458', android: 'https://play.google.com/store/apps/details?id=com.azure.authenticator' },
    { name: 'Authy', icon: '🔑', ios: 'https://apps.apple.com/app/authy/id494168017', android: 'https://play.google.com/store/apps/details?id=com.authy.authy' }
  ];

  const handleCopySecret = async () => {
    try {
      await navigator.clipboard.writeText(secretKey);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    } catch (error) {
      console.error('Failed to copy secret key');
    }
  };

  const handleCopyBackupCodes = async () => {
    try {
      await navigator.clipboard.writeText(backupCodes.join('\n'));
      setCopiedBackup(true);
      setTimeout(() => setCopiedBackup(false), 2000);
    } catch (error) {
      console.error('Failed to copy backup codes');
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode.length !== 6) {
      setError('يرجى إدخال رمز مكون من 6 أرقام');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock verification - accept "123456" as valid code
      if (verificationCode === '123456') {
        setStep('backup');
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= 3) {
          setError('تم تجاوز عدد المحاولات المسموحة. يرجى المحاولة لاحقاً.');
        } else {
          setError(`رمز التحقق غير صحيح. المحاولات المتبقية: ${3 - newAttempts}`);
        }
        setVerificationCode('');
      }
    } catch (error) {
      setError('حدث خطأ في التحقق. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(value);
    setError('');
  };

  const renderIntroStep = () => (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">تفعيل المصادقة الثنائية</h1>
        <p className="text-gray-600">احم حسابك بطبقة حماية إضافية</p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex items-start p-4 bg-blue-50 rounded-lg">
          <Shield className="w-6 h-6 text-blue-600 mt-1 ml-3 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">حماية محسنة</h3>
            <p className="text-blue-700 text-sm">حماية إضافية ضد الوصول غير المصرح به</p>
          </div>
        </div>
        
        <div className="flex items-start p-4 bg-green-50 rounded-lg">
          <Smartphone className="w-6 h-6 text-green-600 mt-1 ml-3 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-green-900 mb-1">سهولة الاستخدام</h3>
            <p className="text-green-700 text-sm">رموز تحقق سريعة من هاتفك المحمول</p>
          </div>
        </div>
        
        <div className="flex items-start p-4 bg-purple-50 rounded-lg">
          <Key className="w-6 h-6 text-purple-600 mt-1 ml-3 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-purple-900 mb-1">رموز احتياطية</h3>
            <p className="text-purple-700 text-sm">رموز احتياطية للوصول في حالة فقدان الهاتف</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => setStep('setup')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
        >
          <ArrowRight className="ml-2" size={20} />
          بدء الإعداد
        </button>
        
        {onSkip && (
          <button
            onClick={onSkip}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition duration-200"
          >
            تخطي الآن
          </button>
        )}
      </div>
    </div>
  );

  const renderSetupStep = () => (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <QrCode className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">إعداد تطبيق المصادقة</h1>
        <p className="text-gray-600">اتبع الخطوات أدناه لإعداد المصادقة الثنائية</p>
      </div>

      <div className="space-y-6">
        {/* Step 1: Download App */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center">
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm ml-2">1</span>
            حمل تطبيق المصادقة
          </h3>
          <div className="space-y-2">
            {authenticatorApps.map((app, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-2xl ml-3">{app.icon}</span>
                  <span className="font-medium text-gray-900">{app.name}</span>
                </div>
                <div className="flex gap-2">
                  <a
                    href={app.ios}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    iOS <ExternalLink className="mr-1" size={12} />
                  </a>
                  <a
                    href={app.android}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800 text-sm flex items-center"
                  >
                    Android <ExternalLink className="mr-1" size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Scan QR Code */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center">
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm ml-2">2</span>
            امسح رمز QR
          </h3>
          <div className="text-center">
            <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 inline-block mb-4">
              <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
            </div>
            <p className="text-sm text-gray-600">امسح هذا الرمز باستخدام تطبيق المصادقة</p>
          </div>
        </div>

        {/* Step 3: Manual Entry */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center">
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm ml-2">3</span>
            أو أدخل المفتاح يدوياً
          </h3>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <code className="text-sm font-mono text-gray-800 break-all">{secretKey}</code>
              <button
                onClick={handleCopySecret}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors ml-2"
              >
                {copiedSecret ? (
                  <CheckCircle size={16} />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            إذا لم تتمكن من مسح الرمز، انسخ هذا المفتاح وأدخله في التطبيق
          </p>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button
          onClick={() => setStep('intro')}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
        >
          <ArrowLeft className="ml-2" size={16} />
          السابق
        </button>
        <button
          onClick={() => setStep('verify')}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
        >
          التالي
          <ArrowRight className="mr-2" size={16} />
        </button>
      </div>
    </div>
  );

  const renderVerifyStep = () => (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Key className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">تحقق من الإعداد</h1>
        <p className="text-gray-600">أدخل الرمز المعروض في تطبيق المصادقة</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 ml-2 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleVerification} className="space-y-6">
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
              }`}
              placeholder="123456"
              maxLength={6}
              disabled={isLoading || attempts >= 3}
              dir="ltr"
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
                <Loader2 className="animate-spin text-blue-600" size={24} />
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            ادخل الرمز المكون من 6 أرقام من تطبيق المصادقة
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

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setStep('setup')}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            disabled={isLoading}
          >
            <ArrowLeft className="ml-2" size={16} />
            السابق
          </button>
          <button
            type="submit"
            disabled={verificationCode.length !== 6 || isLoading || attempts >= 3}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="animate-spin ml-2" size={20} />
            ) : (
              <ArrowRight className="ml-2" size={20} />
            )}
            {isLoading ? 'جاري التحقق...' : 'تحقق'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderBackupStep = () => (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Download className="w-8 h-8 text-yellow-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">احفظ الرموز الاحتياطية</h1>
        <p className="text-gray-600">احفظ هذه الرموز في مكان آمن للوصول في حالة فقدان هاتفك</p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 ml-2 flex-shrink-0" />
          <div>
            <p className="text-red-800 text-sm font-medium mb-1">تحذير مهم:</p>
            <p className="text-red-700 text-sm">
              كل رمز يمكن استخدامه مرة واحدة فقط. احفظها في مكان آمن ولا تشاركها مع أحد.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900">الرموز الاحتياطية</h3>
          <button
            onClick={handleCopyBackupCodes}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            {copiedBackup ? (
              <>
                <CheckCircle className="ml-1" size={16} />
                تم النسخ
              </>
            ) : (
              <>
                <Copy className="ml-1" size={16} />
                نسخ الكل
              </>
            )}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {backupCodes.map((code, index) => (
            <div key={index} className="bg-white p-2 rounded border font-mono text-sm text-center">
              {code}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-blue-900 mb-2">كيفية استخدام الرموز الاحتياطية:</h4>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• استخدم هذه الرموز إذا فقدت هاتفك أو لم تتمكن من الوصول لتطبيق المصادقة</li>
          <li>• كل رمز يعمل مرة واحدة فقط</li>
          <li>• احفظها في مكان آمن مثل مدير كلمات المرور</li>
        </ul>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setStep('verify')}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
        >
          <ArrowLeft className="ml-2" size={16} />
          السابق
        </button>
        <button
          onClick={() => setStep('complete')}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
        >
          إتمام الإعداد
          <ArrowRight className="mr-2" size={16} />
        </button>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-4">تم تفعيل المصادقة الثنائية!</h1>
      <p className="text-gray-600 mb-8">
        حسابك الآن محمي بطبقة حماية إضافية. ستحتاج لرمز من تطبيق المصادقة عند تسجيل الدخول.
      </p>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <h3 className="font-bold text-green-900 mb-3">ما تم إعداده:</h3>
        <div className="space-y-2 text-green-800 text-sm">
          <div className="flex items-center justify-center">
            <CheckCircle className="w-4 h-4 ml-2" />
            <span>تطبيق المصادقة مُفعل</span>
          </div>
          <div className="flex items-center justify-center">
            <CheckCircle className="w-4 h-4 ml-2" />
            <span>8 رموز احتياطية محفوظة</span>
          </div>
          <div className="flex items-center justify-center">
            <CheckCircle className="w-4 h-4 ml-2" />
            <span>حماية إضافية مُفعلة</span>
          </div>
        </div>
      </div>
      
      <button
        onClick={onSetupComplete}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
      >
        <ArrowRight className="ml-2" size={20} />
        متابعة إلى الحساب
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-blue-800"></div>
        
        {/* Progress Indicator */}
        {step !== 'complete' && (
          <div className="mb-6">
            <div className="flex justify-center space-x-2 space-x-reverse">
              {['intro', 'setup', 'verify', 'backup'].map((stepName, index) => (
                <div
                  key={stepName}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    stepName === step ? 'bg-blue-600' : 
                    ['intro', 'setup', 'verify', 'backup'].indexOf(step) > index ? 'bg-blue-300' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Render Current Step */}
        {step === 'intro' && renderIntroStep()}
        {step === 'setup' && renderSetupStep()}
        {step === 'verify' && renderVerifyStep()}
        {step === 'backup' && renderBackupStep()}
        {step === 'complete' && renderCompleteStep()}

        {/* Close Button */}
        {step !== 'complete' && (
          <div className="mt-8 text-center">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
            >
              إغلاق
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoFactorAuthPage;