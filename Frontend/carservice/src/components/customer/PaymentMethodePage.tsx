import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Plus, 
  Edit, 
  Trash2, 
  X,
  ArrowLeft,
  Shield,
  Check,
  AlertCircle,
  Smartphone,
  Wallet,
  Building,
  Star
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'digital_wallet' | 'bank_transfer';
  name: string;
  details: string;
  lastFour?: string;
  expiryDate?: string;
  isDefault: boolean;
  isVerified: boolean;
  provider: string;
  icon: string;
  addedDate: Date;
}

interface PaymentMethodsPageProps {
  onClose: () => void;
  onBack: () => void;
}

const PaymentMethodsPage: React.FC<PaymentMethodsPageProps> = ({ onClose, onBack }) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] = useState<PaymentMethod['type']>('credit_card');
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    name: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    holderName: '',
    isDefault: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const paymentTypes = [
    {
      type: 'credit_card' as const,
      name: 'بطاقة ائتمان',
      icon: CreditCard,
      description: 'فيزا، ماستركارد، أمريكان إكسبريس'
    },
    {
      type: 'debit_card' as const,
      name: 'بطاقة خصم',
      icon: CreditCard,
      description: 'بطاقة خصم مباشر من البنك'
    },
    {
      type: 'digital_wallet' as const,
      name: 'محفظة رقمية',
      icon: Smartphone,
      description: 'Apple Pay، Google Pay، STC Pay'
    },
    {
      type: 'bank_transfer' as const,
      name: 'تحويل بنكي',
      icon: Building,
      description: 'تحويل مباشر من الحساب البنكي'
    }
  ];

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      const mockPaymentMethods: PaymentMethod[] = [
        {
          id: '1',
          type: 'credit_card',
          name: 'بطاقة الراجحي الائتمانية',
          details: 'بطاقة فيزا ذهبية',
          lastFour: '4532',
          expiryDate: '12/26',
          isDefault: true,
          isVerified: true,
          provider: 'Visa',
          icon: '💳',
          addedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        },
        {
          id: '2',
          type: 'digital_wallet',
          name: 'STC Pay',
          details: 'محفظة STC Pay الرقمية',
          isDefault: false,
          isVerified: true,
          provider: 'STC',
          icon: '📱',
          addedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        },
        {
          id: '3',
          type: 'debit_card',
          name: 'بطاقة الأهلي',
          details: 'بطاقة خصم مباشر',
          lastFour: '8901',
          expiryDate: '08/25',
          isDefault: false,
          isVerified: false,
          provider: 'Mastercard',
          icon: '💳',
          addedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      ];

      setPaymentMethods(mockPaymentMethods);
      setIsLoading(false);
    }, 1000);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (selectedType === 'credit_card' || selectedType === 'debit_card') {
      if (!newPaymentMethod.cardNumber) {
        newErrors.cardNumber = 'يرجى إدخال رقم البطاقة';
      } else if (!/^\d{16}$/.test(newPaymentMethod.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'رقم البطاقة يجب أن يكون 16 رقم';
      }

      if (!newPaymentMethod.expiryDate) {
        newErrors.expiryDate = 'يرجى إدخال تاريخ الانتهاء';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(newPaymentMethod.expiryDate)) {
        newErrors.expiryDate = 'تاريخ الانتهاء يجب أن يكون بصيغة MM/YY';
      }

      if (!newPaymentMethod.cvv) {
        newErrors.cvv = 'يرجى إدخال رمز الأمان';
      } else if (!/^\d{3,4}$/.test(newPaymentMethod.cvv)) {
        newErrors.cvv = 'رمز الأمان يجب أن يكون 3 أو 4 أرقام';
      }

      if (!newPaymentMethod.holderName.trim()) {
        newErrors.holderName = 'يرجى إدخال اسم حامل البطاقة';
      }
    }

    if (!newPaymentMethod.name.trim()) {
      newErrors.name = 'يرجى إدخال اسم طريقة الدفع';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddPaymentMethod = () => {
    if (!validateForm()) return;

    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: selectedType,
      name: newPaymentMethod.name,
      details: selectedType === 'credit_card' || selectedType === 'debit_card' 
        ? `بطاقة ${newPaymentMethod.holderName}`
        : newPaymentMethod.name,
      lastFour: selectedType === 'credit_card' || selectedType === 'debit_card' 
        ? newPaymentMethod.cardNumber.slice(-4)
        : undefined,
      expiryDate: newPaymentMethod.expiryDate || undefined,
      isDefault: paymentMethods.length === 0 || newPaymentMethod.isDefault,
      isVerified: false,
      provider: selectedType === 'credit_card' || selectedType === 'debit_card' 
        ? 'Visa' // This would be determined by card number
        : selectedType === 'digital_wallet' ? 'STC' : 'Bank',
      icon: selectedType === 'digital_wallet' ? '📱' : '💳',
      addedDate: new Date()
    };

    // If this is set as default, remove default from others
    if (newMethod.isDefault) {
      setPaymentMethods(paymentMethods.map(pm => ({ ...pm, isDefault: false })));
    }

    setPaymentMethods([...paymentMethods, newMethod]);
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setNewPaymentMethod({
      name: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      holderName: '',
      isDefault: false
    });
    setErrors({});
  };

  const handleDeletePaymentMethod = (methodId: string) => {
    const methodToDelete = paymentMethods.find(pm => pm.id === methodId);
    const remainingMethods = paymentMethods.filter(pm => pm.id !== methodId);
    
    // If deleting the default method and there are others, make the first one default
    if (methodToDelete?.isDefault && remainingMethods.length > 0) {
      remainingMethods[0].isDefault = true;
    }
    
    setPaymentMethods(remainingMethods);
  };

  const setDefaultPaymentMethod = (methodId: string) => {
    setPaymentMethods(paymentMethods.map(pm => ({ ...pm, isDefault: pm.id === methodId })));
  };

  const getTypeIcon = (type: PaymentMethod['type']) => {
    const typeConfig = paymentTypes.find(t => t.type === type);
    return typeConfig?.icon || CreditCard;
  };

  const getTypeColor = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'credit_card': return 'text-blue-600 bg-blue-100';
      case 'debit_card': return 'text-green-600 bg-green-100';
      case 'digital_wallet': return 'text-purple-600 bg-purple-100';
      case 'bank_transfer': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل طرق الدفع...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full ml-3"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">طرق الدفع</h1>
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

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <Shield className="text-blue-600 ml-3 mt-1" size={20} />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">أمان معلومات الدفع</h3>
              <p className="text-blue-700 text-sm">
                جميع معلومات الدفع محمية بتشفير SSL 256-bit ولا يتم حفظ معلومات البطاقة الحساسة على خوادمنا.
              </p>
            </div>
          </div>
        </div>

        {/* Add Payment Method Button */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">طرق الدفع المحفوظة</h2>
              <p className="text-gray-600">إدارة طرق الدفع الخاصة بك</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="ml-2" size={16} />
              إضافة طريقة دفع
            </button>
          </div>
        </div>

        {/* Payment Methods List */}
        {paymentMethods.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد طرق دفع محفوظة</h3>
            <p className="text-gray-600 mb-6">أضف طريقة دفع لتسهيل عملية الدفع في المستقبل</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              إضافة طريقة دفع جديدة
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method) => {
              const IconComponent = getTypeIcon(method.type);
              return (
                <div key={method.id} className={`bg-white rounded-lg shadow-sm border p-6 ${method.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${getTypeColor(method.type)}`}>
                        <IconComponent size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900">{method.name}</h3>
                          {method.isDefault && (
                            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                              افتراضية
                            </span>
                          )}
                          {method.isVerified ? (
                            <span className="flex items-center text-green-600 text-sm">
                              <Check className="ml-1" size={14} />
                              موثقة
                            </span>
                          ) : (
                            <span className="flex items-center text-yellow-600 text-sm">
                              <AlertCircle className="ml-1" size={14} />
                              غير موثقة
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-1">{method.details}</p>
                        {method.lastFour && (
                          <p className="text-sm text-gray-500">
                            •••• •••• •••• {method.lastFour}
                            {method.expiryDate && ` • انتهاء ${method.expiryDate}`}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                          أضيف في {method.addedDate.toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!method.isDefault && (
                        <button
                          onClick={() => setDefaultPaymentMethod(method.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          جعل افتراضية
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePaymentMethod(method.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {!method.isVerified && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <AlertCircle className="text-yellow-600 ml-2" size={16} />
                          <span className="text-yellow-800 text-sm">يتطلب التحقق لاستخدام هذه الطريقة</span>
                        </div>
                        <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition-colors">
                          تحقق الآن
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Popular Payment Methods */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">طرق الدفع المدعومة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center p-3 border border-gray-200 rounded-lg">
              <CreditCard className="text-blue-600 ml-2" size={20} />
              <span className="text-sm font-medium">Visa</span>
            </div>
            <div className="flex items-center p-3 border border-gray-200 rounded-lg">
              <CreditCard className="text-red-600 ml-2" size={20} />
              <span className="text-sm font-medium">Mastercard</span>
            </div>
            <div className="flex items-center p-3 border border-gray-200 rounded-lg">
              <Smartphone className="text-purple-600 ml-2" size={20} />
              <span className="text-sm font-medium">STC Pay</span>
            </div>
            <div className="flex items-center p-3 border border-gray-200 rounded-lg">
              <Building className="text-green-600 ml-2" size={20} />
              <span className="text-sm font-medium">تحويل بنكي</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Payment Method Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">إضافة طريقة دفع جديدة</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Payment Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">نوع طريقة الدفع</label>
              <div className="grid grid-cols-1 gap-3">
                {paymentTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <button
                      key={type.type}
                      onClick={() => setSelectedType(type.type)}
                      className={`flex items-center p-4 border rounded-lg transition-colors text-right ${
                        selectedType === type.type
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <IconComponent className="text-gray-600 ml-3" size={20} />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{type.name}</h4>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                      {selectedType === type.type && (
                        <Check className="text-blue-600" size={20} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اسم طريقة الدفع</label>
                <input
                  type="text"
                  value={newPaymentMethod.name}
                  onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="مثال: بطاقة الراجحي الائتمانية"
                  dir="rtl"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {(selectedType === 'credit_card' || selectedType === 'debit_card') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">رقم البطاقة</label>
                    <input
                      type="text"
                      value={newPaymentMethod.cardNumber}
                      onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, cardNumber: formatCardNumber(e.target.value) })}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      dir="ltr"
                    />
                    {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الانتهاء</label>
                      <input
                        type="text"
                        value={newPaymentMethod.expiryDate}
                        onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, expiryDate: formatExpiryDate(e.target.value) })}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="MM/YY"
                        maxLength={5}
                        dir="ltr"
                      />
                      {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">رمز الأمان</label>
                      <input
                        type="text"
                        value={newPaymentMethod.cvv}
                        onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, cvv: e.target.value.replace(/\D/g, '') })}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="123"
                        maxLength={4}
                        dir="ltr"
                      />
                      {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">اسم حامل البطاقة</label>
                    <input
                      type="text"
                      value={newPaymentMethod.holderName}
                      onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, holderName: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.holderName ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="الاسم كما هو مكتوب على البطاقة"
                      dir="rtl"
                    />
                    {errors.holderName && <p className="text-red-500 text-sm mt-1">{errors.holderName}</p>}
                  </div>
                </>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={newPaymentMethod.isDefault}
                  onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, isDefault: e.target.checked })}
                  className="ml-2"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-700">
                  جعل هذه طريقة الدفع الافتراضية
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleAddPaymentMethod}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                إضافة طريقة الدفع
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodsPage;