import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Star, 
  MapPin, 
  Phone, 
  Clock, 
  Car, 
  Search, 
  Filter,
  X,
  ArrowLeft,
  Calendar,
  Navigation,
  ExternalLink,
  Trash2,
  Grid,
  List,
  SortAsc
} from 'lucide-react';

interface FavoriteWorkshop {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  rating: number;
  reviewCount: number;
  distance: number;
  isOpen: boolean;
  openingHours: string;
  services: string[];
  specialties: string[];
  priceRange: 'budget' | 'mid' | 'premium';
  images: string[];
  dateAdded: Date;
  lastVisit?: Date;
  totalBookings: number;
  location: {
    latitude: number;
    longitude: number;
  };
}

interface FavoriteService {
  id: string;
  name: string;
  description: string;
  workshopName: string;
  workshopId: string;
  price: number;
  duration: number;
  category: string;
  dateAdded: Date;
  lastBooked?: Date;
  timesBooked: number;
}

interface FavoritesPageProps {
  onClose: () => void;
  onBack: () => void;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ onClose, onBack }) => {
  const [activeTab, setActiveTab] = useState<'workshops' | 'services'>('workshops');
  const [favoriteWorkshops, setFavoriteWorkshops] = useState<FavoriteWorkshop[]>([]);
  const [favoriteServices, setFavoriteServices] = useState<FavoriteService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'distance' | 'dateAdded'>('dateAdded');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      const mockWorkshops: FavoriteWorkshop[] = [
        {
          id: '1',
          name: 'ورشة الخليج للسيارات',
          description: 'ورشة متخصصة في صيانة جميع أنواع السيارات مع خبرة 15 عام',
          address: 'شارع الملك فهد، حي العليا',
          city: 'الرياض',
          phone: '0112345678',
          rating: 4.8,
          reviewCount: 156,
          distance: 2.3,
          isOpen: true,
          openingHours: '8:00 ص - 10:00 م',
          services: ['صيانة عامة', 'تغيير زيت', 'فحص دوري', 'إصلاح المحرك'],
          specialties: ['تويوتا', 'هوندا', 'نيسان'],
          priceRange: 'mid',
          images: ['https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg'],
          dateAdded: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          totalBookings: 5,
          location: { latitude: 24.7136, longitude: 46.6753 }
        },
        {
          id: '2',
          name: 'مركز النجم الذهبي',
          description: 'مركز خدمة شامل للسيارات الفاخرة والعادية',
          address: 'طريق الملك عبدالعزيز، حي الملز',
          city: 'الرياض',
          phone: '0112345679',
          rating: 4.6,
          reviewCount: 89,
          distance: 4.1,
          isOpen: false,
          openingHours: '7:00 ص - 9:00 م',
          services: ['تكييف السيارة', 'كهرباء السيارة', 'إطارات', 'صيانة عامة'],
          specialties: ['BMW', 'مرسيدس', 'أودي'],
          priceRange: 'premium',
          images: ['https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg'],
          dateAdded: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          lastVisit: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          totalBookings: 3,
          location: { latitude: 24.6877, longitude: 46.7219 }
        },
        {
          id: '3',
          name: 'ورشة السرعة',
          description: 'خدمة سريعة وأسعار مناسبة لجميع أنواع السيارات',
          address: 'شارع الأمير محمد بن عبدالعزيز، حي السليمانية',
          city: 'الرياض',
          phone: '0112345680',
          rating: 4.2,
          reviewCount: 234,
          distance: 1.8,
          isOpen: true,
          openingHours: '6:00 ص - 11:00 م',
          services: ['تغيير زيت', 'إصلاح الفرامل', 'فحص دوري'],
          specialties: ['هيونداي', 'كيا', 'شيفروليه'],
          priceRange: 'budget',
          images: ['https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg'],
          dateAdded: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          totalBookings: 2,
          location: { latitude: 24.7453, longitude: 46.6291 }
        }
      ];

      const mockServices: FavoriteService[] = [
        {
          id: '1',
          name: 'تغيير زيت المحرك',
          description: 'تغيير زيت المحرك مع الفلتر وفحص السوائل',
          workshopName: 'ورشة الخليج للسيارات',
          workshopId: '1',
          price: 150,
          duration: 30,
          category: 'تغيير زيت',
          dateAdded: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          lastBooked: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          timesBooked: 3
        },
        {
          id: '2',
          name: 'فحص شامل للسيارة',
          description: 'فحص شامل لجميع أجزاء السيارة مع تقرير مفصل',
          workshopName: 'مركز النجم الذهبي',
          workshopId: '2',
          price: 200,
          duration: 120,
          category: 'فحص دوري',
          dateAdded: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
          lastBooked: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          timesBooked: 2
        },
        {
          id: '3',
          name: 'إصلاح الفرامل',
          description: 'فحص وإصلاح نظام الفرامل الأمامي والخلفي',
          workshopName: 'ورشة السرعة',
          workshopId: '3',
          price: 300,
          duration: 90,
          category: 'إصلاح الفرامل',
          dateAdded: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          timesBooked: 1
        }
      ];

      setFavoriteWorkshops(mockWorkshops);
      setFavoriteServices(mockServices);
      setIsLoading(false);
    }, 1000);
  }, []);

  const removeFavoriteWorkshop = (workshopId: string) => {
    setFavoriteWorkshops(favoriteWorkshops.filter(w => w.id !== workshopId));
  };

  const removeFavoriteService = (serviceId: string) => {
    setFavoriteServices(favoriteServices.filter(s => s.id !== serviceId));
  };

  const getPriceRangeText = (range: FavoriteWorkshop['priceRange']) => {
    switch (range) {
      case 'budget': return 'اقتصادي';
      case 'mid': return 'متوسط';
      case 'premium': return 'مميز';
    }
  };

  const getPriceRangeColor = (range: FavoriteWorkshop['priceRange']) => {
    switch (range) {
      case 'budget': return 'text-green-600 bg-green-100';
      case 'mid': return 'text-blue-600 bg-blue-100';
      case 'premium': return 'text-purple-600 bg-purple-100';
    }
  };

  const filteredWorkshops = favoriteWorkshops
    .filter(workshop => 
      workshop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workshop.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'rating': return b.rating - a.rating;
        case 'distance': return a.distance - b.distance;
        case 'dateAdded': return b.dateAdded.getTime() - a.dateAdded.getTime();
        default: return 0;
      }
    });

  const filteredServices = favoriteServices
    .filter(service => 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.workshopName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'dateAdded': return b.dateAdded.getTime() - a.dateAdded.getTime();
        default: return 0;
      }
    });

  const renderWorkshopCard = (workshop: FavoriteWorkshop) => (
    <div key={workshop.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="relative">
        <img
          src={workshop.images[0]}
          alt={workshop.name}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={() => removeFavoriteWorkshop(workshop.id)}
          className="absolute top-3 left-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
        >
          <Heart className="text-red-500 fill-current" size={20} />
        </button>
        <div className="absolute top-3 right-3 flex gap-2">
          <div className={`px-2 py-1 rounded-full text-xs ${workshop.isOpen ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
            {workshop.isOpen ? 'مفتوح' : 'مغلق'}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900">{workshop.name}</h3>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getPriceRangeColor(workshop.priceRange)}`}>
            {getPriceRangeText(workshop.priceRange)}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{workshop.description}</p>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <Star className="text-yellow-500 ml-1" size={14} />
            <span>{workshop.rating} ({workshop.reviewCount})</span>
          </div>
          <div className="flex items-center">
            <MapPin className="text-gray-400 ml-1" size={14} />
            <span>{workshop.distance} كم</span>
          </div>
          <div className="flex items-center">
            <Calendar className="text-gray-400 ml-1" size={14} />
            <span>{workshop.totalBookings} حجز</span>
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

        <div className="text-xs text-gray-500 mb-4">
          <p>أضيف في: {workshop.dateAdded.toLocaleDateString('ar-SA')}</p>
          {workshop.lastVisit && (
            <p>آخر زيارة: {workshop.lastVisit.toLocaleDateString('ar-SA')}</p>
          )}
        </div>

        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm">
            حجز موعد
          </button>
          <button
            onClick={() => window.open(`tel:${workshop.phone}`)}
            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
          >
            <Phone size={16} />
          </button>
          <button
            onClick={() => window.open(`https://maps.google.com/?q=${workshop.location.latitude},${workshop.location.longitude}`, '_blank')}
            className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors"
          >
            <Navigation size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderWorkshopList = (workshop: FavoriteWorkshop) => (
    <div key={workshop.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-start gap-4">
        <img
          src={workshop.images[0]}
          alt={workshop.name}
          className="w-20 h-20 object-cover rounded-lg"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{workshop.name}</h3>
              <p className="text-gray-600 text-sm">{workshop.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${getPriceRangeColor(workshop.priceRange)}`}>
                {getPriceRangeText(workshop.priceRange)}
              </span>
              <button
                onClick={() => removeFavoriteWorkshop(workshop.id)}
                className="p-1 hover:bg-red-50 rounded transition-colors"
              >
                <Heart className="text-red-500 fill-current" size={16} />
              </button>
            </div>
          </div>

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
              <Calendar className="text-gray-400 ml-1" size={14} />
              <span>{workshop.totalBookings} حجز</span>
            </div>
            <div className={`px-2 py-1 rounded text-xs ${workshop.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {workshop.isOpen ? 'مفتوح' : 'مغلق'}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {workshop.services.slice(0, 4).map((service, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  {service}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                حجز موعد
              </button>
              <button
                onClick={() => window.open(`tel:${workshop.phone}`)}
                className="bg-green-600 hover:bg-green-700 text-white p-1 rounded"
              >
                <Phone size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderServiceCard = (service: FavoriteService) => (
    <div key={service.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{service.description}</p>
          <p className="text-blue-600 font-medium">{service.workshopName}</p>
        </div>
        <button
          onClick={() => removeFavoriteService(service.id)}
          className="p-2 hover:bg-red-50 rounded-full transition-colors"
        >
          <Heart className="text-red-500 fill-current" size={20} />
        </button>
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="text-xl font-bold text-green-600">{service.price} ر.س</span>
        <span className="text-sm text-gray-500">{service.duration} دقيقة</span>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
          {service.category}
        </span>
        <span>حُجز {service.timesBooked} مرة</span>
      </div>

      <div className="text-xs text-gray-500 mb-4">
        <p>أضيف في: {service.dateAdded.toLocaleDateString('ar-SA')}</p>
        {service.lastBooked && (
          <p>آخر حجز: {service.lastBooked.toLocaleDateString('ar-SA')}</p>
        )}
      </div>

      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
        حجز الخدمة
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المفضلة...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">المفضلة</h1>
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
              onClick={() => setActiveTab('workshops')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'workshops'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              الورش المفضلة ({favoriteWorkshops.length})
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'services'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              الخدمات المفضلة ({favoriteServices.length})
            </button>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={`البحث في ${activeTab === 'workshops' ? 'الورش' : 'الخدمات'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                dir="rtl"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                dir="rtl"
              >
                <option value="dateAdded">تاريخ الإضافة</option>
                <option value="name">الاسم</option>
                {activeTab === 'workshops' && (
                  <>
                    <option value="rating">التقييم</option>
                    <option value="distance">المسافة</option>
                  </>
                )}
              </select>
              {activeTab === 'workshops' && (
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    <List size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'workshops' ? (
          filteredWorkshops.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد ورش مفضلة</h3>
              <p className="text-gray-600">ابدأ بإضافة الورش التي تعجبك إلى المفضلة</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
            }>
              {filteredWorkshops.map(workshop => 
                viewMode === 'grid' ? renderWorkshopCard(workshop) : renderWorkshopList(workshop)
              )}
            </div>
          )
        ) : (
          filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد خدمات مفضلة</h3>
              <p className="text-gray-600">ابدأ بإضافة الخدمات التي تحتاجها إلى المفضلة</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map(renderServiceCard)}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;