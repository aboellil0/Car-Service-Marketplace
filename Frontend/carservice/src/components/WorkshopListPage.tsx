import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  Phone, 
  Clock, 
  Car, 
  Filter,
  Navigation,
  ExternalLink,
  ArrowLeft,
  Heart,
  Shield,
  Award,
  Users,
  Calendar,
  Wrench,
  DollarSign
} from 'lucide-react';

interface Workshop {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  rating: number;
  reviewCount: number;
  distance: number;
  isOpen: boolean;
  openingHours: string;
  services: string[];
  specialties: string[];
  priceRange: 'budget' | 'mid' | 'premium';
  verified: boolean;
  responseTime: string;
  completedJobs: number;
  images: string[];
  location: {
    latitude: number;
    longitude: number;
  };
}

interface WorkshopListPageProps {
  onClose: () => void;
}

const WorkshopListPage: React.FC<WorkshopListPageProps> = ({ onClose }) => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'price'>('distance');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);

  const cities = [
    'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 
    'الخبر', 'تبوك', 'أبها', 'القطيف', 'الطائف'
  ];

  const services = [
    'صيانة عامة', 'تغيير زيت', 'فحص دوري', 'إصلاح المحرك', 
    'إصلاح الفرامل', 'تكييف السيارة', 'كهرباء السيارة', 'إطارات'
  ];

  // Mock data
  useEffect(() => {
    const mockWorkshops: Workshop[] = [
      {
        id: '1',
        name: 'ورشة الخليج للسيارات',
        description: 'ورشة متخصصة في صيانة جميع أنواع السيارات مع خبرة 15 عام',
        address: 'شارع الملك فهد، حي العليا',
        city: 'الرياض',
        state: 'منطقة الرياض',
        phone: '0112345678',
        rating: 4.8,
        reviewCount: 156,
        distance: 2.3,
        isOpen: true,
        openingHours: '8:00 ص - 10:00 م',
        services: ['صيانة عامة', 'تغيير زيت', 'فحص دوري', 'إصلاح المحرك'],
        specialties: ['تويوتا', 'هوندا', 'نيسان'],
        priceRange: 'mid',
        verified: true,
        responseTime: '15 دقيقة',
        completedJobs: 1250,
        images: ['https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg'],
        location: { latitude: 24.7136, longitude: 46.6753 }
      },
      {
        id: '2',
        name: 'مركز النجم الذهبي',
        description: 'مركز خدمة شامل للسيارات الفاخرة والعادية',
        address: 'طريق الملك عبدالعزيز، حي الملز',
        city: 'الرياض',
        state: 'منطقة الرياض',
        phone: '0112345679',
        rating: 4.6,
        reviewCount: 89,
        distance: 4.1,
        isOpen: false,
        openingHours: '7:00 ص - 9:00 م',
        services: ['تكييف السيارة', 'كهرباء السيارة', 'إطارات', 'صيانة عامة'],
        specialties: ['BMW', 'مرسيدس', 'أودي'],
        priceRange: 'premium',
        verified: true,
        responseTime: '20 دقيقة',
        completedJobs: 890,
        images: ['https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg'],
        location: { latitude: 24.6877, longitude: 46.7219 }
      },
      {
        id: '3',
        name: 'ورشة السرعة',
        description: 'خدمة سريعة وأسعار مناسبة لجميع أنواع السيارات',
        address: 'شارع الأمير محمد بن عبدالعزيز، حي السليمانية',
        city: 'الرياض',
        state: 'منطقة الرياض',
        phone: '0112345680',
        rating: 4.2,
        reviewCount: 234,
        distance: 1.8,
        isOpen: true,
        openingHours: '6:00 ص - 11:00 م',
        services: ['تغيير زيت', 'إصلاح الفرامل', 'فحص دوري'],
        specialties: ['هيونداي', 'كيا', 'شيفروليه'],
        priceRange: 'budget',
        verified: false,
        responseTime: '10 دقائق',
        completedJobs: 567,
        images: ['https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg'],
        location: { latitude: 24.7453, longitude: 46.6291 }
      }
    ];

    setTimeout(() => {
      setWorkshops(mockWorkshops);
      setFilteredWorkshops(mockWorkshops);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = workshops.filter(workshop => {
      const matchesSearch = workshop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           workshop.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCity = !selectedCity || workshop.city === selectedCity;
      const matchesService = !selectedService || workshop.services.includes(selectedService);
      
      return matchesSearch && matchesCity && matchesService;
    });

    // Sort workshops
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          const priceOrder = { budget: 1, mid: 2, premium: 3 };
          return priceOrder[a.priceRange] - priceOrder[b.priceRange];
        default:
          return a.distance - b.distance;
      }
    });

    setFilteredWorkshops(filtered);
  }, [workshops, searchTerm, selectedCity, selectedService, sortBy]);

  const toggleFavorite = (workshopId: string) => {
    setFavorites(prev => 
      prev.includes(workshopId) 
        ? prev.filter(id => id !== workshopId)
        : [...prev, workshopId]
    );
  };

  const getPriceRangeText = (range: Workshop['priceRange']) => {
    switch (range) {
      case 'budget': return 'اقتصادي';
      case 'mid': return 'متوسط';
      case 'premium': return 'مميز';
    }
  };

  const getPriceRangeColor = (range: Workshop['priceRange']) => {
    switch (range) {
      case 'budget': return 'text-green-600 bg-green-100';
      case 'mid': return 'text-blue-600 bg-blue-100';
      case 'premium': return 'text-purple-600 bg-purple-100';
    }
  };

  if (selectedWorkshop) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Workshop Detail Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <button
              onClick={() => setSelectedWorkshop(null)}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <ArrowLeft className="ml-2" size={20} />
              العودة للقائمة
            </button>
            
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h1 className="text-2xl font-bold text-gray-900 ml-3">{selectedWorkshop.name}</h1>
                  {selectedWorkshop.verified && (
                    <Shield className="text-blue-600" size={20} />
                  )}
                </div>
                <p className="text-gray-600 mb-3">{selectedWorkshop.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Star className="text-yellow-500 ml-1" size={16} />
                    <span>{selectedWorkshop.rating} ({selectedWorkshop.reviewCount} تقييم)</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="text-gray-400 ml-1" size={16} />
                    <span>{selectedWorkshop.distance} كم</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="text-gray-400 ml-1" size={16} />
                    <span className={selectedWorkshop.isOpen ? 'text-green-600' : 'text-red-600'}>
                      {selectedWorkshop.isOpen ? 'مفتوح الآن' : 'مغلق'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => toggleFavorite(selectedWorkshop.id)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Heart 
                  className={favorites.includes(selectedWorkshop.id) ? 'text-red-500 fill-current' : 'text-gray-400'} 
                  size={24} 
                />
              </button>
            </div>
          </div>
        </div>

        {/* Workshop Details */}
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Services */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Wrench className="ml-2 text-blue-600" size={20} />
                  الخدمات المتاحة
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {selectedWorkshop.services.map((service, index) => (
                    <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                      <Car className="text-blue-600 ml-2" size={16} />
                      <span className="text-gray-800">{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specialties */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Award className="ml-2 text-green-600" size={20} />
                  التخصصات
                </h2>
                <div className="flex flex-wrap gap-2">
                  {selectedWorkshop.specialties.map((specialty, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <MapPin className="ml-2 text-red-600" size={20} />
                  الموقع
                </h2>
                <p className="text-gray-700 mb-3">{selectedWorkshop.address}</p>
                <p className="text-gray-600 mb-4">{selectedWorkshop.city}, {selectedWorkshop.state}</p>
                <button
                  onClick={() => window.open(`https://maps.google.com/?q=${selectedWorkshop.location.latitude},${selectedWorkshop.location.longitude}`, '_blank')}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <Navigation className="ml-1" size={16} />
                  عرض على الخريطة
                  <ExternalLink className="mr-1" size={12} />
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold mb-4">معلومات التواصل</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Phone className="text-green-600 ml-2" size={16} />
                    <span className="text-gray-700">{selectedWorkshop.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="text-blue-600 ml-2" size={16} />
                    <span className="text-gray-700">{selectedWorkshop.openingHours}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="text-purple-600 ml-2" size={16} />
                    <span className={`px-2 py-1 rounded text-sm ${getPriceRangeColor(selectedWorkshop.priceRange)}`}>
                      {getPriceRangeText(selectedWorkshop.priceRange)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold mb-4">الإحصائيات</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">الأعمال المكتملة</span>
                    <span className="font-bold text-green-600">{selectedWorkshop.completedJobs}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">وقت الاستجابة</span>
                    <span className="font-bold text-blue-600">{selectedWorkshop.responseTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">التقييم</span>
                    <div className="flex items-center">
                      <Star className="text-yellow-500 ml-1" size={16} />
                      <span className="font-bold">{selectedWorkshop.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
                  <Calendar className="ml-2" size={20} />
                  حجز موعد
                </button>
                <button
                  onClick={() => window.open(`tel:${selectedWorkshop.phone}`)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Phone className="ml-2" size={20} />
                  اتصال مباشر
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full ml-3"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">الورش المتاحة</h1>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Filter className="ml-2" size={16} />
              فلترة
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="البحث عن ورشة أو خدمة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              dir="rtl"
            />
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المدينة</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    dir="rtl"
                  >
                    <option value="">جميع المدن</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الخدمة</label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    dir="rtl"
                  >
                    <option value="">جميع الخدمات</option>
                    {services.map(service => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ترتيب حسب</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    dir="rtl"
                  >
                    <option value="distance">المسافة</option>
                    <option value="rating">التقييم</option>
                    <option value="price">السعر</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSelectedCity('');
                      setSelectedService('');
                      setSortBy('distance');
                    }}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    إعادة تعيين
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Workshop List */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل الورش...</p>
          </div>
        ) : filteredWorkshops.length === 0 ? (
          <div className="text-center py-12">
            <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد ورش متاحة</h3>
            <p className="text-gray-600">جرب تغيير معايير البحث أو الفلترة</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkshops.map((workshop) => (
              <div key={workshop.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={workshop.images[0]}
                    alt={workshop.name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => toggleFavorite(workshop.id)}
                    className="absolute top-3 left-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                  >
                    <Heart 
                      className={favorites.includes(workshop.id) ? 'text-red-500 fill-current' : 'text-gray-400'} 
                      size={20} 
                    />
                  </button>
                  <div className="absolute top-3 right-3 flex gap-2">
                    {workshop.verified && (
                      <div className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs flex items-center">
                        <Shield className="ml-1" size={12} />
                        موثق
                      </div>
                    )}
                    <div className={`px-2 py-1 rounded-full text-xs ${workshop.isOpen ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                      {workshop.isOpen ? 'مفتوح' : 'مغلق'}
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{workshop.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${getPriceRangeColor(workshop.priceRange)}`}>
                      {getPriceRangeText(workshop.priceRange)}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{workshop.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Star className="text-yellow-500 ml-1" size={14} />
                      <span>{workshop.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="text-gray-400 ml-1" size={14} />
                      <span>{workshop.distance} كم</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="text-gray-400 ml-1" size={14} />
                      <span>{workshop.completedJobs}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {workshop.services.slice(0, 3).map((service, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {service}
                      </span>
                    ))}
                    {workshop.services.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        +{workshop.services.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedWorkshop(workshop)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                    >
                      عرض التفاصيل
                    </button>
                    <button
                      onClick={() => window.open(`tel:${workshop.phone}`)}
                      className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
                    >
                      <Phone size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkshopListPage;