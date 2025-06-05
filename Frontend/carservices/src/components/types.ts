export type FormData = {
    username: string;
    password: string;
    confirmPassword: string;
    phone: string;
    city: string;
    userType: 'customer' | 'workshop' | '';
    businessName?: string;
    address?: string;
    state?: string;
    mapLink?: string;
};

export type Step = 'home' | 'welcome' | 'username' | 'password' | 'phone' | 'city' | 'business-details' | 'success';

// List of cities in Saudi Arabia
export const cities = [
    'الرياض',
    'جدة',
    'مكة المكرمة',
    'المدينة المنورة',
    'الدمام',
    'الخبر',
    'تبوك',
    'أبها',
    'القطيف',
    'الطائف',
    'حائل',
    'نجران',
    'الجبيل',
    'الخرج',
    'ينبع',
    'بريدة',
    'عرعر',
    'سكاكا',
    'جازان',
    'الباحة',
];

// List of states/regions in Saudi Arabia
export const states = [
    'المنطقة الشرقية',
    'منطقة الرياض',
    'منطقة مكة المكرمة',
    'منطقة المدينة المنورة',
    'منطقة القصيم',
    'منطقة حائل',
    'منطقة تبوك',
    'منطقة الحدود الشمالية',
    'منطقة جازان',
    'منطقة نجران',
    'منطقة الباحة',
    'منطقة الجوف',
    'منطقة عسير',
];
