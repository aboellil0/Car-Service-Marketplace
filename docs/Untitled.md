# Enhanced Car Services Platform - Tracking Models & Admin Features

## 📊 Additional Database Models

### 7. Service Progress Tracking Model

```json
{
  "_id": "ObjectId",
  "bookingId": "ObjectId (ref: Bookings, required, unique)",
  "userId": "ObjectId (ref: Users, required)",
  "serviceId": "ObjectId (ref: Services, required)",
  "technicianId": "ObjectId (ref: Users, optional)",
  "currentStage": "enum ['submitted', 'under_review', 'approved', 'technician_assigned', 'technician_notified', 'on_way', 'arrived', 'diagnosis', 'parts_needed', 'work_in_progress', 'quality_check', 'completed', 'cancelled', 'rejected'] (required)",
  "progress": {
    "percentage": "number (0-100, required)",
    "estimatedCompletion": "date (optional)",
    "actualCompletion": "date (optional)",
    "timeSpent": "number (minutes, default: 0)"
  },
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

### 9. Admin Notifications Model

```json
{
  "_id": "ObjectId",
  "createdBy": "ObjectId (ref: Users, required)",
  "title": "string (required)",
  "content": {
    "titleAr": "string (required)",
    "titleEn": "string (optional)",
    "messageAr": "string (required)",
    "messageEn": "string (optional)",
    "richContent": {
      "html": "string (optional)",
      "markdown": "string (optional)"
    }
  },
  "type": "enum ['announcement', 'promotion', 'maintenance', 'emergency', 'feature_update', 'policy_change', 'celebration', 'reminder'] (required)",
  "priority": "enum ['low', 'normal', 'high', 'critical'] (default: normal)",
  "targeting": {
    "audienceType": "enum ['all', 'specific_users', 'user_segment', 'role_based', 'location_based', 'behavior_based'] (required)",
    "criteria": {
      "userIds": "array of ObjectIds (ref: Users, optional)",
      "roles": "array of strings (optional)",
      "locations": {
        "cities": "array of strings (optional)",
        "governorates": "array of strings (optional)"
      },
      "userSegments": {
        "loyaltyLevel": "array of strings (optional)",
        "totalBookings": {
          "min": "number (optional)",
          "max": "number (optional)"
        },
        "totalSpent": {
          "min": "number (optional)",
          "max": "number (optional)"
        },
        "lastBookingDate": {
          "before": "date (optional)",
          "after": "date (optional)"
        },
        "registrationDate": {
          "before": "date (optional)",
          "after": "date (optional)"
        }
      },
      "technicianCriteria": {
        "servicesCompleted": {
          "min": "number (optional)",
          "max": "number (optional)"
        },
        "rating": {
          "min": "number (optional)",
          "max": "number (optional)"
        },
        "specializations": "array of strings (optional)"
      }
    },
    "excludeUsers": "array of ObjectIds (ref: Users, optional)"
  },
  "scheduling": {
    "sendImmediately": "boolean (default: true)",
    "scheduledAt": "date (optional)",
    "timezone": "string (default: 'Africa/Cairo')",
    "repeatSchedule": {
      "isRecurring": "boolean (default: false)",
      "frequency": "enum ['daily', 'weekly', 'monthly', 'yearly'] (optional)",
      "interval": "number (optional)",
      "endDate": "date (optional)",
      "occurrences": "number (optional)"
    }
  },
  "channels": {
    "push": "boolean (default: true)",
    "sms": "boolean (default: false)",
    "email": "boolean (default: false)",
    "inApp": "boolean (default: true)",
    "whatsapp": "boolean (default: false)"
  },
  "media": {
    "images": "array of strings (urls, optional)",
    "video": "string (url, optional)",
    "attachments": "array of objects (optional)"
  },
  "actions": [
    {
      "type": "enum ['button', 'link', 'deeplink', 'call', 'book_service']",
      "label": "string (required)",
      "labelAr": "string (required)",
      "labelEn": "string (optional)",
      "action": "string (required)",
      "style": "enum ['primary', 'secondary', 'success', 'warning', 'danger'] (default: primary)"
    }
  ],
  "status": "enum ['draft', 'scheduled', 'sending', 'sent', 'failed', 'cancelled'] (default: draft)",
  "delivery": {
    "totalRecipients": "number (default: 0)",
    "sentCount": "number (default: 0)",
    "deliveredCount": "number (default: 0)",
    "readCount": "number (default: 0)",
    "clickCount": "number (default: 0)",
    "failedCount": "number (default: 0)",
    "unsubscribeCount": "number (default: 0)",
    "sentAt": "date (optional)",
    "completedAt": "date (optional)"
  },
  "analytics": {
    "openRate": "number (percentage, default: 0)",
    "clickRate": "number (percentage, default: 0)",
    "deliveryRate": "number (percentage, default: 0)",
    "engagementScore": "number (0-100, default: 0)",
    "topPerformingChannel": "string (optional)",
    "demographicsBreakdown": {
      "byAge": "object (optional)",
      "byGender": "object (optional)",
      "byLocation": "object (optional)",
      "byRole": "object (optional)"
    }
  },
  "feedback": {
    "allowFeedback": "boolean (default: false)",
    "feedbackResponses": [
      {
        "userId": "ObjectId (ref: Users)",
        "rating": "number (1-5)",
        "comment": "string (optional)",
        "submittedAt": "date"
      }
    ],
    "averageRating": "number (default: 0)"
  },
  "isActive": "boolean (default: true)",
  "expiresAt": "date (optional)",
  "createdAt": "date (auto)",
  "updatedAt": "date (auto)"
}
```

---

## 🔗 Additional API Endpoints

### 📊 Service Progress Tracking Endpoints

#### GET `/api/tracking/booking/:bookingId`

**Description:** Get detailed service progress for a booking  
**Access:** Authenticated (booking owner, admin, assigned technician)  
**Response:**

```json
{
  "success": true,
  "data": {
    "tracking": {
      "_id": "tracking_id",
      "bookingId": "booking_id",
      "currentStage": "work_in_progress",
      "progress": {
        "percentage": 65,
        "estimatedCompletion": "2024-12-01T14:00:00.000Z"
      },
      "stages": [
        {
          "stage": "submitted",
          "status": "completed",
          "completedAt": "2024-12-01T09:00:00.000Z",
          "actualDuration": 0
        },
        {
          "stage": "approved",
          "status": "completed",
          "completedAt": "2024-12-01T09:30:00.000Z",
          "actualDuration": 30
        },
        {
          "stage": "technician_assigned",
          "status": "completed",
          "completedAt": "2024-12-01T10:00:00.000Z",
          "actualDuration": 30
        },
        {
          "stage": "on_way",
          "status": "completed",
          "completedAt": "2024-12-01T10:45:00.000Z",
          "actualDuration": 45
        },
        {
          "stage": "work_in_progress",
          "status": "in_progress",
          "startedAt": "2024-12-01T11:00:00.000Z",
          "estimatedDuration": 120,
          "notes": "يتم العمل على إصلاح المحرك"
        }
      ],
      "realTimeData": {
        "technicianLocation": {
          "latitude": 30.0444,
          "longitude": 31.2357,
          "lastUpdated": "2024-12-01T12:30:00.000Z"
        },
        "isLive": true
      }
    }
  }
}
```

#### PUT `/api/tracking/booking/:bookingId/stage`

**Description:** Update service progress stage  
**Access:** Admin, Assigned Technician  
**Body:**

```json
{
  "stage": "work_in_progress",
  "status": "completed",
  "notes": "تم إنتهاء العمل بنجاح",
  "images": ["image1.jpg", "image2.jpg"],
  "actualDuration": 90
}
```

**Response:** `{ success: true, message: "تم تحديث مرحلة الخدمة", tracking }`

#### POST `/api/tracking/booking/:bookingId/blocker`

**Description:** Report a service blocker  
**Access:** Assigned Technician, Admin  
**Body:**

```json
{
  "type": "parts_unavailable",
  "description": "قطعة غيار غير متوفرة - مطلوب فلتر زيت خاص",
  "impact": "high"
}
```

**Response:** `{ success: true, message: "تم تسجيل المشكلة", blocker }`

#### POST `/api/tracking/booking/:bookingId/quality-check`

**Description:** Add quality check record  
**Access:** Assigned Technician, Admin  
**Body:**

```json
{
  "checkType": "final_inspection",
  "status": "passed",
  "notes": "جميع الفحوصات مطابقة للمعايير",
  "criteria": [
    {
      "item": "محرك",
      "status": "ok",
      "notes": "يعمل بشكل طبيعي"
    },
    {
      "item": "زيت المحرك",
      "status": "ok",
      "notes": "تم التغيير"
    }
  ]
}
```

**Response:** `{ success: true, message: "تم تسجيل فحص الجودة", qualityCheck }`

---

### 📈 User Statistics Endpoints

#### GET `/api/statistics/user/:userId`

**Description:** Get comprehensive user statistics  
**Access:** Admin, Self (if user role)  
**Response:**

```json
{
  "success": true,
  "data": {
    "statistics": {
      "userId": "user_id",
      "role": "USER",
      "statistics": {
        "bookings": {
          "total": 47,
          "completed": 42,
          "cancelled": 3,
          "pending": 2,
          "emergency": 5
        },
        "services": {
          "totalServicesUsed": 8,
          "favoriteService": "engine_maintenance",
          "mostUsedCategory": "regular_maintenance",
          "servicesBreakdown": [
            {
              "serviceName": "صيانة محرك",
              "count": 15,
              "lastUsed": "2024-11-20T10:00:00.000Z"
            }
          ]
        },
        "financial": {
          "totalSpent": 12500,
          "averageBookingValue": 265,
          "loyaltyPoints": 1250
        }
      },
      "achievements": [
        {
          "type": "bookings_milestone",
          "name": "عميل مخلص",
          "description": "أكمل 50 حجز",
          "currentProgress": 47,
          "targetValue": 50,
          "isCompleted": false
        }
      ],
      "milestones": {
        "bookingMilestones": [
          {
            "milestone": 5,
            "isCompleted": true,
            "achievedAt": "2024-06-15T10:00:00.000Z",
            "reward": "خصم 10%"
          },
          {
            "milestone": 10,
            "isCompleted": true,
            "achievedAt": "2024-08-20T10:00:00.000Z",
            "reward": "خصم 15%"
          },
          {
            "milestone": 25,
            "isCompleted": true,
            "achievedAt": "2024-10-10T10:00:00.000Z",
            "reward": "خصم 20%"
          },
          {
            "milestone": 50,
            "isCompleted": false,
            "reward": "خدمة مجانية"
          }
        ],
        "loyaltyLevel": {
          "current": "gold",
          "points": 1250,
          "nextLevelRequirement": 2000,
          "benefits": ["خصم 25%", "أولوية في الحجز", "فني مخصص"]
        }
      }
    }
  }
}
```

#### GET `/api/statistics/technician/:technicianId`

**Description:** Get technician performance statistics  
**Access:** Admin, Self (if technician)  
**Response:**

```json
{
  "success": true,
  "data": {
    "statistics": {
      "technician": {
        "servicesCompleted": 4847,
        "averageRating": 4.8,
        "totalRatings": 1203,
        "responseTime": {
          "average": 15,
          "fastest": 5,
          "slowest": 45
        },
        "completionRate": 96.5,
        "customerSatisfaction": 94.2,
        "earnings": {
          "total": 145000,
          "thisMonth": 12500,
          "lastMonth": 11800
        }
      },
      "achievements": [
        {
          "type": "technician_performance",
          "name": "سوبر تكنيشن",
          "description": "أكمل 5000 خدمة",
          "currentProgress": 4847,
          "targetValue": 5000,
          "isCompleted": false
        }
      ],
      "milestones": {
        "serviceMilestones": [
          {
            "milestone": 5000,
            "isCompleted": false,
            "currentProgress": 4847,
            "reward": "بونص 5000 جنيه + شهادة تقدير"
          }
        ]
      }
    }
  }
}
```

#### GET `/api/statistics/dashboard`

**Description:** Get admin dashboard with all user statistics overview  
**Access:** Admin only  
**Query:** `?period=30days&userType=all&milestone=50`  
**Response:**

```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 15423,
      "activeUsers": 8234,
      "totalBookings": 45623,
      "completedBookings": 42156
    },
    "milestones": {
      "approaching5000Services": [
        {
          "technicianId": "tech_id_1",
          "name": "أحمد محمد",
          "currentServices": 4847,
          "progress": 96.94
        }
      ],
      "approaching50Bookings": [
        {
          "userId": "user_id_1",
          "name": "فاطمة أحمد",
          "currentBookings": 47,
          "progress": 94
        }
      ]
    },
    "achievements": {
      "recentlyCompleted": [
        {
          "userId": "user_id_2",
          "userName": "محمد علي",
          "achievement": "عميل ذهبي - 100 حجز",
          "completedAt": "2024-11-25T10:00:00.000Z"
        }
      ]
    }
  }
}
```

#### PUT `/api/statistics/calculate/:userId`

**Description:** Recalculate user statistics (admin only)  
**Access:** Admin only  
**Response:** `{ success: true, message: "تم إعادة حساب الإحصائيات", statistics }`

---

### 📢 Admin Notifications Endpoints

#### POST `/api/admin/notifications`

**Description:** Create and send admin notification  
**Access:** Admin only  
**Body:**

```json
{
  "content": {
    "titleAr": "تهانينا! وصلت للهدف",
    "messageAr": "تهانينا أحمد! لقد أكملت 50 حجز وحصلت على خصم 25% على الحجز القادم",
    "titleEn": "Congratulations! You reached your goal",
    "messageEn": "Congratulations Ahmed! You completed 50 bookings and earned 25% discount on your next booking"
  },
  "type": "celebration",
  "priority": "high",
  "targeting": {
    "audienceType": "specific_users",
    "criteria": {
      "userIds": ["67890abcdef123456789"]
    }
  },
  "channels": {
    "push": true,
    "sms": true,
    "inApp": true
  },
  "media": {
    "images": ["celebration.jpg"]
  },
  "actions": [
    {
      "type": "button",
      "labelAr": "احجز الآن",
      "labelEn": "Book Now",
      "action": "deeplink://book-service",
      "style": "primary"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "تم إرسال الإشعار بنجاح",
  "data": {
    "notificationId": "notification_id",
    "delivery": {
      "totalRecipients": 1,
      "sentCount": 1,
      "status": "sent"
    }
  }
}
```

#### POST `/api/admin/notifications/milestone`

**Description:** Send milestone achievement notification  
**Access:** Admin only, System (automated)  
**Body:**

```json
{
  "userId": "67890abcdef123456789",
  "milestoneType": "bookings",
  "milestoneValue": 50,
  "reward": "خدمة مجانية للحجز القادم",
  "customMessage": "رسالة إضافية اختيارية"
}
```

**Response:** `{ success: true, message: "تم إرسال إشعار الإنجاز", notification }`

#### POST `/api/admin/notifications/broadcast`

**Description:** Send broadcast notification to user segments  
**Access:** Admin only  
**Body:**

```json
{
  "content": {
    "titleAr": "عرض خاص لعملائنا المميزين",
    "messageAr": "خصم 30% على جميع خدمات الصيانة لفترة محدودة"
  },
  "type": "promotion",
  "targeting": {
    "audienceType": "user_segment",
    "criteria": {
      "userSegments": {
        "loyaltyLevel": ["gold", "platinum"],
        "totalBookings": {
          "min": 20
        }
      }
    }
  },
  "scheduling": {
    "sendImmediately": false,
    "schedul
```