import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  AlertTriangle, 
  TrendingDown,
  TrendingUp,
  BarChart3,
  Download,
  Upload,
  Scan,
  RefreshCw,
  Eye,
  ShoppingCart,
  Truck,
  Calendar,
  X
} from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  partNumber: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  totalValue: number;
  supplier: string;
  location: string;
  lastRestocked: Date;
  expiryDate?: Date;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'expired';
  usageHistory: {
    date: Date;
    quantity: number;
    type: 'used' | 'restocked' | 'returned';
    notes?: string;
  }[];
}

interface InventoryManagementProps {
  onClose: () => void;
}

const InventoryManagement: React.FC<InventoryManagementProps> = ({ onClose }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    name: '',
    description: '',
    category: '',
    brand: '',
    partNumber: '',
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    unitPrice: 0,
    supplier: '',
    location: '',
    expiryDate: undefined
  });

  const categories = [
    'زيوت ومواد التشحيم',
    'فلاتر',
    'قطع غيار المحرك',
    'قطع غيار الفرامل',
    'إطارات',
    'بطاريات',
    'قطع كهربائية',
    'أدوات ومعدات',
    'مواد كيميائية',
    'إكسسوارات'
  ];

  const suppliers = [
    'شركة قطع الغيار المتحدة',
    'مؤسسة الخليج للسيارات',
    'شركة النجم الذهبي',
    'مجموعة السعودية للسيارات',
    'شركة الشرق الأوسط للقطع'
  ];

  const locations = [
    'المخزن الرئيسي - الرف A',
    'المخزن الرئيسي - الرف B',
    'المخزن الرئيسي - الرف C',
    'مخزن الزيوت',
    'مخزن الإطارات',
    'مخزن الأدوات'
  ];

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      const mockInventory: InventoryItem[] = [
        {
          id: '1',
          name: 'زيت محرك 5W-30',
          description: 'زيت محرك صناعي عالي الجودة',
          category: 'زيوت ومواد التشحيم',
          brand: 'موبيل 1',
          partNumber: 'MOB-5W30-4L',
          currentStock: 45,
          minStock: 20,
          maxStock: 100,
          unitPrice: 85,
          totalValue: 3825,
          supplier: 'شركة قطع الغيار المتحدة',
          location: 'مخزن الزيوت',
          lastRestocked: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          status: 'in_stock',
          usageHistory: [
            { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), quantity: 5, type: 'used', notes: 'خدمة تغيير زيت' },
            { date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), quantity: 50, type: 'restocked' }
          ]
        },
        {
          id: '2',
          name: 'فلتر هواء',
          description: 'فلتر هواء للسيارات اليابانية',
          category: 'فلاتر',
          brand: 'مان',
          partNumber: 'MANN-C25114',
          currentStock: 8,
          minStock: 15,
          maxStock: 50,
          unitPrice: 45,
          totalValue: 360,
          supplier: 'مؤسسة الخليج للسيارات',
          location: 'المخزن الرئيسي - الرف A',
          lastRestocked: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          status: 'low_stock',
          usageHistory: [
            { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), quantity: 2, type: 'used' },
            { date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), quantity: 3, type: 'used' }
          ]
        },
        {
          id: '3',
          name: 'تيل فرامل أمامي',
          description: 'تيل فرامل سيراميك عالي الأداء',
          category: 'قطع غيار الفرامل',
          brand: 'بريمبو',
          partNumber: 'BREMBO-P85020',
          currentStock: 0,
          minStock: 10,
          maxStock: 30,
          unitPrice: 120,
          totalValue: 0,
          supplier: 'شركة النجم الذهبي',
          location: 'المخزن الرئيسي - الرف B',
          lastRestocked: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
          status: 'out_of_stock',
          usageHistory: [
            { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), quantity: 2, type: 'used' },
            { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), quantity: 1, type: 'used' }
          ]
        },
        {
          id: '4',
          name: 'بطارية 12V 70Ah',
          description: 'بطارية سيارة خالية من الصيانة',
          category: 'بطاريات',
          brand: 'فارتا',
          partNumber: 'VARTA-E11',
          currentStock: 12,
          minStock: 5,
          maxStock: 25,
          unitPrice: 280,
          totalValue: 3360,
          supplier: 'مجموعة السعودية للسيارات',
          location: 'المخزن الرئيسي - الرف C',
          lastRestocked: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          status: 'in_stock',
          usageHistory: [
            { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), quantity: 1, type: 'used' },
            { date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), quantity: 15, type: 'restocked' }
          ]
        }
      ];

      setInventory(mockInventory);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: InventoryItem['status']) => {
    switch (status) {
      case 'in_stock': return 'text-green-600 bg-green-100';
      case 'low_stock': return 'text-yellow-600 bg-yellow-100';
      case 'out_of_stock': return 'text-red-600 bg-red-100';
      case 'expired': return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: InventoryItem['status']) => {
    switch (status) {
      case 'in_stock': return 'متوفر';
      case 'low_stock': return 'مخزون منخفض';
      case 'out_of_stock': return 'نفد المخزون';
      case 'expired': return 'منتهي الصلاحية';
    }
  };

  const getStatusIcon = (status: InventoryItem['status']) => {
    switch (status) {
      case 'in_stock': return <Package className="text-green-600" size={16} />;
      case 'low_stock': return <AlertTriangle className="text-yellow-600" size={16} />;
      case 'out_of_stock': return <TrendingDown className="text-red-600" size={16} />;
      case 'expired': return <Calendar className="text-gray-600" size={16} />;
    }
  };

  const calculateItemStatus = (item: Partial<InventoryItem>): InventoryItem['status'] => {
    if (item.expiryDate && item.expiryDate < new Date()) return 'expired';
    if ((item.currentStock || 0) === 0) return 'out_of_stock';
    if ((item.currentStock || 0) <= (item.minStock || 0)) return 'low_stock';
    return 'in_stock';
  };

  const handleAddItem = () => {
    const item: InventoryItem = {
      id: Date.now().toString(),
      name: newItem.name!,
      description: newItem.description!,
      category: newItem.category!,
      brand: newItem.brand!,
      partNumber: newItem.partNumber!,
      currentStock: newItem.currentStock!,
      minStock: newItem.minStock!,
      maxStock: newItem.maxStock!,
      unitPrice: newItem.unitPrice!,
      totalValue: newItem.currentStock! * newItem.unitPrice!,
      supplier: newItem.supplier!,
      location: newItem.location!,
      lastRestocked: new Date(),
      expiryDate: newItem.expiryDate,
      status: calculateItemStatus(newItem),
      usageHistory: [{
        date: new Date(),
        quantity: newItem.currentStock!,
        type: 'restocked',
        notes: 'إضافة صنف جديد'
      }]
    };

    setInventory([...inventory, item]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setNewItem(item);
    setShowAddModal(true);
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;

    const updatedItem = {
      ...editingItem,
      ...newItem,
      totalValue: newItem.currentStock! * newItem.unitPrice!,
      status: calculateItemStatus(newItem)
    };

    setInventory(inventory.map(item => 
      item.id === editingItem.id ? updatedItem : item
    ));
    setShowAddModal(false);
    setEditingItem(null);
    resetForm();
  };

  const handleDeleteItem = (itemId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الصنف؟')) {
      setInventory(inventory.filter(item => item.id !== itemId));
    }
  };

  const handleStockUpdate = (itemId: string, quantity: number, type: 'used' | 'restocked' | 'returned') => {
    setInventory(inventory.map(item => {
      if (item.id === itemId) {
        const newStock = type === 'used' 
          ? Math.max(0, item.currentStock - quantity)
          : item.currentStock + quantity;
        
        const updatedItem = {
          ...item,
          currentStock: newStock,
          totalValue: newStock * item.unitPrice,
          lastRestocked: type === 'restocked' ? new Date() : item.lastRestocked,
          usageHistory: [
            ...item.usageHistory,
            { date: new Date(), quantity, type }
          ]
        };
        
        updatedItem.status = calculateItemStatus(updatedItem);
        return updatedItem;
      }
      return item;
    }));
  };

  const resetForm = () => {
    setNewItem({
      name: '',
      description: '',
      category: '',
      brand: '',
      partNumber: '',
      currentStock: 0,
      minStock: 0,
      maxStock: 0,
      unitPrice: 0,
      supplier: '',
      location: '',
      expiryDate: undefined
    });
  };

  const getTotalValue = () => {
    return inventory.reduce((total, item) => total + item.totalValue, 0);
  };

  const getLowStockCount = () => {
    return inventory.filter(item => item.status === 'low_stock' || item.status === 'out_of_stock').length;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المخزون...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Package className="text-blue-600 ml-3" size={24} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">إدارة المخزون</h1>
                <p className="text-gray-600">تتبع وإدارة قطع الغيار والمواد</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="ml-2" size={16} />
                إضافة صنف
              </button>
              <button className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                <Upload className="ml-2" size={16} />
                استيراد
              </button>
              <button className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors">
                <Download className="ml-2" size={16} />
                تصدير
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

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">إجمالي الأصناف</p>
                <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
              </div>
              <Package className="text-blue-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">قيمة المخزون</p>
                <p className="text-2xl font-bold text-gray-900">{getTotalValue().toLocaleString()} ر.س</p>
              </div>
              <BarChart3 className="text-green-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">مخزون منخفض</p>
                <p className="text-2xl font-bold text-red-600">{getLowStockCount()}</p>
              </div>
              <AlertTriangle className="text-red-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">آخر تحديث</p>
                <p className="text-sm font-medium text-gray-900">اليوم</p>
              </div>
              <RefreshCw className="text-purple-600" size={32} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="البحث في المخزون..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                dir="rtl"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              dir="rtl"
            >
              <option value="all">جميع الفئات</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              dir="rtl"
            >
              <option value="all">جميع الحالات</option>
              <option value="in_stock">متوفر</option>
              <option value="low_stock">مخزون منخفض</option>
              <option value="out_of_stock">نفد المخزون</option>
              <option value="expired">منتهي الصلاحية</option>
            </select>
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Package size={16} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <BarChart3 size={16} />
              </button>
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setStatusFilter('all');
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              إعادة تعيين
            </button>
          </div>
        </div>

        {/* Inventory List */}
        {viewMode === 'list' ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الصنف
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المخزون
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      السعر
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      القيمة الإجمالية
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.brand} - {item.partNumber}</div>
                          <div className="text-xs text-gray-400">{item.category}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.currentStock}</div>
                        <div className="text-xs text-gray-500">الحد الأدنى: {item.minStock}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.unitPrice} ر.س
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.totalValue.toLocaleString()} ر.س
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(item.status)}
                          <span className={`mr-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                            {getStatusText(item.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setShowUsageModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEditItem(item)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInventory.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.brand} - {item.partNumber}</p>
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(item.status)}
                    <span className={`mr-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">المخزون الحالي:</span>
                    <span className="font-medium">{item.currentStock}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">السعر:</span>
                    <span className="font-medium">{item.unitPrice} ر.س</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">القيمة الإجمالية:</span>
                    <span className="font-bold text-green-600">{item.totalValue.toLocaleString()} ر.س</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setShowUsageModal(true);
                    }}
                    className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-3 rounded-lg transition-colors text-sm"
                  >
                    <Eye className="inline ml-1" size={14} />
                    عرض
                  </button>
                  <button
                    onClick={() => handleEditItem(item)}
                    className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-lg transition-colors"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">
                {editingItem ? 'تعديل الصنف' : 'إضافة صنف جديد'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingItem(null);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اسم الصنف</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الفئة</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    dir="rtl"
                  >
                    <option value="">اختر الفئة</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الماركة</label>
                  <input
                    type="text"
                    value={newItem.brand}
                    onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رقم القطعة</label>
                  <input
                    type="text"
                    value={newItem.partNumber}
                    onChange={(e) => setNewItem({ ...newItem, partNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ انتهاء الصلاحية (اختياري)</label>
                  <input
                    type="date"
                    value={newItem.expiryDate ? newItem.expiryDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value ? new Date(e.target.value) : undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">المخزون الحالي</label>
                    <input
                      type="number"
                      value={newItem.currentStock}
                      onChange={(e) => setNewItem({ ...newItem, currentStock: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الحد الأدنى</label>
                    <input
                      type="number"
                      value={newItem.minStock}
                      onChange={(e) => setNewItem({ ...newItem, minStock: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الحد الأقصى</label>
                    <input
                      type="number"
                      value={newItem.maxStock}
                      onChange={(e) => setNewItem({ ...newItem, maxStock: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">سعر الوحدة (ر.س)</label>
                  <input
                    type="number"
                    value={newItem.unitPrice}
                    onChange={(e) => setNewItem({ ...newItem, unitPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المورد</label>
                  <select
                    value={newItem.supplier}
                    onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    dir="rtl"
                  >
                    <option value="">اختر المورد</option>
                    {suppliers.map(supplier => (
                      <option key={supplier} value={supplier}>{supplier}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الموقع في المخزن</label>
                  <select
                    value={newItem.location}
                    onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    dir="rtl"
                  >
                    <option value="">اختر الموقع</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                {newItem.currentStock && newItem.unitPrice && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">القيمة الإجمالية</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {(newItem.currentStock * newItem.unitPrice).toLocaleString()} ر.س
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingItem(null);
                  resetForm();
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={editingItem ? handleUpdateItem : handleAddItem}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                {editingItem ? 'تحديث' : 'إضافة'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Usage History Modal */}
      {showUsageModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">تفاصيل الصنف</h3>
              <button
                onClick={() => {
                  setShowUsageModal(false);
                  setSelectedItem(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Item Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">{selectedItem.name}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">الماركة:</span>
                    <span className="font-medium mr-2">{selectedItem.brand}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">رقم القطعة:</span>
                    <span className="font-medium mr-2">{selectedItem.partNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">المخزون الحالي:</span>
                    <span className="font-medium mr-2">{selectedItem.currentStock}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">القيمة الإجمالية:</span>
                    <span className="font-medium mr-2">{selectedItem.totalValue.toLocaleString()} ر.س</span>
                  </div>
                </div>
              </div>

              {/* Usage History */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">سجل الاستخدام</h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {selectedItem.usageHistory.map((usage, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        {usage.type === 'used' ? (
                          <TrendingDown className="text-red-600 ml-2" size={16} />
                        ) : usage.type === 'restocked' ? (
                          <TrendingUp className="text-green-600 ml-2" size={16} />
                        ) : (
                          <RefreshCw className="text-blue-600 ml-2" size={16} />
                        )}
                        <div>
                          <p className="text-sm font-medium">
                            {usage.type === 'used' ? 'استخدام' : 
                             usage.type === 'restocked' ? 'تجديد المخزون' : 'إرجاع'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {usage.date.toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{usage.quantity}</p>
                        {usage.notes && (
                          <p className="text-xs text-gray-500">{usage.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">إجراءات سريعة</h4>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      const quantity = prompt('كمية الاستخدام:');
                      if (quantity && !isNaN(Number(quantity))) {
                        handleStockUpdate(selectedItem.id, Number(quantity), 'used');
                        setSelectedItem({
                          ...selectedItem,
                          currentStock: Math.max(0, selectedItem.currentStock - Number(quantity))
                        });
                      }
                    }}
                    className="bg-red-100 hover:bg-red-200 text-red-700 py-2 px-3 rounded-lg transition-colors text-sm"
                  >
                    استخدام
                  </button>
                  <button
                    onClick={() => {
                      const quantity = prompt('كمية التجديد:');
                      if (quantity && !isNaN(Number(quantity))) {
                        handleStockUpdate(selectedItem.id, Number(quantity), 'restocked');
                        setSelectedItem({
                          ...selectedItem,
                          currentStock: selectedItem.currentStock + Number(quantity)
                        });
                      }
                    }}
                    className="bg-green-100 hover:bg-green-200 text-green-700 py-2 px-3 rounded-lg transition-colors text-sm"
                  >
                    تجديد
                  </button>
                  <button
                    onClick={() => {
                      const quantity = prompt('كمية الإرجاع:');
                      if (quantity && !isNaN(Number(quantity))) {
                        handleStockUpdate(selectedItem.id, Number(quantity), 'returned');
                        setSelectedItem({
                          ...selectedItem,
                          currentStock: selectedItem.currentStock + Number(quantity)
                        });
                      }
                    }}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-3 rounded-lg transition-colors text-sm"
                  >
                    إرجاع
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;