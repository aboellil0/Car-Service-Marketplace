import React, { useState, useEffect } from 'react';
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  Reply, 
  Filter, 
  Search,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Eye,
  Flag,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Download,
  X
} from 'lucide-react';

interface Review {
  id: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: Date;
  serviceType: string;
  vehicleDetails: string;
  bookingId: string;
  isVerified: boolean;
  helpfulVotes: number;
  response?: {
    message: string;
    date: Date;
    responderName: string;
  };
  status: 'published' | 'pending' | 'flagged';
  images?: string[];
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { stars: number; count: number; percentage: number }[];
  recentTrend: 'up' | 'down' | 'stable';
  responseRate: number;
  averageResponseTime: number;
}

interface CustomerReviewsProps {
  onClose: () => void;
}

const CustomerReviews: React.FC<CustomerReviewsProps> = ({ onClose }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'helpful'>('date');
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      const mockReviews: Review[] = [
        {
          id: '1',
          customerName: 'أحمد محمد',
          rating: 5,
          title: 'خدمة ممتازة وسريعة',
          comment: 'تم تغيير زيت المحرك بسرعة ومهنية عالية. الفريق محترف جداً والأسعار معقولة. أنصح بهذه الورشة بشدة.',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          serviceType: 'تغيير زيت المحرك',
          vehicleDetails: 'تويوتا كامري 2020',
          bookingId: 'BK001',
          isVerified: true,
          helpfulVotes: 12,
          status: 'published',
          response: {
            message: 'شكراً لك أحمد على التقييم الإيجابي. نسعد بخدمتك دائماً ونتطلع لرؤيتك مرة أخرى.',
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            responderName: 'إدارة الورشة'
          }
        },
        {
          id: '2',
          customerName: 'فاطمة علي',
          rating: 4,
          title: 'فحص شامل ومفصل',
          comment: 'الفحص كان شاملاً وحصلت على تقرير مفصل عن حالة السيارة. الوقت كان أطول من المتوقع قليلاً لكن النتيجة ممتازة.',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          serviceType: 'فحص شامل للسيارة',
          vehicleDetails: 'هوندا أكورد 2019',
          bookingId: 'BK002',
          isVerified: true,
          helpfulVotes: 8,
          status: 'published'
        },
        {
          id: '3',
          customerName: 'خالد السعد',
          rating: 3,
          title: 'خدمة جيدة مع بعض التأخير',
          comment: 'تم إصلاح الفرامل بشكل جيد لكن كان هناك تأخير في الموعد المحدد. الأسعار مناسبة والعمل نظيف.',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          serviceType: 'إصلاح الفرامل',
          vehicleDetails: 'نيسان التيما 2018',
          bookingId: 'BK003',
          isVerified: true,
          helpfulVotes: 5,
          status: 'published'
        },
        {
          id: '4',
          customerName: 'سارة أحمد',
          rating: 2,
          title: 'تجربة غير مرضية',
          comment: 'الخدمة لم تكن على المستوى المطلوب. كان هناك مشكلة في التواصل وتأخير كبير في التسليم.',
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          serviceType: 'صيانة تكييف السيارة',
          vehicleDetails: 'لكزس ES 2021',
          bookingId: 'BK004',
          isVerified: true,
          helpfulVotes: 3,
          status: 'flagged'
        },
        {
          id: '5',
          customerName: 'محمد عبدالله',
          rating: 5,
          title: 'ورشة موثوقة ومحترفة',
          comment: 'هذه ثالث مرة أتعامل مع الورشة والخدمة دائماً ممتازة. الفنيين محترفين والأسعار عادلة.',
          date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
          serviceType: 'صيانة دورية',
          vehicleDetails: 'BMW X5 2019',
          bookingId: 'BK005',
          isVerified: true,
          helpfulVotes: 15,
          status: 'pending'
        }
      ];

      const mockStats: ReviewStats = {
        totalReviews: 156,
        averageRating: 4.3,
        ratingDistribution: [
          { stars: 5, count: 89, percentage: 57.1 },
          { stars: 4, count: 32, percentage: 20.5 },
          { stars: 3, count: 18, percentage: 11.5 },
          { stars: 2, count: 12, percentage: 7.7 },
          { stars: 1, count: 5, percentage: 3.2 }
        ],
        recentTrend: 'up',
        responseRate: 78.2,
        averageResponseTime: 4.5
      };

      setReviews(mockReviews);
      setStats(mockStats);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.serviceType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = ratingFilter === 'all' || review.rating === ratingFilter;
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    
    return matchesSearch && matchesRating && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'helpful':
        return b.helpfulVotes - a.helpfulVotes;
      default:
        return b.date.getTime() - a.date.getTime();
    }
  });

  const handleResponse = (review: Review) => {
    setSelectedReview(review);
    setResponseText('');
    setShowResponseModal(true);
  };

  const submitResponse = () => {
    if (!selectedReview || !responseText.trim()) return;

    const updatedReviews = reviews.map(review => 
      review.id === selectedReview.id 
        ? {
            ...review,
            response: {
              message: responseText,
              date: new Date(),
              responderName: 'إدارة الورشة'
            }
          }
        : review
    );

    setReviews(updatedReviews);
    setShowResponseModal(false);
    setSelectedReview(null);
    setResponseText('');
  };

  const updateReviewStatus = (reviewId: string, newStatus: Review['status']) => {
    setReviews(reviews.map(review => 
      review.id === reviewId ? { ...review, status: newStatus } : review
    ));
  };

  const getStatusColor = (status: Review['status']) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'flagged': return 'text-red-600 bg-red-100';
    }
  };

  const getStatusText = (status: Review['status']) => {
    switch (status) {
      case 'published': return 'منشور';
      case 'pending': return 'في الانتظار';
      case 'flagged': return 'مبلغ عنه';
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

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Star className="text-yellow-600 ml-3" size={24} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">تقييمات العملاء</h1>
                <p className="text-gray-600">إدارة والرد على تقييمات العملاء</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                <Download className="ml-2" size={16} />
                تصدير التقييمات
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <BarChart3 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">إجمالي التقييمات</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
              </div>
              <MessageSquare className="text-blue-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">متوسط التقييم</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                  {renderStars(Math.round(stats.averageRating), 'sm')}
                </div>
              </div>
              <Star className="text-yellow-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">معدل الرد</p>
                <p className="text-2xl font-bold text-gray-900">{stats.responseRate}%</p>
              </div>
              <Reply className="text-green-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">متوسط وقت الرد</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageResponseTime} ساعة</p>
              </div>
              <Calendar className="text-purple-600" size={32} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rating Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">توزيع التقييمات</h2>
            
            <div className="space-y-3">
              {stats.ratingDistribution.map((rating) => (
                <div key={rating.stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm font-medium">{rating.stars}</span>
                    <Star className="text-yellow-500 fill-current" size={14} />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${rating.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">{rating.count}</span>
                  <span className="text-sm text-gray-500 w-12">{rating.percentage}%</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-900">الاتجاه الحالي</p>
                  <div className="flex items-center gap-1">
                    {stats.recentTrend === 'up' ? (
                      <TrendingUp className="text-green-600" size={16} />
                    ) : (
                      <TrendingDown className="text-red-600" size={16} />
                    )}
                    <span className={`text-sm font-medium ${
                      stats.recentTrend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stats.recentTrend === 'up' ? 'تحسن' : 'تراجع'}
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{stats.averageRating}</p>
                  <p className="text-xs text-blue-700">من 5</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4">
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
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  dir="rtl"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="published">منشور</option>
                  <option value="pending">في الانتظار</option>
                  <option value="flagged">مبلغ عنه</option>
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
              </div>
            </div>

            {/* Reviews */}
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900">{review.customerName}</h3>
                          {review.isVerified && (
                            <CheckCircle className="text-green-600" size={16} />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {renderStars(review.rating, 'sm')}
                          <span className="text-sm text-gray-500">
                            {review.date.toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(review.status)}`}>
                        {getStatusText(review.status)}
                      </span>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="text-gray-400" size={14} />
                        <span className="text-sm text-gray-500">{review.helpfulVotes}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-bold text-gray-900 mb-2">{review.title}</h4>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span>الخدمة: {review.serviceType}</span>
                    <span>السيارة: {review.vehicleDetails}</span>
                    <span>رقم الحجز: {review.bookingId}</span>
                  </div>

                  {review.response && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Reply className="text-blue-600" size={16} />
                        <span className="font-medium text-blue-900">رد من {review.response.responderName}</span>
                        <span className="text-xs text-blue-600">
                          {review.response.date.toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                      <p className="text-blue-800">{review.response.message}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      {!review.response && (
                        <button
                          onClick={() => handleResponse(review)}
                          className="flex items-center bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg transition-colors text-sm"
                        >
                          <Reply className="ml-1" size={16} />
                          رد
                        </button>
                      )}
                      
                      {review.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateReviewStatus(review.id, 'published')}
                            className="flex items-center bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg transition-colors text-sm"
                          >
                            <CheckCircle className="ml-1" size={16} />
                            نشر
                          </button>
                          <button
                            onClick={() => updateReviewStatus(review.id, 'flagged')}
                            className="flex items-center bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg transition-colors text-sm"
                          >
                            <Flag className="ml-1" size={16} />
                            إبلاغ
                          </button>
                        </>
                      )}

                      {review.status === 'flagged' && (
                        <button
                          onClick={() => updateReviewStatus(review.id, 'published')}
                          className="flex items-center bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg transition-colors text-sm"
                        >
                          <CheckCircle className="ml-1" size={16} />
                          إلغاء الإبلاغ
                        </button>
                      )}
                    </div>

                    <button className="flex items-center text-gray-500 hover:text-gray-700 transition-colors text-sm">
                      <Eye className="ml-1" size={16} />
                      عرض التفاصيل
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Response Modal */}
      {showResponseModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">الرد على التقييم</h3>
              <button
                onClick={() => setShowResponseModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">{selectedReview.customerName}</span>
                {renderStars(selectedReview.rating, 'sm')}
              </div>
              <p className="text-sm text-gray-600">{selectedReview.title}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">ردك على التقييم</label>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                placeholder="اكتب ردك هنا..."
                dir="rtl"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowResponseModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={submitResponse}
                disabled={!responseText.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                إرسال الرد
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerReviews;