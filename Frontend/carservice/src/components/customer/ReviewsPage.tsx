import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Calendar, 
  Car, 
  MapPin, 
  Edit, 
  Trash2, 
  X,
  ArrowLeft,
  Filter,
  Search,
  Plus,
  ThumbsUp,
  MessageSquare,
  Award,
  TrendingUp
} from 'lucide-react';

interface Review {
  id: string;
  workshopId: string;
  workshopName: string;
  workshopAddress: string;
  bookingId: string;
  service: string;
  vehicleDetails: string;
  rating: number;
  title: string;
  comment: string;
  date: Date;
  serviceDate: Date;
  isEditable: boolean;
  helpfulVotes: number;
  workshopResponse?: {
    message: string;
    date: Date;
  };
  images?: string[];
}

interface ReviewsPageProps {
  onClose: () => void;
  onBack: () => void;
}

const ReviewsPage: React.FC<ReviewsPageProps> = ({ onClose, onBack }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'helpful'>('date');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editForm, setEditForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      const mockReviews: Review[] = [
        {
          id: '1',
          workshopId: '1',
          workshopName: 'ورشة الخليج للسيارات',
          workshopAddress: 'شارع الملك فهد، حي العليا، الرياض',
          bookingId: 'BK001',
          service: 'تغيير زيت المحرك',
          vehicleDetails: 'تويوتا كامري 2020',
          rating: 5,
          title: 'خدمة ممتازة وسريعة',
          comment: 'تم تغيير الزيت بسرعة ومهنية عالية. الفريق محترف جداً والأسعار معقولة. أنصح بهذه الورشة بشدة.',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          serviceDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          isEditable: true,
          helpfulVotes: 12,
          workshopResponse: {
            message: 'شكراً لك على التقييم الإيجابي. نسعد بخدمتك دائماً.',
            date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
          }
        },
        {
          id: '2',
          workshopId: '2',
          workshopName: 'مركز النجم الذهبي',
          workshopAddress: 'طريق الملك عبدالعزيز، حي الملز، الرياض',
          bookingId: 'BK002',
          service: 'فحص شامل للسيارة',
          vehicleDetails: 'هوندا أكورد 2019',
          rating: 4,
          title: 'فحص شامل ومفصل',
          comment: 'الفحص كان شاملاً وحصلت على تقرير مفصل عن حالة السيارة. الوقت كان أطول من المتوقع قليلاً لكن النتيجة ممتازة.',
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          serviceDate: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000),
          isEditable: true,
          helpfulVotes: 8,
          images: ['https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg']
        },
        {
          id: '3',
          workshopId: '3',
          workshopName: 'ورشة السرعة',
          workshopAddress: 'شارع الأمير محمد بن عبدالعزيز، حي السليمانية، الرياض',
          bookingId: 'BK003',
          service: 'إصلاح الفرامل',
          vehicleDetails: 'نيسان التيما 2018',
          rating: 3,
          title: 'خدمة جيدة مع بعض التأخير',
          comment: 'تم إصلاح الفرامل بشكل جيد لكن كان هناك تأخير في الموعد المحدد. الأسعار مناسبة والعمل نظيف.',
          date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
          serviceDate: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
          isEditable: false,
          helpfulVotes: 5
        },
        {
          id: '4',
          workshopId: '1',
          workshopName: 'ورشة الخليج للسيارات',
          workshopAddress: 'شارع الملك فهد، حي العليا، الرياض',
          bookingId: 'BK004',
          service: 'صيانة تكييف السيارة',
          vehicleDetails: 'لكزس ES 2021',
          rating: 5,
          title: 'تكييف يعمل كالجديد',
          comment: 'تم تنظيف وصيانة التكييف بشكل ممتاز. الآن يعمل بكفاءة عالية والهواء بارد جداً. شكراً للفريق المحترف.',
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          serviceDate: new Date(Date.now() - 33 * 24 * 60 * 60 * 1000),
          isEditable: false,
          helpfulVotes: 15,
          workshopResponse: {
            message: 'نشكرك على ثقتك بنا. نسعى دائماً لتقديم أفضل الخدمات.',
            date: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000)
          }
        }
      ];

      setReviews(mockReviews);
      setFilteredReviews(mockReviews);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter and search reviews
  useEffect(() => {
    let filtered = reviews.filter(review => {
      const matchesSearch = review.workshopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           review.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           review.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRating = ratingFilter === 'all' || review.rating === ratingFilter;
      
      return matchesSearch && matchesRating;
    });

    // Sort reviews
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'helpful':
          return b.helpfulVotes - a.helpfulVotes;
        default:
          return b.date.getTime() - a.date.getTime();
      }
    });

    setFilteredReviews(filtered);
  }, [reviews, searchTerm, ratingFilter, sortBy]);

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setEditForm({
      rating: review.rating,
      title: review.title,
      comment: review.comment
    });
    setShowEditModal(true);
  };

  const handleUpdateReview = () => {
    if (!editingReview) return;

    const updatedReviews = reviews.map(review => 
      review.id === editingReview.id 
        ? { 
            ...review, 
            rating: editForm.rating,
            title: editForm.title,
            comment: editForm.comment,
            date: new Date() // Update the date to show it was recently edited
          }
        : review
    );

    setReviews(updatedReviews);
    setShowEditModal(false);
    setEditingReview(null);
  };

  const handleDeleteReview = (reviewId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا التقييم؟')) {
      setReviews(reviews.filter(review => review.id !== reviewId));
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${sizeClass} ${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل التقييمات...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">تقييماتي</h1>
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
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{reviews.length}</div>
            <p className="text-gray-600">إجمالي التقييمات</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <span className="text-3xl font-bold text-yellow-600 ml-2">{getAverageRating()}</span>
              <Star className="text-yellow-500 fill-current" size={24} />
            </div>
            <p className="text-gray-600">متوسط التقييم</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {reviews.reduce((acc, review) => acc + review.helpfulVotes, 0)}
            </div>
            <p className="text-gray-600">إعجابات التقييمات</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {reviews.filter(r => r.workshopResponse).length}
            </div>
            <p className="text-gray-600">ردود الورش</p>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">توزيع التقييمات</h2>
          <div className="space-y-2">
            {Object.entries(getRatingDistribution()).reverse().map(([rating, count]) => (
              <div key={rating} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium">{rating}</span>
                  <Star className="text-yellow-500 fill-current" size={16} />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${reviews.length > 0 ? (count / reviews.length) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="البحث في التقييمات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                dir="rtl"
              />
            </div>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              dir="rtl"
            >
              <option value="all">جميع التقييمات</option>
              <option value={5}>5 نجوم</option>
              <option value={4}>4 نجوم</option>
              <option value={3}>3 نجوم</option>
              <option value={2}>2 نجوم</option>
              <option value={1}>1 نجمة</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              dir="rtl"
            >
              <option value="date">الأحدث</option>
              <option value="rating">أعلى تقييم</option>
              <option value="helpful">الأكثر إفادة</option>
            </select>
            <button
              onClick={() => {
                setSearchTerm('');
                setRatingFilter('all');
                setSortBy('date');
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              إعادة تعيين
            </button>
          </div>
        </div>

        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد تقييمات</h3>
            <p className="text-gray-600">
              {searchTerm || ratingFilter !== 'all' 
                ? 'لا توجد تقييمات تطابق المعايير المحددة'
                : 'لم تقم بكتابة أي تقييمات بعد'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{review.workshopName}</h3>
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">
                        {review.date.toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-1">{review.service} - {review.vehicleDetails}</p>
                    <p className="text-gray-500 text-xs">{review.workshopAddress}</p>
                  </div>
                  
                  {review.isEditable && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditReview(review)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Review Content */}
                <div className="mb-4">
                  <h4 className="font-bold text-gray-900 mb-2">{review.title}</h4>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="mb-4">
                    <div className="flex gap-2 overflow-x-auto">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`صورة التقييم ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Workshop Response */}
                {review.workshopResponse && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="text-blue-600" size={16} />
                      <span className="font-medium text-blue-900">رد من الورشة</span>
                      <span className="text-xs text-blue-600">
                        {review.workshopResponse.date.toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                    <p className="text-blue-800">{review.workshopResponse.message}</p>
                  </div>
                )}

                {/* Review Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <ThumbsUp size={16} />
                      <span>{review.helpfulVotes} شخص وجد هذا التقييم مفيد</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>تاريخ الخدمة: {review.serviceDate.toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>
                  
                  {review.isEditable && (
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                      قابل للتعديل
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Review Modal */}
      {showEditModal && editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">تعديل التقييم</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">التقييم</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setEditForm({ ...editForm, rating: star })}
                      className="p-1"
                    >
                      <Star
                        className={`w-8 h-8 ${star <= editForm.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">عنوان التقييم</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="عنوان مختصر للتقييم"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">التعليق</label>
                <textarea
                  value={editForm.comment}
                  onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                  placeholder="شارك تجربتك مع الخدمة..."
                  dir="rtl"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleUpdateReview}
                disabled={!editForm.title.trim() || !editForm.comment.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;