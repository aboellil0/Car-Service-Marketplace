import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  Filter,
  BarChart3,
  PieChart,
  FileText,
  CreditCard,
  Wallet,
  Receipt,
  Target,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Eye,
  Calculator,
  Smartphone
} from 'lucide-react';

interface FinancialData {
  revenue: {
    total: number;
    change: number;
    trend: 'up' | 'down';
    monthly: { month: string; amount: number; expenses: number; profit: number }[];
  };
  expenses: {
    total: number;
    change: number;
    trend: 'up' | 'down';
    categories: { name: string; amount: number; percentage: number }[];
  };
  profit: {
    total: number;
    margin: number;
    change: number;
    trend: 'up' | 'down';
  };
  taxes: {
    vat: number;
    income: number;
    total: number;
    nextPayment: Date;
  };
  cashFlow: {
    inflow: number;
    outflow: number;
    net: number;
  };
  paymentMethods: {
    cash: number;
    card: number;
    transfer: number;
    digital: number;
  };
}

interface Transaction {
  id: string;
  date: Date;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  reference?: string;
  customer?: string;
}

interface FinancialReportsProps {
  onClose: () => void;
}

const FinancialReports: React.FC<FinancialReportsProps> = ({ onClose }) => {
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'expenses' | 'taxes' | 'transactions'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      const mockFinancialData: FinancialData = {
        revenue: {
          total: 125750,
          change: 15.3,
          trend: 'up',
          monthly: [
            { month: 'يناير', amount: 95000, expenses: 65000, profit: 30000 },
            { month: 'فبراير', amount: 108000, expenses: 72000, profit: 36000 },
            { month: 'مارس', amount: 115000, expenses: 78000, profit: 37000 },
            { month: 'أبريل', amount: 125750, expenses: 85000, profit: 40750 },
            { month: 'مايو', amount: 132000, expenses: 88000, profit: 44000 },
            { month: 'يونيو', amount: 145000, expenses: 95000, profit: 50000 }
          ]
        },
        expenses: {
          total: 85000,
          change: 8.7,
          trend: 'up',
          categories: [
            { name: 'الرواتب والأجور', amount: 35000, percentage: 41.2 },
            { name: 'قطع الغيار والمواد', amount: 25000, percentage: 29.4 },
            { name: 'الإيجار والمرافق', amount: 12000, percentage: 14.1 },
            { name: 'التأمين والرسوم', amount: 8000, percentage: 9.4 },
            { name: 'التسويق والإعلان', amount: 3000, percentage: 3.5 },
            { name: 'أخرى', amount: 2000, percentage: 2.4 }
          ]
        },
        profit: {
          total: 40750,
          margin: 32.4,
          change: 22.1,
          trend: 'up'
        },
        taxes: {
          vat: 18862.5,
          income: 10187.5,
          total: 29050,
          nextPayment: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        },
        cashFlow: {
          inflow: 125750,
          outflow: 85000,
          net: 40750
        },
        paymentMethods: {
          cash: 45000,
          card: 55000,
          transfer: 20000,
          digital: 5750
        }
      };

      const mockTransactions: Transaction[] = [
        {
          id: '1',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          type: 'income',
          category: 'خدمات الصيانة',
          description: 'تغيير زيت المحرك - تويوتا كامري',
          amount: 150,
          paymentMethod: 'بطاقة ائتمان',
          customer: 'أحمد محمد'
        },
        {
          id: '2',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          type: 'expense',
          category: 'قطع الغيار والمواد',
          description: 'شراء زيت محرك - 20 لتر',
          amount: 850,
          paymentMethod: 'تحويل بنكي',
          reference: 'INV-2024-001'
        },
        {
          id: '3',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          type: 'income',
          category: 'خدمات الصيانة',
          description: 'فحص شامل للسيارة - هوندا أكورد',
          amount: 200,
          paymentMethod: 'نقداً',
          customer: 'فاطمة علي'
        },
        {
          id: '4',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          type: 'expense',
          category: 'الرواتب والأجور',
          description: 'راتب شهر أبريل - خالد السعد',
          amount: 5500,
          paymentMethod: 'تحويل بنكي'
        },
        {
          id: '5',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          type: 'income',
          category: 'خدمات الصيانة',
          description: 'إصلاح الفرامل - نيسان التيما',
          amount: 300,
          paymentMethod: 'STC Pay',
          customer: 'محمد أحمد'
        }
      ];

      setFinancialData(mockFinancialData);
      setTransactions(mockTransactions);
      setIsLoading(false);
    }, 1000);
  }, [timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getChangeIcon = (trend: 'up' | 'down') => {
    return trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />;
  };

  const getChangeColor = (trend: 'up' | 'down') => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (selectedCategory === 'all') return true;
    return transaction.category === selectedCategory;
  });

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <div className={`flex items-center ${getChangeColor(financialData!.revenue.trend)}`}>
              {getChangeIcon(financialData!.revenue.trend)}
              <span className="text-sm font-medium mr-1">{financialData!.revenue.change}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(financialData!.revenue.total)}
          </h3>
          <p className="text-gray-600 text-sm">إجمالي الإيرادات</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingDown className="text-red-600" size={24} />
            </div>
            <div className={`flex items-center ${getChangeColor(financialData!.expenses.trend)}`}>
              {getChangeIcon(financialData!.expenses.trend)}
              <span className="text-sm font-medium mr-1">{financialData!.expenses.change}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(financialData!.expenses.total)}
          </h3>
          <p className="text-gray-600 text-sm">إجمالي المصروفات</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Target className="text-blue-600" size={24} />
            </div>
            <div className={`flex items-center ${getChangeColor(financialData!.profit.trend)}`}>
              {getChangeIcon(financialData!.profit.trend)}
              <span className="text-sm font-medium mr-1">{financialData!.profit.change}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(financialData!.profit.total)}
          </h3>
          <p className="text-gray-600 text-sm">صافي الربح ({financialData!.profit.margin}%)</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Receipt className="text-yellow-600" size={24} />
            </div>
            <div className="text-orange-600 flex items-center">
              <Calendar size={16} />
              <span className="text-sm font-medium mr-1">
                {Math.ceil((financialData!.taxes.nextPayment.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} يوم
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(financialData!.taxes.total)}
          </h3>
          <p className="text-gray-600 text-sm">الضرائب المستحقة</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">الإيرادات مقابل المصروفات</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {financialData!.revenue.monthly.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col gap-1">
                  <div
                    className="w-full bg-green-500 rounded-t-lg"
                    style={{ height: `${(data.amount / 150000) * 200}px` }}
                    title={`الإيرادات: ${formatCurrency(data.amount)}`}
                  ></div>
                  <div
                    className="w-full bg-red-500 rounded-b-lg"
                    style={{ height: `${(data.expenses / 150000) * 200}px` }}
                    title={`المصروفات: ${formatCurrency(data.expenses)}`}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-2 text-center">{data.month}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">الإيرادات</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">المصروفات</span>
            </div>
          </div>
        </div>

        {/* Expense Categories */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">توزيع المصروفات</h3>
          <div className="space-y-4">
            {financialData!.expenses.categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{category.name}</span>
                    <span className="text-sm text-gray-600">{category.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-900 mr-4">
                  {formatCurrency(category.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Methods & Cash Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">طرق الدفع</h3>
          <div className="space-y-4">
            {[
              { name: 'نقداً', amount: financialData!.paymentMethods.cash, icon: Wallet, color: 'text-green-600' },
              { name: 'بطاقة ائتمان', amount: financialData!.paymentMethods.card, icon: CreditCard, color: 'text-blue-600' },
              { name: 'تحويل بنكي', amount: financialData!.paymentMethods.transfer, icon: Receipt, color: 'text-purple-600' },
              { name: 'محفظة رقمية', amount: financialData!.paymentMethods.digital, icon: Smartphone, color: 'text-orange-600' }
            ].map((method, index) => {
              const IconComponent = method.icon;
              const percentage = (method.amount / financialData!.revenue.total) * 100;
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <IconComponent className={`${method.color} ml-3`} size={20} />
                    <span className="font-medium text-gray-900">{method.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(method.amount)}</p>
                    <p className="text-sm text-gray-600">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">التدفق النقدي</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <TrendingUp className="text-green-600 ml-3" size={20} />
                <span className="font-medium text-green-900">التدفق الداخل</span>
              </div>
              <span className="text-xl font-bold text-green-600">
                {formatCurrency(financialData!.cashFlow.inflow)}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div className="flex items-center">
                <TrendingDown className="text-red-600 ml-3" size={20} />
                <span className="font-medium text-red-900">التدفق الخارج</span>
              </div>
              <span className="text-xl font-bold text-red-600">
                {formatCurrency(financialData!.cashFlow.outflow)}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <div className="flex items-center">
                <Calculator className="text-blue-600 ml-3" size={20} />
                <span className="font-medium text-blue-900">صافي التدفق</span>
              </div>
              <span className="text-xl font-bold text-blue-600">
                {formatCurrency(financialData!.cashFlow.net)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">المعاملات المالية</h3>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            dir="rtl"
          >
            <option value="all">جميع الفئات</option>
            <option value="خدمات الصيانة">خدمات الصيانة</option>
            <option value="قطع الغيار والمواد">قطع الغيار والمواد</option>
            <option value="الرواتب والأجور">الرواتب والأجور</option>
            <option value="الإيجار والمرافق">الإيجار والمرافق</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                التاريخ
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                النوع
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الوصف
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المبلغ
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                طريقة الدفع
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المرجع
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.date.toLocaleDateString('ar-SA')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    transaction.type === 'income' 
                      ? 'text-green-800 bg-green-100' 
                      : 'text-red-800 bg-red-100'
                  }`}>
                    {transaction.type === 'income' ? 'إيراد' : 'مصروف'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{transaction.description}</div>
                  <div className="text-sm text-gray-500">{transaction.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.paymentMethod}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.customer || transaction.reference || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل التقارير المالية...</p>
        </div>
      </div>
    );
  }

  if (!financialData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="text-blue-600 ml-3" size={24} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">التقارير المالية</h1>
                <p className="text-gray-600">تحليل مالي شامل لأداء الورشة</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                dir="rtl"
              >
                <option value="week">الأسبوع الماضي</option>
                <option value="month">الشهر الماضي</option>
                <option value="quarter">الربع الماضي</option>
                <option value="year">السنة الماضية</option>
              </select>
              <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                <Download className="ml-2" size={16} />
                تصدير PDF
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8 space-x-reverse">
            {[
              { key: 'overview', label: 'نظرة عامة', icon: BarChart3 },
              { key: 'revenue', label: 'الإيرادات', icon: TrendingUp },
              { key: 'expenses', label: 'المصروفات', icon: TrendingDown },
              { key: 'taxes', label: 'الضرائب', icon: Receipt },
              { key: 'transactions', label: 'المعاملات', icon: FileText }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="ml-2" size={16} />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'transactions' && renderTransactions()}
        
        {/* Other tabs would be implemented similarly */}
        {activeTab === 'revenue' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">تفاصيل الإيرادات</h3>
            <p className="text-gray-600">سيتم تطوير هذا القسم قريباً...</p>
          </div>
        )}
        
        {activeTab === 'expenses' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">تفاصيل المصروفات</h3>
            <p className="text-gray-600">سيتم تطوير هذا القسم قريباً...</p>
          </div>
        )}
        
        {activeTab === 'taxes' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">إدارة الضرائب</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">ضريبة القيمة المضافة</h4>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(financialData.taxes.vat)}</p>
                <p className="text-sm text-blue-700">15% من المبيعات</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">ضريبة الدخل</h4>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(financialData.taxes.income)}</p>
                <p className="text-sm text-green-700">25% من الأرباح</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="font-medium text-orange-900 mb-2">الدفعة القادمة</h4>
                <p className="text-lg font-bold text-orange-600">
                  {financialData.taxes.nextPayment.toLocaleDateString('ar-SA')}
                </p>
                <p className="text-sm text-orange-700">خلال {Math.ceil((financialData.taxes.nextPayment.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} يوم</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialReports;