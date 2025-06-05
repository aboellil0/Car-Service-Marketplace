import React from 'react';
import { UserCircle, AlertTriangle, Search, Car } from 'lucide-react';

type HomeProps = {
  isAuthenticated: boolean;
  onEmergencyService: () => void;
  onExploreOrRegister: () => void;
};

const Home: React.FC<HomeProps> = ({ isAuthenticated, onEmergencyService, onExploreOrRegister }) => {
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
          onClick={onEmergencyService}
          className="btn-secondary flex items-center justify-center"
        >
          <AlertTriangle className="ml-2" size={24} />
          <span>طلب خدمة طوارئ</span>
        </button>
        
        <button
          onClick={onExploreOrRegister}
          className="btn-primary flex items-center justify-center"
        >
          {isAuthenticated ? (
            <>
              <Search className="ml-2" size={24} />
              <span>استعرض الخدمات</span>
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
};

export default Home;