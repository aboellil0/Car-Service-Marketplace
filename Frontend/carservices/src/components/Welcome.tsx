import React from 'react';
import { UserCircle, Car } from 'lucide-react';

type WelcomeProps = {
  onUserTypeSelect: (type: 'customer' | 'workshop') => void;
};

const Welcome: React.FC<WelcomeProps> = ({ onUserTypeSelect }) => {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-8 text-primary-900">مرحباً بك في خدمات السيارات!</h1>
      <p className="text-xl mb-10">هل تريد التسجيل كـ:</p>
      
      <div className="flex flex-col space-y-4 w-full max-w-xs mx-auto">
        <button
          onClick={() => onUserTypeSelect('customer')}
          className="btn-primary flex items-center justify-center"
        >
          <UserCircle className="ml-2" size={24} />
          <span>عميل جديد</span>
        </button>
        
        <button
          onClick={() => onUserTypeSelect('workshop')}
          className="btn-secondary flex items-center justify-center"
        >
          <Car className="ml-2" size={24} />
          <span>صاحب ورشة</span>
        </button>
      </div>
    </div>
  );
};

export default Welcome;