import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  Mail, 
  Phone, 
  Calendar, 
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Settings,
  Key,
  Eye,
  EyeOff,
  Search,
  Filter,
  Download,
  UserPlus,
  X
} from 'lucide-react';

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  role: 'admin' | 'manager' | 'technician' | 'receptionist';
  permissions: string[];
  status: 'active' | 'inactive' | 'suspended';
  hireDate: Date;
  lastLogin?: Date;
  avatar?: string;
  salary: number;
  workingHours: {
    start: string;
    end: string;
    workingDays: string[];
  };
  skills: string[];
  certifications: string[];
}

interface StaffManagementProps {
  onClose: () => void;
}

const StaffManagement: React.FC<StaffManagementProps> = ({ onClose }) => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedStaffForPermissions, setSelectedStaffForPermissions] = useState<StaffMember | null>(null);

  const [newStaff, setNewStaff] = useState<Partial<StaffMember>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    role: 'technician',
    permissions: [],
    status: 'active',
    salary: 0,
    workingHours: {
      start: '08:00',
      end: '17:00',
      workingDays: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday']
    },
    skills: [],
    certifications: []
  });

  const roles = [
    { key: 'admin', label: 'مدير النظام', color: 'bg-red-100 text-red-800' },
    { key: 'manager', label: 'مدير الورشة', color: 'bg-blue-100 text-blue-800' },
    { key: 'technician', label: 'فني', color: 'bg-green-100 text-green-800' },
    { key: 'receptionist', label: 'موظف استقبال', color: 'bg-purple-100 text-purple-800' }
  ];

  const departments = [
    'الإدارة',
    'الفنيين',
    'خدمة العملاء',
    'المبيعات',
    'المحاسبة'
  ];

  const availablePermissions = [
    { key: 'view_bookings', label: 'عرض الحجوزات' },
    { key: 'manage_bookings', label: 'إدارة الحجوزات' },
    { key: 'view_customers', label: 'عرض العملاء' },
    { key: 'manage_customers', label: 'إدارة العملاء' },
    { key: 'view_inventory', label: 'عرض المخزون' },
    { key: 'manage_inventory', label: 'إدارة المخزون' },
    { key: 'view_reports', label: 'عرض التقارير' },
    { key: 'manage_staff', label: 'إدارة الموظفين' },
    { key: 'view_finances', label: 'عرض المالية' },
    { key: 'manage_finances', label: 'إدارة المالية' }
  ];

  const workingDays = [
    { key: 'sunday', label: 'الأحد' },
    { key: 'monday', label: 'الاثنين' },
    { key: 'tuesday', label: 'الثلاثاء' },
    { key: 'wednesday', label: 'الأربعاء' },
    { key: 'thursday', label: 'الخميس' },
    { key: 'friday', label: 'الجمعة' },
    { key: 'saturday', label: 'السبت' }
  ];

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      const mockStaff: StaffMember[] = [
        {
          id: '1',
          firstName: 'أحمد',
          lastName: 'محمد',
          email: 'ahmed@workshop.com',
          phone: '0501234567',
          position: 'مدير الورشة',
          department: 'الإدارة',
          role: 'manager',
          permissions: ['view_bookings', 'manage_bookings', 'view_customers', 'manage_customers', 'view_reports'],
          status: 'active',
          hireDate: new Date('2022-01-15'),
          lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
          salary: 8000,
          workingHours: {
            start: '08:00',
            end: '17:00',
            workingDays: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday']
          },
          skills: ['إدارة الفريق', 'خدمة العملاء', 'التخطيط'],
          certifications: ['شهادة إدارة الورش']
        },
        {
          id: '2',
          firstName: 'خالد',
          lastName: 'السعد',
          email: 'khalid@workshop.com',
          phone: '0507654321',
          position: 'فني أول',
          department: 'الفنيين',
          role: 'technician',
          permissions: ['view_bookings', 'manage_bookings', 'view_inventory'],
          status: 'active',
          hireDate: new Date('2021-06-10'),
          lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000),
          salary: 5500,
          workingHours: {
            start: '07:00',
            end: '16:00',
            workingDays: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday']
          },
          skills: ['إصلاح المحركات', 'كهرباء السيارات', 'تشخيص الأعطال'],
          certifications: ['شهادة فني سيارات معتمد', 'شهادة كهرباء السيارات']
        },
        {
          id: '3',
          firstName: 'فاطمة',
          lastName: 'علي',
          email: 'fatima@workshop.com',
          phone: '0509876543',
          position: 'موظفة استقبال',
          department: 'خدمة العملاء',
          role: 'receptionist',
          permissions: ['view_bookings', 'view_customers'],
          status: 'active',
          hireDate: new Date('2023-03-20'),
          lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000),
          salary: 4000,
          workingHours: {
            start: '08:00',
            end: '17:00',
            workingDays: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday']
          },
          skills: ['خدمة العملاء', 'إدارة المواعيد', 'التواصل'],
          certifications: ['شهادة خدمة العملاء']
        },
        {
          id: '4',
          firstName: 'محمد',
          lastName: 'أحمد',
          email: 'mohammed@workshop.com',
          phone: '0502468135',
          position: 'فني متدرب',
          department: 'الفنيين',
          role: 'technician',
          permissions: ['view_bookings'],
          status: 'inactive',
          hireDate: new Date('2023-08-01'),
          salary: 3500,
          workingHours: {
            start: '08:00',
            end: '17:00',
            workingDays: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday']
          },
          skills: ['صيانة أساسية', 'تغيير الزيت'],
          certifications: []
        }
      ];

      setStaff(mockStaff);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddStaff = () => {
    const staffMember: StaffMember = {
      id: Date.now().toString(),
      firstName: newStaff.firstName!,
      lastName: newStaff.lastName!,
      email: newStaff.email!,
      phone: newStaff.phone!,
      position: newStaff.position!,
      department: newStaff.department!,
      role: newStaff.role!,
      permissions: newStaff.permissions!,
      status: newStaff.status!,
      hireDate: new Date(),
      salary: newStaff.salary!,
      workingHours: newStaff.workingHours!,
      skills: newStaff.skills!,
      certifications: newStaff.certifications!
    };

    setStaff([...staff, staffMember]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditStaff = (member: StaffMember) => {
    setEditingStaff(member);
    setNewStaff(member);
    setShowAddModal(true);
  };

  const handleUpdateStaff = () => {
    if (!editingStaff) return;

    setStaff(staff.map(member => 
      member.id === editingStaff.id ? { ...member, ...newStaff } : member
    ));
    setShowAddModal(false);
    setEditingStaff(null);
    resetForm();
  };

  const handleDeleteStaff = (staffId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
      setStaff(staff.filter(member => member.id !== staffId));
    }
  };

  const handleStatusChange = (staffId: string, newStatus: StaffMember['status']) => {
    setStaff(staff.map(member => 
      member.id === staffId ? { ...member, status: newStatus } : member
    ));
  };

  const resetForm = () => {
    setNewStaff({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      role: 'technician',
      permissions: [],
      status: 'active',
      salary: 0,
      workingHours: {
        start: '08:00',
        end: '17:00',
        workingDays: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday']
      },
      skills: [],
      certifications: []
    });
  };

  const getStatusColor = (status: StaffMember['status']) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'suspended': return 'text-red-600 bg-red-100';
    }
  };

  const getStatusText = (status: StaffMember['status']) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'suspended': return 'موقوف';
    }
  };

  const getRoleInfo = (role: string) => {
    return roles.find(r => r.key === role) || { label: role, color: 'bg-gray-100 text-gray-800' };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات الموظفين...</p>
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
              <Users className="text-blue-600 ml-3" size={24} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">إدارة الموظفين</h1>
                <p className="text-gray-600">إدارة فريق العمل والصلاحيات</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="ml-2" size={16} />
                إضافة موظف
              </button>
              <button className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors">
                <Download className="ml-2" size={16} />
                تصدير
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="البحث عن موظف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                dir="rtl"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              dir="rtl"
            >
              <option value="all">جميع الأدوار</option>
              {roles.map(role => (
                <option key={role.key} value={role.key}>{role.label}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              dir="rtl"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
              <option value="suspended">موقوف</option>
            </select>
            <button
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('all');
                setStatusFilter('all');
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              إعادة تعيين
            </button>
          </div>
        </div>

        {/* Staff List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الموظف
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المنصب
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الدور
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    آخر دخول
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStaff.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center ml-3">
                          <User className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {member.firstName} {member.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.position}</div>
                      <div className="text-sm text-gray-500">{member.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleInfo(member.role).color}`}>
                        {getRoleInfo(member.role).label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(member.status)}`}>
                        {getStatusText(member.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.lastLogin ? (
                        <div>
                          <div>{member.lastLogin.toLocaleDateString('ar-SA')}</div>
                          <div className="text-xs">{member.lastLogin.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      ) : (
                        'لم يسجل دخول'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditStaff(member)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStaffForPermissions(member);
                            setShowPermissionsModal(true);
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Shield size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(member.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                        
                        {member.status === 'active' ? (
                          <button
                            onClick={() => handleStatusChange(member.id, 'inactive')}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <XCircle size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(member.id, 'active')}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">
                {editingStaff ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingStaff(null);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">المعلومات الشخصية</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الأول</label>
                  <input
                    type="text"
                    value={newStaff.firstName}
                    onChange={(e) => setNewStaff({ ...newStaff, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الأخير</label>
                  <input
                    type="text"
                    value={newStaff.lastName}
                    onChange={(e) => setNewStaff({ ...newStaff, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                  <input
                    type="tel"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Job Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">معلومات الوظيفة</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المنصب</label>
                  <input
                    type="text"
                    value={newStaff.position}
                    onChange={(e) => setNewStaff({ ...newStaff, position: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">القسم</label>
                  <select
                    value={newStaff.department}
                    onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    dir="rtl"
                  >
                    <option value="">اختر القسم</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الدور</label>
                  <select
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    dir="rtl"
                  >
                    {roles.map(role => (
                      <option key={role.key} value={role.key}>{role.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الراتب (ر.س)</label>
                  <input
                    type="number"
                    value={newStaff.salary}
                    onChange={(e) => setNewStaff({ ...newStaff, salary: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 border-b pb-2 mb-4">ساعات العمل</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">من الساعة</label>
                  <input
                    type="time"
                    value={newStaff.workingHours?.start}
                    onChange={(e) => setNewStaff({
                      ...newStaff,
                      workingHours: { ...newStaff.workingHours!, start: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">إلى الساعة</label>
                  <input
                    type="time"
                    value={newStaff.workingHours?.end}
                    onChange={(e) => setNewStaff({
                      ...newStaff,
                      workingHours: { ...newStaff.workingHours!, end: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">أيام العمل</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {workingDays.map(day => (
                    <label key={day.key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newStaff.workingHours?.workingDays.includes(day.key)}
                        onChange={(e) => {
                          const days = e.target.checked 
                            ? [...(newStaff.workingHours?.workingDays || []), day.key]
                            : (newStaff.workingHours?.workingDays || []).filter(d => d !== day.key);
                          setNewStaff({
                            ...newStaff,
                            workingHours: { ...newStaff.workingHours!, workingDays: days }
                          });
                        }}
                        className="ml-2"
                      />
                      <span className="text-sm">{day.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingStaff(null);
                  resetForm();
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={editingStaff ? handleUpdateStaff : handleAddStaff}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                {editingStaff ? 'تحديث' : 'إضافة'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && selectedStaffForPermissions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">إدارة الصلاحيات</h3>
              <button
                onClick={() => {
                  setShowPermissionsModal(false);
                  setSelectedStaffForPermissions(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-600">
                صلاحيات: {selectedStaffForPermissions.firstName} {selectedStaffForPermissions.lastName}
              </p>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {availablePermissions.map(permission => (
                <label key={permission.key} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedStaffForPermissions.permissions.includes(permission.key)}
                    onChange={(e) => {
                      const permissions = e.target.checked 
                        ? [...selectedStaffForPermissions.permissions, permission.key]
                        : selectedStaffForPermissions.permissions.filter(p => p !== permission.key);
                      
                      setSelectedStaffForPermissions({
                        ...selectedStaffForPermissions,
                        permissions
                      });
                      
                      setStaff(staff.map(member => 
                        member.id === selectedStaffForPermissions.id 
                          ? { ...member, permissions }
                          : member
                      ));
                    }}
                    className="ml-3"
                  />
                  <span className="text-sm">{permission.label}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowPermissionsModal(false);
                  setSelectedStaffForPermissions(null);
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;