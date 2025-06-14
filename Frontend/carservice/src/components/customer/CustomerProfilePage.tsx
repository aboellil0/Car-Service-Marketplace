import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Car, 
  Calendar, 
  Edit, 
  Save, 
  X,
  ArrowLeft,
  Camera,
  Shield,
  Bell,
  CreditCard,
  Key,
  Trash2,
  Plus,
  Check
} from 'lucide-react';

interface CustomerProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  profileImage?: string;
  joinDate: Date;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  vinNumber?: string;
  isDefault: boolean;
}

interface CustomerProfilePageProps {
  onClose: () => void;
  onBack: () => void;
}

const CustomerProfilePage: React.FC<CustomerProfilePageProps> = ({ onClose, onBack }) => {
  const [profile, setProfile] = useState<CustomerProfile>({
    id: '1',
    firstName: 'أحمد',
    lastName: 'محمد',
    email: 'ahmed.mohammed@email.com',
    phone: '0501234567',
    dateOfBirth: '1990-05-15',
    address: 'شارع الملك فهد، حي العليا',
    city: 'الرياض',
    state: 'منطقة الرياض',
    profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    joinDate: new Date('2023-01-15'),
    emailVerified: true,
    phoneVerified: true,
    twoFactorEnabled: false
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<CustomerProfile>(profile);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    plateNumber: '',
    vinNumber: '',
    isDefault: false
  });
  const [activeTab, setActiveTab] = useState<'profile' | 'vehicles' | 'security'>('profile');
  const [isLoading, setIsLoading] = useState(true);

  const cities = [
    'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 
    'الخبر', 'تبوك', 'أبها', 'القطيف', 'الطائف'
  ];

  const states = [
    'منطقة الرياض', 'منطقة مكة المكرمة', 'المنطقة الشرقية', 
    'منطقة المدينة المنورة', 'منطقة القصيم', 'منطقة حائل'
  ];

  const carMakes = [
    'تويوتا', 'هوندا', 'نيسان', 'هيونداي', 'كيا', 'شيفروليه', 
    'فورد', 'BMW', 'مرسيدس', 'أودي', 'لكزس', 'إنفينيتي'
  ];

  const colors = [
    'أبيض', 'أسود', 'فضي', 'رمادي', 'أحمر', 'أزرق', 
    'أخضر', 'بني', 'ذهبي', 'بيج'
  ];

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      const mockVehicles: Vehicle[] = [
        {
          id: '1',
          make: 'تويوتا',
          model: 'كامري',
          year: 2020,
          color: 'أبيض',
          plateNumber: 'أ ب ج 1234',
          vinNumber: '1HGBH41JXMN109186',
          isDefault: true
        },
        {
          id: '2',
          make: 'هوندا',
          model: 'أكورد',
          year: 2019,
          color: 'فضي',
          plateNumber: 'د هـ و 5678',
          isDefault: false
        }
      ];

      setVehicles(mockVehicles);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleProfileSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleProfileCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleVehicleSubmit = () => {
    if (editingVehicle) {
      setVehicles(vehicles.map(v => v.id === editingVehicle.id ? { ...editingVehicle, ...newVehicle } : v));
    } else {
      const vehicle: Vehicle = {
        id: Date.now().toString(),
        make: newVehicle.make!,
        model: newVehicle.model!,
        year: newVehicle.year!,
        color: newVehicle.color!,
        plateNumber: newVehicle.plateNumber!,
        vinNumber: newVehicle.vinNumber,
        isDefault: vehicles.length === 0 || newVehicle.isDefault!
      };
      
      // If this is set as default, remove default from others
      if (vehicle.isDefault) {
        setVehicles(vehicles.map(v => ({ ...v, isDefault: false })));
      }
      
      setVehicles([...vehicles, vehicle]);
    }
    
    setShowVehicleModal(false);
    setEditingVehicle(null);
    setNewVehicle({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      color: '',
      plateNumber: '',
      vinNumber: '',
      isDefault: false
    });
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setNewVehicle(vehicle);
    setShowVehicleModal(true);
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    const vehicleToDelete = vehicles.find(v => v.id === vehicleId);
    const remainingVehicles = vehicles.filter(v => v.id !== vehicleId);
    
    // If deleting the default vehicle and there are others, make the first one default
    if (vehicleToDelete?.isDefault && remainingVehicles.length > 0) {
      remainingVehicles[0].isDefault = true;
    }
    
    setVehicles(remainingVehicles);
  };

  const setDefaultVehicle = (vehicleId: string) => {
    setVehicles(vehicles.map(v => ({ ...v, isDefault: v.id === vehicleId })));
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Picture */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">الصورة الشخصية</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={profile.profileImage || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'}
              alt="الصورة الشخصية"
              className="w-20 h-20 rounded-full object-cover"
            />
            <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
              <Camera size={16} />
            </button>
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{profile.firstName} {profile.lastName}</h3>
            <p className="text-gray-600">عضو منذ {profile.joinDate.toLocaleDateString('ar-SA')}</p>
            <div className="flex items-center gap-2 mt-2">
              {profile.emailVerified && (
                <span className="flex items-center text-green-600 text-sm">
                  <Check className="ml-1" size={14} />
                  البريد موثق
                </span>
              )}
              {profile.phoneVerified && (
                <span className="flex items-center text-green-600 text-sm">
                  <Check className="ml-1" size={14} />
                  الهاتف موثق
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">المعلومات الشخصية</h2>
          <button
            onClick={() => isEditing ? handleProfileSave() : setIsEditing(true)}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {isEditing ? <Save className="ml-2" size={16} /> : <Edit className="ml-2" size={16} />}
            {isEditing ? 'حفظ' : 'تعديل'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الأول</label>
            <input
              type="text"
              value={isEditing ? editedProfile.firstName : profile.firstName}
              onChange={(e) => setEditedProfile({ ...editedProfile, firstName: e.target.value })}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              dir="rtl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الأخير</label>
            <input
              type="text"
              value={isEditing ? editedProfile.lastName : profile.lastName}
              onChange={(e) => setEditedProfile({ ...editedProfile, lastName: e.target.value })}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              dir="rtl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              value={isEditing ? editedProfile.email : profile.email}
              onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
            <input
              type="tel"
              value={isEditing ? editedProfile.phone : profile.phone}
              onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              dir="rtl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الميلاد</label>
            <input
              type="date"
              value={isEditing ? editedProfile.dateOfBirth : profile.dateOfBirth}
              onChange={(e) => setEditedProfile({ ...editedProfile, dateOfBirth: e.target.value })}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">المدينة</label>
            {isEditing ? (
              <select
                value={editedProfile.city}
                onChange={(e) => setEditedProfile({ ...editedProfile, city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                dir="rtl"
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={profile.city}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                dir="rtl"
              />
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
            <input
              type="text"
              value={isEditing ? editedProfile.address : profile.address}
              onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              dir="rtl"
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleProfileCancel}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleProfileSave}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              حفظ التغييرات
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderVehiclesTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">سياراتي</h2>
          <button
            onClick={() => setShowVehicleModal(true)}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="ml-2" size={16} />
            إضافة سيارة
          </button>
        </div>

        {vehicles.length === 0 ? (
          <div className="text-center py-8">
            <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">لا توجد سيارات مسجلة</h3>
            <p className="text-gray-600 mb-4">أضف سياراتك لتسهيل عملية الحجز</p>
            <button
              onClick={() => setShowVehicleModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              إضافة سيارة جديدة
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className={`border rounded-lg p-4 ${vehicle.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{vehicle.make} {vehicle.model}</h3>
                    <p className="text-gray-600">{vehicle.year} - {vehicle.color}</p>
                    <p className="text-sm text-gray-500">لوحة: {vehicle.plateNumber}</p>
                    {vehicle.vinNumber && (
                      <p className="text-xs text-gray-400">VIN: {vehicle.vinNumber}</p>
                    )}
                  </div>
                  {vehicle.isDefault && (
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                      افتراضية
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  {!vehicle.isDefault && (
                    <button
                      onClick={() => setDefaultVehicle(vehicle.id)}
                      className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-3 rounded text-sm transition-colors"
                    >
                      جعل افتراضية
                    </button>
                  )}
                  <button
                    onClick={() => handleEditVehicle(vehicle)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                    className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      {/* Account Security */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Shield className="ml-2 text-blue-600" size={20} />
          أمان الحساب
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">المصادقة الثنائية</h3>
              <p className="text-sm text-gray-600">طبقة حماية إضافية لحسابك</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm ${profile.twoFactorEnabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {profile.twoFactorEnabled ? 'مفعل' : 'غير مفعل'}
              </span>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                {profile.twoFactorEnabled ? 'إدارة' : 'تفعيل'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">كلمة المرور</h3>
              <p className="text-sm text-gray-600">آخر تغيير منذ 3 أشهر</p>
            </div>
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
              تغيير كلمة المرور
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">جلسات تسجيل الدخول</h3>
              <p className="text-sm text-gray-600">إدارة الأجهزة المتصلة</p>
            </div>
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
              عرض الجلسات
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Bell className="ml-2 text-green-600" size={20} />
          إعدادات الخصوصية
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">إشعارات البريد الإلكتروني</h3>
              <p className="text-sm text-gray-600">تلقي إشعارات الحجوزات والعروض</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">إشعارات الرسائل النصية</h3>
              <p className="text-sm text-gray-600">تلقي تذكيرات المواعيد عبر SMS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">مشاركة الموقع</h3>
              <p className="text-sm text-gray-600">السماح للورش بمعرفة موقعك</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-red-200">
        <h2 className="text-xl font-bold mb-4 text-red-600">منطقة الخطر</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div>
              <h3 className="font-medium text-red-900">حذف الحساب</h3>
              <p className="text-sm text-red-700">حذف نهائي لجميع بياناتك</p>
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
              حذف الحساب
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الملف الشخصي...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full ml-3"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">الملف الشخصي</h1>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <User className="inline ml-2" size={16} />
              المعلومات الشخصية
            </button>
            <button
              onClick={() => setActiveTab('vehicles')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'vehicles'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Car className="inline ml-2" size={16} />
              السيارات ({vehicles.length})
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'security'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Shield className="inline ml-2" size={16} />
              الأمان والخصوصية
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'vehicles' && renderVehiclesTab()}
        {activeTab === 'security' && renderSecurityTab()}
      </div>

      {/* Vehicle Modal */}
      {showVehicleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">
                {editingVehicle ? 'تعديل السيارة' : 'إضافة سيارة جديدة'}
              </h3>
              <button
                onClick={() => {
                  setShowVehicleModal(false);
                  setEditingVehicle(null);
                  setNewVehicle({
                    make: '',
                    model: '',
                    year: new Date().getFullYear(),
                    color: '',
                    plateNumber: '',
                    vinNumber: '',
                    isDefault: false
                  });
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الماركة</label>
                  <select
                    value={newVehicle.make}
                    onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    dir="rtl"
                  >
                    <option value="">اختر الماركة</option>
                    {carMakes.map(make => (
                      <option key={make} value={make}>{make}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الموديل</label>
                  <input
                    type="text"
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="مثال: كامري"
                    dir="rtl"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">السنة</label>
                  <input
                    type="number"
                    value={newVehicle.year}
                    onChange={(e) => setNewVehicle({ ...newVehicle, year: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1990"
                    max={new Date().getFullYear() + 1}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اللون</label>
                  <select
                    value={newVehicle.color}
                    onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    dir="rtl"
                  >
                    <option value="">اختر اللون</option>
                    {colors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم اللوحة</label>
                <input
                  type="text"
                  value={newVehicle.plateNumber}
                  onChange={(e) => setNewVehicle({ ...newVehicle, plateNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="مثال: أ ب ج 1234"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهيكل (اختياري)</label>
                <input
                  type="text"
                  value={newVehicle.vinNumber}
                  onChange={(e) => setNewVehicle({ ...newVehicle, vinNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="VIN Number"
                  dir="ltr"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={newVehicle.isDefault}
                  onChange={(e) => setNewVehicle({ ...newVehicle, isDefault: e.target.checked })}
                  className="ml-2"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-700">
                  جعل هذه السيارة افتراضية
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowVehicleModal(false);
                  setEditingVehicle(null);
                  setNewVehicle({
                    make: '',
                    model: '',
                    year: new Date().getFullYear(),
                    color: '',
                    plateNumber: '',
                    vinNumber: '',
                    isDefault: false
                  });
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleVehicleSubmit}
                disabled={!newVehicle.make || !newVehicle.model || !newVehicle.plateNumber}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                {editingVehicle ? 'تحديث' : 'إضافة'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfilePage;