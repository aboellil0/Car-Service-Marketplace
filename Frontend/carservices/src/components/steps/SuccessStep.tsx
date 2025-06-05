import React from 'react';
import { Home } from 'lucide-react';

type SuccessStepProps = {
  userType: 'customer' | 'workshop' | '';
  onGoToHome: () => void;
};

const SuccessStep: React.FC<SuccessStepProps> = ({ userType, onGoToHome }) => {
  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      
      <h1 className="text-3xl font-bold mb-4 text-primary-900">تم التسجيل بنجاح!</h1>
      <p className="text-xl mb-8 text-gray-600">
        {userType === 'workshop'
          ? 'مرحباً بك في مجتمع مقدمي خدمات السيارات!'
          : 'أهلاً بك في عالم خدمات السيارات!'}
      </p>
      
      <button
        onClick={onGoToHome}
        className="btn-primary flex items-center justify-center mx-auto"
      >
        <Home className="ml-2" size={20} />
        <span>الذهاب إلى الصفحة الرئيسية</span>
      </button>
    </div>
  );
};

export default SuccessStep;