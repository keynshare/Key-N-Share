# Profile API Documentation

This document outlines all the available APIs for the profile section of the Key-N-Share application.

## Base URL
```
http://localhost:4000/api/profile
```

## Authentication
Protected routes require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## API Endpoints

### 1. Get User Profile (Public)
**GET** `/api/profile/:userId`

Get any user's public profile information.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "firstName": "John",
    "email": "john@example.com",
    "role": "Data Scientist",
    "bio": "Experienced data scientist with 5+ years in ML",
    "profileViewsCount": 42,
    "sellerRating": {
      "totalRating": 0,
      "numberOfRatings": 0,
      "averageRating": 0
    },
    "buyerRating": {
      "totalRating": 0,
      "numberOfRatings": 0,
      "averageRating": 0
    },
    "datasets": [
      {
        "_id": "dataset_id",
        "title": "Dataset Title",
        "description": "Dataset description",
        "coverImageUrl": "https://example.com/image.jpg",
        "price": 25.99,
        "downloads": 15,
        "views": 120,
        "averageRating": 4.5
      }
    ],
    "datasetsSold": [
      {
        "_id": "transaction_id",
        "price": 25.99,
        "currency": "MATIC",
        "status": "completed",
        "completedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "statistics": {
      "totalDatasets": 5,
      "totalSold": 3,
      "totalEarnings": 77.97,
      "profileViews": 42
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 2. Get Current User Profile (Protected)
**GET** `/api/profile/me/profile`

Get the currently authenticated user's profile.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:** Same as above but for the authenticated user.

---

### 3. Update User Profile (Protected)
**PUT** `/api/profile/me/profile`

Update the current user's profile information.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Body:**
```json
{
  "role": "Senior Data Engineer",
  "bio": "Updated bio information"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "user_id",
    "firstName": "John",
    "email": "john@example.com",
    "role": "Senior Data Engineer",
    "bio": "Updated bio information",
    // ... other fields
  }
}
```

**Validation Rules:**
- `role`: Max 100 characters
- `bio`: Max 500 characters

---

### 4. Increment Profile Views (Public)
**POST** `/api/profile/:userId/view`

Increment the profile view count for a user.

**Response:**
```json
{
  "success": true,
  "message": "Profile views incremented",
  "data": {
    "profileViewsCount": 43
  }
}
```

---

### 5. Get User Datasets (Public)
**GET** `/api/profile/:userId/datasets`

Get datasets uploaded by a specific user with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "datasets": [
      {
        "_id": "dataset_id",
        "title": "Dataset Title",
        "description": "Dataset description",
        "coverImageUrl": "https://example.com/image.jpg",
        "price": 25.99,
        "downloads": 15,
        "views": 120,
        "averageRating": 4.5,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalDatasets": 25,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

### 6. Get Current User Datasets (Protected)
**GET** `/api/profile/me/datasets`

Get datasets uploaded by the currently authenticated user.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:** Same as above but for the authenticated user.

---

### 7. Get User Sold Datasets (Protected)
**GET** `/api/profile/me/sold-datasets`

Get datasets sold by the currently authenticated user.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by transaction status (pending, completed, failed, cancelled)

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "_id": "transaction_id",
        "price": 25.99,
        "currency": "MATIC",
        "status": "completed",
        "completedAt": "2024-01-15T10:30:00.000Z",
        "datasetId": {
          "_id": "dataset_id",
          "title": "Dataset Title",
          "description": "Dataset description",
          "coverImageUrl": "https://example.com/image.jpg"
        },
        "buyerId": {
          "_id": "buyer_id",
          "firstName": "Jane",
          "email": "jane@example.com"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalTransactions": 15,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

### 8. Get User Statistics (Protected)
**GET** `/api/profile/me/statistics`

Get comprehensive statistics for the currently authenticated user.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalDatasets": 5,
    "totalSold": 3,
    "totalEarnings": 77.97,
    "profileViews": 42,
    "averageRating": 4.5,
    "recentActivity": {
      "datasets": [
        {
          "title": "Latest Dataset",
          "createdAt": "2024-01-15T10:30:00.000Z",
          "price": 29.99
        }
      ],
      "sales": [
        {
          "price": 25.99,
          "completedAt": "2024-01-15T10:30:00.000Z",
          "datasetId": {
            "title": "Sold Dataset"
          }
        }
      ]
    }
  }
}
```

---

## Error Responses

All APIs return consistent error responses:

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Validation error message"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Access token required"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "User not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details"
}
```

---

## Frontend Integration Examples

### React Hook Example
```javascript
import { useState, useEffect } from 'react';

const useProfile = (userId, token = null) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await fetch(`/api/profile/${userId}`, { headers });
        const data = await response.json();
        
        if (data.success) {
          setProfile(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, token]);

  return { profile, loading, error };
};
```

### Update Profile Example
```javascript
const updateProfile = async (updates) => {
  try {
    const response = await fetch('/api/profile/me/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    
    const data = await response.json();
    if (data.success) {
      // Handle success
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    // Handle error
    console.error('Failed to update profile:', error);
  }
};
```

---

## Notes for Frontend Developer

1. **Profile Views**: Call the increment endpoint whenever someone views a user's profile
2. **Pagination**: All list endpoints support pagination with `page` and `limit` parameters
3. **Authentication**: Use the JWT token from login for protected routes
4. **Error Handling**: Always check the `success` field in responses
5. **Data Population**: The APIs automatically populate related data (datasets, transactions, etc.)
6. **Real-time Updates**: Consider implementing WebSocket or polling for live statistics updates
7. **Dispute System**: The User schema now includes dispute tracking (disputesRaised, disputesSolved)

## Complete Model System

Your User schema is now **100% complete** with all referenced models available:

✅ **User.js** - Complete user profile with all fields and methods
✅ **Transaction.js** - Complete transaction tracking for dataset sales  
✅ **DatasetCatalogue.js** - Complete dataset management
✅ **Dispute.js** - Complete dispute resolution system (NEW!)

The APIs are designed to be RESTful and follow consistent patterns for easy integration.
