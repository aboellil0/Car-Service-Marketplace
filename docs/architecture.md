# Car Services Platform - Models & API Endpoints

## 📊 Database Models (JSON Structure)

### 1. Users Model

```json
{
  "_id": "ObjectId",
  "email": "string (unique, required)",
  "phone": "string (unique, required)",
  "password": "string (hashed, required)",
  "role": "enum ['GUEST', 'USER', 'TECHNICIAN', 'ADMIN'] (default: USER)",
  "profile": {
    "firstName": "string (required)",
    "lastName": "string (required)",
    "avatar": "string (url, optional)",
    "dateOfBirth": "date (optional)",
    "gender": "enum ['male', 'female'] (optional)",
    "address": {
      "street": "string",
      "city": "string",
      "governorate": "string",
    },
    "preferredLanguage": "string (default: 'ar')"
  },
  "carInfo": {
    "brand": "string",
    "model": "string",
    "year": "number",
  },
  "preferences": {
    "notificationsEnabled": "boolean (default: true)",
    "smsNotifications": "boolean (default: true)",
    "emailNotifications": "boolean (default: true)",
    "pushNotifications": "boolean (default: true)"
  },
  "isActive": "boolean (default: true)",
  "isVerified": "boolean (default: false)",
  "lastLogin": "date",
  "createdAt": "date (auto)",
  "updatedAt": "date (auto)"
}
```

### 2. Services Model

```json
{
  "_id": "ObjectId",
  "nameAr": "string (required)",
  "nameEn": "string (required)",
  "descriptionAr": "string (required)",
  "descriptionEn": "string (required)",
  "category": "enum ['mobile_workshop', 'emergency', 'regular_maintenance', 'periodic_maintenance'] (required)",
  "subCategory": "string (optional)",
  "duration": "number",
  "availability": {
    "isActive": "boolean (default: true)",
    "workingHours": {
      "start": "string (HH:mm)",
      "end": "string (HH:mm)"
    },
    "workingDays": "array ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']",
    "emergencyAvailable": "boolean (default: false)"
  },
  "requirements": {
    "requiresApproval": "boolean (default: false)",
    "adminApprovalOnly": "boolean (default: false)"
  },
  "media": {
    "images": "array of strings (urls)",
    "icon": "string (url)"
  },
  "tags": "array of strings",
  "isPopular": "boolean (default: false)",
  "sortOrder": "number (default: 0)",
  "createdAt": "date (auto)",
  "updatedAt": "date (auto)"
}
```

### 3. Bookings Model

```json
{
  "_id": "ObjectId",
  "bookingNumber": "string (unique, auto-generated)",
  "userId": "ObjectId (ref: Users, required)",
  "serviceId": "ObjectId (ref: Services, required)",
  "status": "enum ['pending_approval', 'approved', 'on_way', 'in_progress', 'completed', 'cancelled', 'rejected'] (default: pending_approval)",
  "scheduledDateTime": "date (required)",
  "location": {
    "address": "string (required)",
    "city": "string (required)",
    "governorate": "string (required)",
    "locationNotes": "string (optional)",
  },
  "customerInfo": {
    "customerName": "string (required)",
    "phoneNumber": "string (required)",
    "carDetails": {
      "brand": "string",
      "model": "string",
      "year": "number",
    }
  },
  "serviceDetails": {
    "problemDescription": "string (required)",
    "images": "array of strings (urls)",
  },
    "discount": {
      "amount": "number (default: 0)",
      "reason": "string"
  },
  "tracking": {
    "currentStatus": "string",
    "statusHistory": [
      {
        "status": "string",
        "timestamp": "date",
      }
    ],
    "technicianLocation": "string",
    "estimatedArrival": "date"
  },
  "feedback": {
    "rating": "number (1-5)",
    "comment": "string",
    "submittedAt": "date"
  },
  "adminNotes": "string (optional)",
  "cancellationReason": "string (optional)",
  "isEmergency": "boolean (default: false)",
  "createdAt": "date (auto)",
  "updatedAt": "date (auto)"
}
```

### 4. Notifications Model

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: Users, required)",
  "type": "enum ['booking_status', 'payment', 'promotion', 'system', 'emergency'] (required)",
  "titleAr": "string (required)",
  "titleEn": "string (required)",
  "messageAr": "string (required)",
  "messageEn": "string (required)",
  "createdAt": "date (auto)"
}
```


### 5. Reviews Model

```json
{
  "_id": "ObjectId",
  "bookingId": "ObjectId (ref: Bookings, required, unique)",
  "userId": "ObjectId (ref: Users, required)",
  "serviceId": "ObjectId (ref: Services, required)",
  "ratings": "number (1-5, required)",
  "review": "string (required)",
  "createdAt": "date (auto)",
  "updatedAt": "date (auto)"
}
```


### 7. Service Progress Tracking Model

```json
{
  "_id": "ObjectId",
  "bookingId": "ObjectId (ref: Bookings, required, unique)",
  "userId": "ObjectId (ref: Users, required)",
  "serviceId": "ObjectId (ref: Services, required)",
	  "currentStage": "enum ['submitted', 'under_review', 'approved', 'technician_assigned', 'technician_notified', 'on_way', 'arrived', 'diagnosis', 'parts_needed', 'work_in_progress', 'quality_check', 'completed', 'cancelled', 'rejected'] (required)",
  "stages": [
    {
      "stage": "string (required)",
      "status": "enum ['pending', 'in_progress', 'completed', 'skipped', 'failed'] (required)",
      "startedAt": "date (optional)",
      "completedAt": "date (optional)",
      "notes": "string (optional)",
      "images": "array of strings (urls, optional)",
      "updatedBy": "ObjectId (ref: Users, required)",
      "estimatedDuration": "number (minutes, optional)",
      "actualDuration": "number (minutes, optional)",
      "requiresApproval": "boolean (default: false)",
      "approvedBy": "ObjectId (ref: Users, optional)",
      "approvedAt": "date (optional)"
    }
  ],
  "milestones": [
    {
      "name": "string (required)",
      "description": "string (optional)",
      "targetDate": "date (optional)",
      "completedDate": "date (optional)",
      "isCompleted": "boolean (default: false)",
      "priority": "enum ['low', 'medium', 'high', 'critical'] (default: medium)"
    }
  ],
  "blockers": [
    {
      "type": "enum ['parts_unavailable', 'weather', 'customer_unavailable', 'technical_issue', 'approval_pending', 'other'] (required)",
      "description": "string (required)",
      "reportedAt": "date (required)",
      "reportedBy": "ObjectId (ref: Users, required)",
      "resolvedAt": "date (optional)",
      "resolvedBy": "ObjectId (ref: Users, optional)",
      "impact": "enum ['low', 'medium', 'high', 'critical'] (default: medium)",
      "isResolved": "boolean (default: false)"
    }
  ],
  "qualityChecks": [
    {
      "checkType": "enum ['initial_diagnosis', 'pre_work', 'during_work', 'final_inspection', 'customer_approval'] (required)",
      "checkedBy": "ObjectId (ref: Users, required)",
      "checkedAt": "date (required)",
      "status": "enum ['passed', 'failed', 'needs_attention'] (required)",
      "notes": "string (optional)",
      "images": "array of strings (urls, optional)",
      "criteria": [
        {
          "item": "string (required)",
          "status": "enum ['ok', 'issue', 'critical'] (required)",
          "notes": "string (optional)"
        }
      ]
    }
  ],
  "customerInteractions": [
    {
      "type": "enum ['call', 'sms', 'in_person', 'app_notification'] (required)",
      "initiatedBy": "ObjectId (ref: Users, required)",
      "timestamp": "date (required)",
      "content": "string (required)",
      "response": "string (optional)",
      "responseTime": "number (minutes, optional)",
      "satisfaction": "number (1-5, optional)"
    }
  ],
  "realTimeData": {
    "technicianLocation": {
      "latitude": "number",
      "longitude": "number",
      "accuracy": "number (meters)",
      "lastUpdated": "date",
      "isSharing": "boolean (default: false)"
    },
    "estimatedArrival": "date",
    "estimatedCompletion": "date",
    "isLive": "boolean (default: false)",
    "lastHeartbeat": "date"
  },
  "metadata": {
    "totalStages": "number (required)",
    "completedStages": "number (default: 0)",
    "averageStageTime": "number (minutes, default: 0)",
    "delayedStages": "number (default: 0)",
    "onTimeCompletion": "boolean",
    "lastUpdated": "date (auto)",
    "updatedBy": "ObjectId (ref: Users)"
  },
  "createdAt": "date (auto)",
  "updatedAt": "date (auto)"
}
```

### 8. User Statistics & Analytics Model

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: Users, required, unique)",
  "role": "enum ['USER', 'TECHNICIAN', 'ADMIN'] (required)",
  "statistics": {
    "bookings": {
      "total": "number (default: 0)",
      "completed": "number (default: 0)",
      "cancelled": "number (default: 0)",
      "pending": "number (default: 0)",
      "emergency": "number (default: 0)",
      "repeatBookings": "number (default: 0)"
    },
    "services": {
      "totalServicesUsed": "number (default: 0)",
      "favoriteService": "ObjectId (ref: Services, optional)",
      "mostUsedCategory": "string (optional)",
      "servicesBreakdown": [
        {
          "serviceId": "ObjectId (ref: Services)",
          "serviceName": "string",
          "count": "number",
          "lastUsed": "date"
        }
      ]
    },
    "financial": {
      "totalSpent": "number (default: 0)",
      "averageBookingValue": "number (default: 0)",
      "currency": "string (default: 'EGP')",
      "paymentMethods": [
        {
          "method": "string",
          "count": "number",
          "totalAmount": "number"
        }
      ],
      "discountsReceived": "number (default: 0)",
      "loyaltyPoints": "number (default: 0)"
    },
    "technician": {
      "servicesCompleted": "number (default: 0)",
      "averageRating": "number (default: 0)",
      "totalRatings": "number (default: 0)",
      "specializations": "array of strings",
      "workingHours": "number (default: 0)",
      "responseTime": {
        "average": "number (minutes, default: 0)",
        "fastest": "number (minutes, optional)",
        "slowest": "number (minutes, optional)"
      },
      "completionRate": "number (percentage, default: 0)",
      "customerSatisfaction": "number (percentage, default: 0)",
      "earnings": {
        "total": "number (default: 0)",
        "thisMonth": "number (default: 0)",
        "lastMonth": "number (default: 0)",
        "currency": "string (default: 'EGP')"
      },
      "workingAreas": "array of strings",
      "emergencyServices": "number (default: 0)"
    }
  },
  "achievements": [
    {
      "type": "enum ['bookings_milestone', 'loyalty', 'rating', 'spending', 'technician_performance', 'emergency_response', 'customer_satisfaction', 'revenue'] (required)",
      "name": "string (required)",
      "description": "string (required)",
      "icon": "string (url, optional)",
      "requirement": "object (required)",
      "currentProgress": "number (default: 0)",
      "targetValue": "number (required)",
      "isCompleted": "boolean (default: false)",
      "completedAt": "date (optional)",
      "reward": {
        "type": "enum ['badge', 'discount', 'points', 'cash', 'recognition']",
        "value": "mixed",
        "description": "string"
      }
    }
  ],
  "milestones": {
    "registration": {
      "date": "date",
      "isCompleted": "boolean (default: true)"
    },
    "firstBooking": {
      "date": "date (optional)",
      "isCompleted": "boolean (default: false)"
    },
    "bookingMilestones": [
      {
        "milestone": "number (e.g., 5, 10, 25, 50, 100, 500, 1000, 5000)",
        "achievedAt": "date (optional)",
        "isCompleted": "boolean (default: false)",
        "reward": "string (optional)"
      }
    ],
    "loyaltyLevel": {
      "current": "enum ['bronze', 'silver', 'gold', 'platinum', 'diamond'] (default: bronze)",
      "points": "number (default: 0)",
      "nextLevelRequirement": "number",
      "benefits": "array of strings"
    }
  },
  "behavior": {
    "averageBookingFrequency": "number (days)",
    "preferredTimeSlots": "array of strings",
    "preferredDays": "array of strings",
    "preferredLocations": "array of strings",
    "cancellationRate": "number (percentage, default: 0)",
    "noShowRate": "number (percentage, default: 0)",
    "responseTime": "number (minutes, average time to respond)",
    "appUsage": {
      "totalSessions": "number (default: 0)",
      "averageSessionDuration": "number (minutes, default: 0)",
      "lastActiveAt": "date",
      "featuresUsed": "array of strings"
    }
  },
  "preferences": {
    "preferredTechnicians": "array of ObjectIds (ref: Users)",
    "blacklistedTechnicians": "array of ObjectIds (ref: Users)",
    "preferredServiceCategories": "array of strings",
    "communicationPreference": "enum ['calls', 'sms', 'app', 'email'] (default: app)",
    "serviceReminders": "boolean (default: true)",
    "marketingConsent": "boolean (default: false)"
  },
  "trends": {
    "monthlyBookings": [
      {
        "month": "string (YYYY-MM)",
        "count": "number",
        "spending": "number"
      }
    ],
    "seasonalPatterns": [
      {
        "season": "enum ['spring', 'summer', 'autumn', 'winter']",
        "bookingCount": "number",
        "preferredServices": "array of strings"
      }
    ],
    "growthMetrics": {
      "bookingGrowthRate": "number (percentage)",
      "spendingGrowthRate": "number (percentage)",
      "engagementScore": "number (0-100)"
    }
  },
  "alerts": [
    {
      "type": "enum ['milestone_approaching', 'achievement_unlocked', 'loyalty_upgrade', 'unusual_activity', 'inactivity', 'high_value_customer']",
      "message": "string",
      "isActive": "boolean (default: true)",
      "createdAt": "date",
      "triggeredAt": "date (optional)",
      "priority": "enum ['low', 'medium', 'high'] (default: medium)"
    }
  ],
  "lastCalculated": "date (auto)",
  "calculationVersion": "string (default: '1.0')",
  "createdAt": "date (auto)",
  "updatedAt": "date (auto)"
}
```


---

## 🔗 API Endpoints

### 🔐 Authentication Endpoints

#### POST `/api/auth/register`

**Description:** Register new user  
**Access:** Public  
**Body:**

```json
{
  "email": "string (required)",
  "phone": "string (required)",
  "password": "string (required)",
  "firstName": "string (required)",
  "lastName": "string (required)",
  "role": "string (optional, default: USER)"
}
```

**Response:** `{ user, token, refreshToken }`

#### POST `/api/auth/login`

**Description:** User login  
**Access:** Public  
**Body:**

```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response:** `{ user, token, refreshToken }`

#### POST `/api/auth/refresh-token`

**Description:** Refresh access token  
**Access:** Public  
**Body:** `{ refreshToken }`  
**Response:** `{ token, refreshToken }`

#### POST `/api/auth/forgot-password`

**Description:** Request password reset  
**Access:** Public  
**Body:** `{ email }`  
**Response:** `{ message }`

#### POST `/api/auth/reset-password`

**Description:** Reset password with token  
**Access:** Public  
**Body:** `{ token, newPassword }`  
**Response:** `{ message }`

#### POST `/api/auth/verify-phone`

**Description:** Verify phone number with OTP  
**Access:** Authenticated  
**Body:** `{ phone, otp }`  
**Response:** `{ message }`

#### POST `/api/auth/logout`

**Description:** User logout  
**Access:** Authenticated  
**Response:** `{ message }`

---

### 👤 User Management Endpoints

#### GET `/api/users/profile`

**Description:** Get current user profile  
**Access:** Authenticated  
**Response:** `{ user }`

#### PUT `/api/users/profile`

**Description:** Update user profile  
**Access:** Authenticated  
**Body:** `{ firstName, lastName, address, carInfo, preferences }`  
**Response:** `{ user }`

#### POST `/api/users/upload-avatar`

**Description:** Upload user avatar  
**Access:** Authenticated  
**Body:** FormData with image file  
**Response:** `{ avatarUrl }`

#### GET `/api/users`

**Description:** Get all users (admin/technician only)  
**Access:** Admin, Technician  
**Query:** `?page=1&limit=10&role=USER&search=query`  
**Response:** `{ users, total, page, totalPages }`

#### GET `/api/users/:id`

**Description:** Get user by ID  
**Access:** Admin, Technician  
**Response:** `{ user }`

#### PUT `/api/users/:id/role`

**Description:** Update user role  
**Access:** Admin only  
**Body:** `{ role }`  
**Response:** `{ user }`

#### DELETE `/api/users/:id`

**Description:** Delete user account  
**Access:** Admin only  
**Response:** `{ message }`

---

### 🔧 Services Management Endpoints

#### GET `/api/services`

**Description:** Get all active services  
**Access:** Public  
**Query:** `?category=mobile_workshop&isPopular=true&search=query`  
**Response:** `{ services }`

#### GET `/api/services/emergency`

**Description:** Get emergency services only  
**Access:** Public (Guest accessible)  
**Response:** `{ services }`

#### GET `/api/services/:id`

**Description:** Get service details  
**Access:** Public  
**Response:** `{ service }`

#### POST `/api/services`

**Description:** Create new service  
**Access:** Admin only  
**Body:** Service object  
**Response:** `{ service }`

#### PUT `/api/services/:id`

**Description:** Update service  
**Access:** Admin only  
**Body:** Service fields to update  
**Response:** `{ service }`

#### DELETE `/api/services/:id`

**Description:** Delete service  
**Access:** Admin only  
**Response:** `{ message }`

#### GET `/api/services/categories`

**Description:** Get service categories  
**Access:** Public  
**Response:** `{ categories }`

---

### 📅 Booking Management Endpoints

#### POST `/api/bookings`

**Description:** Create new booking  
**Access:** Authenticated, Guest (emergency only)  
**Body:**

```json
{
  "serviceId": "ObjectId (required)",
  "scheduledDateTime": "date (required)",
  "location": "object (required)",
  "customerInfo": "object (required)",
  "serviceDetails": "object (required)",
  "isEmergency": "boolean (optional)"
}
```

**Response:** `{ booking }`

#### POST `/api/bookings/emergency`

**Description:** Create emergency booking (guest access)  
**Access:** Public  
**Body:** Emergency booking object  
**Response:** `{ booking, guestToken }`

#### GET `/api/bookings`

**Description:** Get bookings (role-based access)  
**Access:** Authenticated  
**Query:** `?status=pending&page=1&limit=10&userId=id`  
**Response:** `{ bookings, total, page, totalPages }`

#### GET `/api/bookings/my`

**Description:** Get current user's bookings  
**Access:** Authenticated  
**Query:** `?status=completed&page=1&limit=10`  
**Response:** `{ bookings, total, page, totalPages }`

#### GET `/api/bookings/:id`

**Description:** Get booking details  
**Access:** Authenticated (owner, admin, assigned technician)  
**Response:** `{ booking }`

#### PUT `/api/bookings/:id/status`

**Description:** Update booking status  
**Access:** Admin, Assigned Technician  
**Body:** `{ status, notes }`  
**Response:** `{ booking }`

#### PUT `/api/bookings/:id/assign-technician`

**Description:** Assign technician to booking  
**Access:** Admin only  
**Body:** `{ technicianId }`  
**Response:** `{ booking }`

#### PUT `/api/bookings/:id/approve`

**Description:** Approve booking  
**Access:** Admin only  
**Body:** `{ approved, notes }`  
**Response:** `{ booking }`

#### PUT `/api/bookings/:id/cancel`

**Description:** Cancel booking  
**Access:** Authenticated (owner, admin)  
**Body:** `{ reason }`  
**Response:** `{ booking }`

#### GET `/api/bookings/:id/tracking`

**Description:** Get real-time booking tracking  
**Access:** Authenticated (owner, admin, assigned technician)  
**Response:** `{ tracking }`

#### PUT `/api/bookings/:id/location`

**Description:** Update technician location  
**Access:** Assigned Technician only  
**Body:** `{ latitude, longitude }`  
**Response:** `{ message }`

---

### 👨‍🔧 Technician Management Endpoints

#### GET `/api/technicians`

**Description:** Get all technicians  
**Access:** Admin only  
**Query:** `?status=available&specialization=engine&city=cairo`  
**Response:** `{ technicians }`

#### GET `/api/technicians/available`

**Description:** Get available technicians for booking  
**Access:** Admin only  
**Query:** `?serviceId=id&location=lat,lng&distance=50`  
**Response:** `{ technicians }`

#### GET `/api/technicians/:id`

**Description:** Get technician profile  
**Access:** Admin, Self  
**Response:** `{ technician }`

#### POST `/api/technicians`

**Description:** Create technician profile  
**Access:** Admin only  
**Body:** Technician object  
**Response:** `{ technician }`

#### PUT `/api/technicians/:id`

**Description:** Update technician profile  
**Access:** Admin, Self  
**Body:** Technician fields to update  
**Response:** `{ technician }`

#### PUT `/api/technicians/status`

**Description:** Update technician work status  
**Access:** Technician only  
**Body:** `{ status, location }`  
**Response:** `{ message }`

#### GET `/api/technicians/:id/bookings`

**Description:** Get technician's bookings  
**Access:** Admin, Self  
**Query:** `?status=in_progress&page=1&limit=10`  
**Response:** `{ bookings }`

#### GET `/api/technicians/:id/performance`

**Description:** Get technician performance metrics  
**Access:** Admin, Self  
**Response:** `{ performance }`

---

### 🔔 Notification Endpoints

#### GET `/api/notifications`

**Description:** Get user notifications  
**Access:** Authenticated  
**Query:** `?isRead=false&type=booking_status&page=1&limit=20`  
**Response:** `{ notifications, total, unreadCount }`

#### PUT `/api/notifications/:id/read`

**Description:** Mark notification as read  
**Access:** Authenticated (owner)  
**Response:** `{ message }`

#### PUT `/api/notifications/read-all`

**Description:** Mark all notifications as read  
**Access:** Authenticated  
**Response:** `{ message }`

#### DELETE `/api/notifications/:id`

**Description:** Delete notification  
**Access:** Authenticated (owner)  
**Response:** `{ message }`

#### POST `/api/notifications/send`

**Description:** Send notification (admin only)  
**Access:** Admin only  
**Body:**

```json
{
  "userId": "ObjectId (optional, if not provided sends to all)",
  "type": "string (required)",
  "titleAr": "string (required)",
  "messageAr": "string (required)",
  "channels": "object (optional)"
}
```

**Response:** `{ message }`

---

### 💳 Payment Endpoints

#### POST `/api/payments/create`

**Description:** Create payment for booking  
**Access:** Authenticated (booking owner)  
**Body:**

```json
{
  "bookingId": "ObjectId (required)",
  "paymentMethod": "string (required)",
  "amount": "object (required)"
}
```

**Response:** `{ payment, paymentUrl }`

#### GET `/api/payments/:id`

**Description:** Get payment details  
**Access:** Authenticated (owner, admin)  
**Response:** `{ payment }`

#### GET `/api/payments/booking/:bookingId`

**Description:** Get payments for booking  
**Access:** Authenticated (booking owner, admin)  
**Response:** `{ payments }`

#### POST `/api/payments/:id/confirm`

**Description:** Confirm payment (webhook/callback)  
**Access:** Payment Gateway  
**Body:** Gateway response  
**Response:** `{ message }`

#### POST `/api/payments/:id/refund`

**Description:** Process refund  
**Access:** Admin only  
**Body:** `{ amount, reason }`  
**Response:** `{ refund }`

#### GET `/api/payments/user/history`

**Description:** Get user payment history  
**Access:** Authenticated  
**Query:** `?status=completed&page=1&limit=10`  
**Response:** `{ payments, total }`

---

### ⭐ Review Endpoints

#### POST `/api/reviews`

**Description:** Submit booking review  
**Access:** Authenticated (booking owner)  
**Body:**

```json
{
  "bookingId": "ObjectId (required)",
  "ratings": "object (required)",
  "review": "object (required)",
  "isRecommended": "boolean (required)"
}
```

**Response:** `{ review }`

#### GET `/api/reviews/service/:serviceId`

**Description:** Get service reviews  
**Access:** Public  
**Query:** `?page=1&limit=10&rating=5`  
**Response:** `{ reviews, averageRating, total }`

#### GET `/api/reviews/technician/:technicianId`

**Description:** Get technician reviews  
**Access:** Public  
**Query:** `?page=1&limit=10`  
**Response:** `{ reviews, averageRating, total }`

#### PUT `/api/reviews/:id`

**Description:** Update review  
**Access:** Authenticated (review owner)  
**Body:** Review fields to update  
**Response:** `{ review }`

#### DELETE `/api/reviews/:id`

**Description:** Delete review  
**Access:** Authenticated (review owner), Admin  
**Response:** `{ message }`

#### POST `/api/reviews/:id/helpful`

**Description:** Mark review as helpful  
**Access:** Authenticated  
**Response:** `{ message }`

#### POST `/api/reviews/:id/report`

**Description:** Report inappropriate review  
**Access:** Authenticated  
**Body:** `{ reason }`  
**Response:** `{ message }`

---

### 📊 Analytics & Reports Endpoints

#### GET `/api/analytics/dashboard`

**Description:** Get admin dashboard analytics  
**Access:** Admin only  
**Query:** `?period=30days&startDate=date&endDate=date`  
**Response:**

```json
{
  "overview": {
    "totalBookings": "number",
    "completedBookings": "number",
    "revenue": "number",
    "activeUsers": "number"
  },
  "trends": "object",
  "topServices": "array",
  "performance": "object"
}
```

#### GET `/api/analytics/bookings`

**Description:** Get booking analytics  
**Access:** Admin only  
**Query:** `?period=7days&groupBy=day`  
**Response:** `{ data, summary }`

#### GET `/api/analytics/revenue`

**Description:** Get revenue analytics  
**Access:** Admin only  
**Query:** `?period=1month&breakdown=service`  
**Response:** `{ data, summary }`

#### GET `/api/analytics/technicians`

**Description:** Get technician performance analytics  
**Access:** Admin only  
**Response:** `{ data, summary }`

#### GET `/api/analytics/services`

**Description:** Get service usage analytics  
**Access:** Admin only  
**Response:** `{ data, summary }`

---

### ⚙️ System Settings Endpoints

#### GET `/api/settings`

**Description:** Get public system settings  
**Access:** Public  
**Response:** `{ settings }`

#### GET `/api/settings/all`

**Description:** Get all system settings  
**Access:** Admin only  
**Response:** `{ settings }`

#### PUT `/api/settings/:key`

**Description:** Update system setting  
**Access:** Admin only  
**Body:** `{ value }`  
**Response:** `{ setting }`

#### POST `/api/settings`

**Description:** Create new system setting  
**Access:** Admin only  
**Body:** Setting object  
**Response:** `{ setting }`

---

### 🌐 Real-time WebSocket Events

#### Connection Events

- `connect` - User connects
- `disconnect` - User disconnects
- `authenticate` - Authenticate socket connection

#### Booking Events

- `booking:status-update` - Booking status changed
- `booking:technician-assigned` - Technician assigned
- `booking:location-update` - Technician location update
- `booking:eta-update` - Estimated arrival time update

#### Notification Events

- `notification:new` - New notification received
- `notification:read` - Notification marked as read

#### Technician Events

- `technician:status-change` - Technician status changed
- `technician:location-update` - Technician location update

---

### 📱 File Upload Endpoints

#### POST `/api/upload/image`

**Description:** Upload single image  
**Access:** Authenticated  
**Body:** FormData with image file  
**Response:** `{ imageUrl }`

#### POST `/api/upload/images`

**Description:** Upload multiple images  
**Access:** Authenticated  
**Body:** FormData with multiple image files  
**Response:** `{ imageUrls }`

#### DELETE `/api/upload/:filename`

**Description:** Delete uploaded file  
**Access:** Authenticated (owner), Admin  
**Response:** `{ message }`

---

### 🔍 Search Endpoints

#### GET `/api/search/services`

**Description:** Search services  
**Access:** Public  
**Query:** `?q=engine&category=maintenance&location=cairo`  
**Response:** `{ services, total }`

#### GET `/api/search/technicians`

**Description:** Search technicians  
**Access:** Admin only  
**Query:** `?q=ahmed&specialization=engine&city=cairo`  
**Response:** `{ technicians, total }`

#### GET `/api/search/users`

**Description:** Search users  
**Access:** Admin only  
**Query:** `?q=ahmed&role=USER&phone=010`  
**Response:** `{ users, total }`

---

## 📋 HTTP Response Status Codes

### Success Responses

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `204 No Content` - Request successful, no content to return

### Client Error Responses

- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `422 Unprocessable Entity` - Validation errors
- `429 Too Many Requests` - Rate limit exceeded

### Server Error Responses

- `500 Internal Server Error` - Server error
- `502 Bad Gateway` - External service error
- `503 Service Unavailable` - Service temporarily unavailable

## 🔒 Authentication & Authorization Matrix

| Endpoint                          | Guest | User | Technician | Admin |
| --------------------------------- | ----- | ---- | ---------- | ----- |
| **Authentication**                |       |      |            |       |
| POST /api/auth/register           | ✅     | ✅    | ✅          | ✅     |
| POST /api/auth/login              | ✅     | ✅    | ✅          | ✅     |
| POST /api/auth/logout             | -     | ✅    | ✅          | ✅     |
| **Services**                      |       |      |            |       |
| GET /api/services                 | ✅     | ✅    | ✅          | ✅     |
| GET /api/services/emergency       | ✅     | ✅    | ✅          | ✅     |
| POST /api/services                | -     | -    | -          | ✅     |
| PUT /api/services/:id             | -     | -    | -          | ✅     |
| **Bookings**                      |       |      |            |       |
| POST /api/bookings/emergency      | ✅     | ✅    | ✅          | ✅     |
| POST /api/bookings                | -     | ✅    | -          | ✅     |
| GET /api/bookings/my              | -     | ✅    | -          | ✅     |
| GET /api/bookings                 | -     | -    | ✅          | ✅     |
| PUT /api/bookings/:id/status      | -     | -    | ✅*         | ✅     |
| PUT /api/bookings/:id/approve     | -     | -    | -          | ✅     |
| **Users**                         |       |      |            |       |
| GET /api/users/profile            | -     | ✅    | ✅          | ✅     |
| GET /api/users                    | -     | -    | ✅**        | ✅     |
| PUT /api/users/:id/role           | -     | -    | -          | ✅     |
| **Technicians**                   |       |      |            |       |
| GET /api/technicians              | -     | -    | -          | ✅     |
| PUT /api/technicians/status       | -     | -    | ✅*         | ✅     |
| GET /api/technicians/:id/bookings | -     | -    | ✅*         | ✅     |
| **Payments**                      |       |      |            |       |
| POST /api/payments/create         | -     | ✅    | -          | ✅     |
| POST /api/payments/:id/refund     | -     | -    | -          | ✅     |
| **Analytics**                     |       |      |            |       |
| GET /api/analytics/dashboard      | -     | -    | -          | ✅     |
| GET /api/analytics/*              | -     | -    | -          | ✅     |

**Notes:**

- ✅* = Only for assigned bookings/own profile
- ✅** = Read-only access to user data

## 🔧 Request/Response Examples

### Authentication Example

#### POST `/api/auth/login`

**Request:**

```json
{
  "email": "ahmed@example.com",
  "password": "securepassword123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "data": {
    "user": {
      "_id": "67890abcdef123456789",
      "email": "ahmed@example.com",
      "phone": "+201234567890",
      "role": "USER",
      "profile": {
        "firstName": "أحمد",
        "lastName": "محمد",
        "preferredLanguage": "ar"
      },
      "isVerified": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

### Booking Creation Example

#### POST `/api/bookings`

**Request:**

```json
{
  "serviceId": "67890abcdef123456789",
  "scheduledDateTime": "2024-12-01T10:00:00.000Z",
  "location": {
    "address": "شارع التحرير، الدقي، الجيزة",
    "city": "الجيزة",
    "governorate": "الجيزة",
    "coordinates": {
      "latitude": 30.0444,
      "longitude": 31.2357
    },
    "locationNotes": "أمام مول العرب"
  },
  "customerInfo": {
    "customerName": "أحمد محمد",
    "phoneNumber": "+201234567890",
    "carDetails": {
      "brand": "تويوتا",
      "model": "كامري",
      "year": 2020,
      "plateNumber": "أ ب ج 123",
      "color": "أبيض"
    }
  },
  "serviceDetails": {
    "problemDescription": "صوت غريب في المحرك عند التشغيل",
    "urgencyLevel": "medium",
    "customerNotes": "الصوت يظهر فقط في الصباح"
  }
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "تم إنشاء الحجز بنجاح",
  "data": {
    "booking": {
      "_id": "67890abcdef123456790",
      "bookingNumber": "BK-2024-001234",
      "userId": "67890abcdef123456789",
      "serviceId": "67890abcdef123456789",
      "status": "pending_approval",
      "priority": "normal",
      "scheduledDateTime": "2024-12-01T10:00:00.000Z",
      "location": {
        "address": "شارع التحرير، الدقي، الجيزة",
        "city": "الجيزة",
        "governorate": "الجيزة",
        "coordinates": {
          "latitude": 30.0444,
          "longitude": 31.2357
        }
      },
      "pricing": {
        "basePrice": 200,
        "totalPrice": 200,
        "currency": "EGP",
        "paymentStatus": "pending"
      },
      "createdAt": "2024-11-25T08:30:00.000Z"
    }
  }
}
```

### Error Response Example

#### Response (422) - Validation Error:

```json
{
  "success": false,
  "message": "بيانات غير صحيحة",
  "errors": [
    {
      "field": "email",
      "message": "البريد الإلكتروني مطلوب",
      "code": "REQUIRED"
    },
    {
      "field": "phone",
      "message": "رقم الهاتف غير صحيح",
      "code": "INVALID_FORMAT"
    }
  ]
}
```

#### Response (401) - Unauthorized:

```json
{
  "success": false,
  "message": "غير مصرح لك بالوصول",
  "code": "UNAUTHORIZED"
}
```

## 🔄 Real-time WebSocket Implementation

### Connection & Authentication

```javascript
// Client connection
const socket = io('ws://localhost:3000', {
  auth: {
    token: 'user_jwt_token'
  }
});

// Server authentication
socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('authenticated', (data) => {
  console.log('User authenticated:', data.userId);
});
```

### Booking Tracking Events

```javascript
// Join booking room
socket.emit('join-booking', { bookingId: '67890abcdef123456790' });

// Listen for status updates
socket.on('booking:status-update', (data) => {
  console.log('Booking status updated:', data);
  // { bookingId, status, message, timestamp }
});

// Listen for technician location updates
socket.on('booking:location-update', (data) => {
  console.log('Technician location:', data);
  // { bookingId, latitude, longitude, eta, timestamp }
});

// Technician sends location update
socket.emit('update-location', {
  bookingId: '67890abcdef123456790',
  latitude: 30.0444,
  longitude: 31.2357
});
```

### Notification Events

```javascript
// Listen for new notifications
socket.on('notification:new', (notification) => {
  console.log('New notification:', notification);
  // Show notification to user
  showNotification(notification.titleAr, notification.messageAr);
});

// Mark notification as read
socket.emit('notification:read', { notificationId: 'notification_id' });
```

## 📊 Database Indexes

### Recommended MongoDB Indexes

#### Users Collection

```javascript
// Compound indexes
{ "email": 1 }, // unique
{ "phone": 1 }, // unique
{ "role": 1, "isActive": 1 },
{ "createdAt": -1 }
```

#### Bookings Collection

```javascript
// Compound indexes
{ "userId": 1, "createdAt": -1 },
{ "technicianId": 1, "status": 1 },
{ "serviceId": 1, "scheduledDateTime": 1 },
{ "status": 1, "createdAt": -1 },
{ "bookingNumber": 1 }, // unique
{ "location.coordinates": "2dsphere" }, // geospatial
{ "scheduledDateTime": 1, "status": 1 }
```

#### Services Collection

```javascript
// Indexes
{ "category": 1, "isActive": 1 },
{ "isPopular": -1, "sortOrder": 1 },
{ "nameAr": "text", "descriptionAr": "text" }, // text search
{ "price.basePrice": 1 }
```

#### Notifications Collection

```javascript
// Indexes
{ "userId": 1, "createdAt": -1 },
{ "userId": 1, "isRead": 1 },
{ "type": 1, "createdAt": -1 },
{ "expiresAt": 1 }, // TTL index
{ "createdAt": -1 }
```

#### Technicians Collection

```javascript
// Indexes
{ "userId": 1 }, // unique
{ "workInfo.status": 1, "isActive": 1 },
{ "workInfo.currentLocation.coordinates": "2dsphere" },
{ "professionalInfo.specializations": 1 },
{ "workInfo.workingAreas": 1 }
```

## 🔐 Security Considerations

### API Rate Limiting

```javascript
// Rate limiting configuration
const rateLimits = {
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: "محاولات تسجيل دخول كثيرة، حاول مرة أخرى لاحقاً"
  },
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: "طلبات كثيرة، حاول مرة أخرى لاحقاً"
  },
  upload: {
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 uploads per minute
    message: "رفع ملفات كثير، حاول مرة أخرى لاحقاً"
  }
};
```

### Input Validation Rules

```javascript
// Validation schemas
const validationRules = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(\+2)?01[0-2,5]{1}[0-9]{8}$/, // Egyptian phone format
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChar: false
  },
  arabicText: /^[\u0600-\u06FF\s\d\p{P}]+$/u, // Arabic Unicode range
  coordinates: {
    latitude: { min: -90, max: 90 },
    longitude: { min: -180, max: 180 }
  }
};
```

### File Upload Security

```javascript
// File upload configuration
const uploadConfig = {
  fileTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 10,
  virusScan: true,
  imageResize: {
    thumbnail: { width: 150, height: 150 },
    medium: { width: 500, height: 500 },
    large: { width: 1200, height: 1200 }
  }
};
```

## 🚀 Performance Optimization

### Caching Strategy

```javascript
// Redis caching keys
const cacheKeys = {
  user: (id) => `user:${id}`,
  userBookings: (userId, page) => `user:${userId}:bookings:${page}`,
  services: 'services:active',
  servicesByCategory: (category) => `services:category:${category}`,
  availableTechnicians: (location) => `technicians:available:${location}`,
  systemSettings: 'settings:public'
};

// Cache TTL (Time To Live)
const cacheTTL = {
  user: 3600, // 1 hour
  services: 1800, // 30 minutes
  technicians: 300, // 5 minutes
  settings: 7200 // 2 hours
};
```

### Database Query Optimization

```javascript
// Aggregation pipelines for complex queries
const bookingAnalyticsPipeline = [
  {
    $match: {
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
    }
  },
  {
    $group: {
      _id: {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" }
      },
      totalBookings: { $sum: 1 },
      completedBookings: {
        $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
      },
      totalRevenue: {
        $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$pricing.totalPrice", 0] }
      }
    }
  },
  {
    $sort: { "_id.year": -1, "_id.month": -1, "_id.day": -1 }
  }
];
```

This comprehensive documentation provides all the models, endpoints, and implementation details needed for your car services backend. The structure supports Arabic language, handles all user roles, includes real-time features, and is designed for future scalability including mobile app development.