# Real-Time Expert Session Booking API Documentation

This document contains details about the backend APIs available for the application.

## Base URL
`http://localhost:5000`

---

## Experts API

### 1. Get Experts List
Fetches a list of experts with options for pagination, searching, and filtering.

**Endpoint:**
`GET /experts`

**Query Parameters (Optional):**
- `page` (number): Page number for pagination (default is 1).
- `limit` (number): Number of experts to return per page (default is 10).
- `search` (string): Search text to find experts by name or category (case-insensitive).
- `category` (string): Filter experts by an exact category name.
- `minExperience` (number): Filter experts with experience greater than or equal to this value.
- `minRating` (number): Filter experts with a rating greater than or equal to this value.

**Example Request:**
`GET /experts?page=1&limit=5&search=web&minExperience=3`

**Success Response (200 OK):**
```json
{
  "success": true,
  "count": 5,
  "total": 12,
  "totalPages": 3,
  "currentPage": 1,
  "data": [
    {
      "_id": "60d5ecb8b392d700153f3a09",
      "name": "John Doe",
      "category": "Web Development",
      "experience": 5,
      "rating": 4.8,
      "slots": []
    }
  ]
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "success": false,
  "message": "Server Error"
}
```

### 2. Get Expert Details
Fetches a specific expert by their ID along with their available slots.

**Endpoint:**
`GET /experts/:id`

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ecb8b392d700153f3a09",
    "name": "John Doe",
    "category": "Web Development",
    "experience": 5,
    "rating": 4.8,
    "slots": [
      {
        "date": "2026-06-01",
        "times": ["10:00 AM", "02:00 PM"]
      }
    ]
  }
}
```

---

## Bookings API

### 1. Create a Booking
Creates a new booking for a specific expert slot.

**Endpoint:**
`POST /bookings`

**Request Body:**
```json
{
  "expertId": "60d5ecb8b392d700153f3a09",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "1234567890",
  "date": "2026-06-01",
  "slot": "10:00 AM",
  "notes": "Need help with React"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "expertId": "60d5ecb8b392d700153f3a09",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "1234567890",
    "date": "2026-06-01",
    "slot": "10:00 AM",
    "notes": "Need help with React",
    "status": "Pending",
    "_id": "60d5edb1b392d700153f3a15"
  }
}
```

**Error Response (Slot already booked - 400 Bad Request):**
```json
{
  "message": "Slot already booked"
}
```

### 2. Get Bookings by Email
Fetches a list of bookings associated with a specific email address.

**Endpoint:**
`GET /bookings?email=user@example.com`

**Query Parameters (Required):**
- `email` (string): The email address to fetch bookings for.

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d5edb1b392d700153f3a15",
      "expertId": {
        "_id": "60d5ecb8b392d700153f3a09",
        "name": "John Doe",
        "category": "Web Development"
      },
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "1234567890",
      "date": "2026-06-01",
      "slot": "10:00 AM",
      "status": "Pending"
    }
  ]
}
```

### 3. Update Booking Status
Updates the status of an existing booking.

**Endpoint:**
`PATCH /bookings/:id/status`

**Request Body:**
```json
{
  "status": "Confirmed" // Can be "Pending", "Confirmed", or "Completed"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5edb1b392d700153f3a15",
    "expertId": "60d5ecb8b392d700153f3a09",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "status": "Confirmed"
  }
}
```

---

## Real-Time Events (Socket.io)

### 1. `slotBooked`
Emitted by the server when a new booking is successfully created. The frontend can listen to this event to remove the booked slot instantly from the UI.

**Payload:**
```json
{
  "expertId": "60d5ecb8b392d700153f3a09",
  "date": "2026-06-01",
  "slot": "10:00 AM"
}
```

**Frontend Implementation Example:**
```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

socket.on("slotBooked", (data) => {
    console.log("Slot was just booked:", data);
    // Logic to instantly remove `data.slot` on `data.date` for `data.expertId`
});
```
