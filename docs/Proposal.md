

## ✅ Backend Development Proposal

**Project Name:** Car Services Web Platform  
**Developer:** Mohamed Aboellil (Backend Developer)  
**Technologies:**

> primary stack (alternative): `Node.js + TypeScript + MongoDB` _(for flexibility and modern JavaScript ecosystem)_

---

## 🧾 Scope of Work (MVP)

### 🔧 Core Features:

1. **Authentication & Authorization**
    
    - Roles: Admin, Technical, Registered User, Guest (for emergencies)
		
	- Email Verification, reset password
		
    - JWT-based secure APIs
        
2. **Service Booking System**
	
	- Services with category 
		
    - Book services with/without registration
        
    - Tracking service and progress tracking 
        
3. **Admin Panel (API-level)**
	
	 - Real time for any activities from user
		
    - Manage users, bookings, technicians, service types
        
    - Approve/Reject bookings needing permissions
        
    - Admin interface endpoints for sending custom notifications.
        
    - Analytics dashboard (number of repairs per user, technician performance)
        
4. **Notifications System (Even when App is Off)**
    
    - Real-time via Soket.io
        
    - Background push notifications (using Firebase or OneSignal) ******
        
5. **Activity send to admin**
    
    - Log service status changes, notification sends, and technician actions 
        

---

## 🧠 Optional Features

| Feature                 | Description                                                                                    |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| Analytics dashboard     | Detailed analytics for services, locations, number of repairs per user, technician performance |
| Reports                 | report all things in something like excel sheet                                                |
| Technician GPS Tracking | Save real-time technician location like whatsapp live location                                 |
| Multi-Language Support  | Arabic (default) + English                                                                     |
| Service Subscription    | users can subscribe to regular maintenance packages                                            |
| Advanced login Features | - login with google<br>- login with phone and OTP get in whatsapp (like carviseta)             |
| Scheduling              | scheduling system                                                                              |

---

## ✅ **عرض مشروع لتطوير منصة خدمات السيارات**

**اسم المشروع:** منصة إلكترونية لخدمات السيارات  
**المطوّر:** محمد أبو الليل – مطوّر خلفي (Back-end)  
**التقنيات:** سيتم استخدام تقنيات حديثة لتقديم تجربة سلسة وآمنة (مثل: Node.js و TypeScript و MongoDB) 

---

## 🧾 **نطاق العمل (المرحلة الأولى)**

### 🔧 **الوظائف الأساسية في الموقع:**

1. **تسجيل الدخول والصلاحيات**
    
    - سيكون هناك أنواع مختلفة من المستخدمين:
        
        - **مدير النظام (Admin)**: يتحكم في كل شيء.
            
        - **الفني (Technician)**: الشخص الذي يقوم بالخدمة.
            
        - **المستخدم العادي**: العميل الذي يطلب الخدمة.
            
        - **زائر (Guest)**: يمكنه طلب خدمة طارئة بدون تسجيل.
            
    - يتم التأكد من هوية كل مستخدم لحماية بيانات الجميع. 
	    
    - يتم التاكيد علي هوية المستخدم عن طريق ارسال رسالة علي الايميل بها كود التاكيد
	    
    - يوجد اعادة تعيين لل password اذا المستخدم نساه 
        
2. **نظام حجز الخدمات**
    
    - يمكن للعميل اختيار نوع الخدمة المطلوبة (مثل تغيير زيت، إصلاح أعطال...)
        
    - يمكنه الحجز سواء كان مسجلاً أو لا.
        
    - يمكنه تتبع حالة طلبه، مثل "جارٍ التنفيذ" أو "تم الانتهاء".
        
3. **لوحة تحكم للإدارة (عبر واجهات برمجية)**
    
    - تظهر كل الأنشطة لحظة بلحظة.
        
    - يمكن للإدارة:
        
        - التحكم في الفنيين والخدمات.
            
        - الموافقة أو رفض الطلبات التي تحتاج إذن.
            
        - إرسال تنبيهات للمستخدمين.
            
        - رؤية تقارير مثل: من أكثر فني أنجز طلبات، عدد الإصلاحات...
            
4. **نظام تنبيهات متطور**
    
    - عند حدوث أي جديد، يظهر إشعار للمستخدم مباشرة في الوقت الحقيقي.
        
    - حتى إذا كان التطبيق غير مفتوح، يصله إشعار على الهاتف (مثل إشعارات واتساب).
        
5. **إرسال النشاطات إلى الإدارة**
    
    - يتم تسجيل كل التغييرات التي تحدث في حالة الطلب، والإشعارات المرسلة، وتحركات الفني.
        

---

## 🧠 **مميزات إضافية**  

| الميزة              | الشرح                                                                                                 |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| لوحة تقارير متقدمة  | توضح الأداء، عدد الإصلاحات، أماكن الطلبات، وأكثر الفنيين نشاطًا.                                      |
| تقارير شاملة        | مثل تقارير الأرباح، أو عدد الطلبات شهريًا مقدمة في شييت excel                                         |
| تتبع GPS للفنيين    | مثل مشاركة الموقع المباشر في واتساب، لرؤية مكان الفني.                                                |
| دعم عدة لغات        | الموقع سيكون باللغة العربية (أساسيًا) مع إمكانية التحويل للإنجليزية.                                  |
| الاشتراك في الصيانة | يمكن للمستخدم الاشتراك في باقات صيانة دورية.                                                          |
| طرق دخول متقدمة     | يمكن الدخول عبر Google أو باستخدام رقم الهاتف وكود OTP يكون عنطريق ال whatsapp (مثل تطبيق CarViseta). |
| نظام المواعيد       | تحديد مواعيد مسبقة لحجز الخدمة.                                                                       |
