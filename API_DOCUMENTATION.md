# Wallpaper Manager API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently no authentication required. For production use, consider implementing API keys or OAuth.

---

## Endpoints

### 1. Get All Wallpapers
**GET** `/wallpapers`

Retrieve all wallpapers with optional pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50, max: 1000)

**Response:**
```json
{
  "wallpapers": [
    {
      "id": "f364fa22-9d90-4b34-99e6-3db394bc581a",
      "url": "https://example.com/image.jpg",
      "category": "Nature",
      "description": "Beautiful sunset",
      "timestamp": "2025-01-21T15:50:52.771Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 248,
    "itemsPerPage": 50,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

**Status Codes:**
- `200 OK`: Success
- `500 Internal Server Error`: Server error

---

### 2. Add New Wallpaper
**POST** `/wallpapers`

Add a new wallpaper to the collection.

**Request Body:**
```json
{
  "url": "https://example.com/image.jpg",
  "category": "Nature",
  "description": "Beautiful mountain landscape"
}
```

**Response (Success):**
```json
{
  "message": "Wallpaper added successfully",
  "wallpaper": {
    "id": "a1b2c3d4-e5f6-4789-90ab-cdef12345678",
    "url": "https://example.com/image.jpg",
    "category": "Nature",
    "description": "Beautiful mountain landscape",
    "timestamp": "2025-01-21T16:00:00.000Z"
  },
  "total": 249
}
```

**Response (Duplicate URL):**
```json
{
  "error": "URL already exists",
  "existing": {
    "id": "existing-id-here",
    "category": "Nature",
    "description": "Existing description",
    "timestamp": "2025-01-20T10:30:00.000Z"
  }
}
```

**Status Codes:**
- `201 Created`: Wallpaper added successfully
- `400 Bad Request`: Missing required fields
- `409 Conflict`: URL already exists
- `500 Internal Server Error`: Server error

---

### 3. Search Wallpapers
**GET** `/wallpapers/search`

Search wallpapers by description or category.

**Query Parameters:**
- `q` (required): Search query string

**Example:**
```
GET /wallpapers/search?q=forest
```

**Response:**
```json
{
  "query": "forest",
  "results": [
    {
      "id": "search-result-id",
      "url": "https://example.com/forest.jpg",
      "category": "Nature",
      "description": "Dense forest with morning light",
      "timestamp": "2025-01-21T12:00:00.000Z"
    }
  ],
  "total": 1
}
```

**Status Codes:**
- `200 OK`: Search completed
- `400 Bad Request`: Missing search query
- `500 Internal Server Error`: Server error

---

### 4. Delete Specific Wallpaper
**DELETE** `/wallpapers/:id`

Delete a wallpaper by its ID.

**Parameters:**
- `id`: The wallpaper ID

**Example:**
```
DELETE /wallpapers/f364fa22-9d90-4b34-99e6-3db394bc581a
```

**Response (Success):**
```json
{
  "message": "Wallpaper deleted successfully",
  "deleted": {
    "id": "f364fa22-9d90-4b34-99e6-3db394bc581a",
    "url": "https://example.com/image.jpg",
    "category": "Nature",
    "description": "Beautiful sunset",
    "timestamp": "2025-01-21T15:50:52.771Z"
  },
  "remaining": 247
}
```

**Response (Not Found):**
```json
{
  "error": "Wallpaper not found"
}
```

**Status Codes:**
- `200 OK`: Wallpaper deleted successfully
- `404 Not Found`: Wallpaper ID not found
- `500 Internal Server Error`: Server error

---

### 5. Clear All Wallpapers
**DELETE** `/wallpapers`

⚠️ **DANGER**: Permanently delete all wallpapers.

**Response:**
```json
{
  "message": "All wallpapers cleared successfully"
}
```

**Status Codes:**
- `200 OK`: All wallpapers cleared
- `500 Internal Server Error`: Server error

---

### 6. System Statistics
**GET** `/stats`

Get system performance and health information.

**Response:**
```json
{
  "database": {
    "totalWallpapers": 248,
    "fileSize": "45.67 KB",
    "lastModified": "2025-01-21T16:00:00.000Z"
  },
  "idGeneration": {
    "totalGenerated": 250,
    "collisionAttempts": 0,
    "maxCollisionRetries": 0,
    "collisionRate": "0%",
    "lastReset": "2025-01-21T15:00:00.000Z"
  },
  "performance": {
    "uptime": 3600,
    "memoryUsage": {
      "rss": 25165824,
      "heapTotal": 8388608,
      "heapUsed": 4194304,
      "external": 1024,
      "arrayBuffers": 512
    },
    "nodeVersion": "v18.17.0"
  },
  "server": {
    "environment": "development",
    "timestamp": "2025-01-21T16:00:00.000Z"
  }
}
```

**Status Codes:**
- `200 OK`: Statistics retrieved
- `500 Internal Server Error`: Server error

---

### 7. Reset Statistics
**POST** `/stats/reset`

Reset ID generation statistics (for monitoring/debugging).

**Response:**
```json
{
  "message": "ID generation statistics reset successfully",
  "stats": {
    "totalGenerated": 0,
    "collisionAttempts": 0,
    "maxCollisionRetries": 0,
    "lastReset": "2025-01-21T16:00:00.000Z"
  }
}
```

**Status Codes:**
- `200 OK`: Statistics reset successfully
- `500 Internal Server Error`: Server error

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error description here"
}
```

Common status codes:
- `400 Bad Request`: Invalid input data
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists
- `500 Internal Server Error`: Server-side error

---

## Rate Limiting

**Current**: No rate limiting implemented
**Production Recommendation**: Implement rate limiting (e.g., 100 requests/minute per IP)

---

## CORS

The API supports Cross-Origin Resource Sharing (CORS) for all origins in development.
For production, configure specific allowed origins.

---

## Examples

### cURL Examples

```bash
# Get all wallpapers (first page)
curl http://localhost:3000/api/wallpapers

# Get specific page
curl "http://localhost:3000/api/wallpapers?page=2&limit=25"

# Add new wallpaper
curl -X POST http://localhost:3000/api/wallpapers \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/new.jpg","category":"Abstract","description":"Geometric patterns"}'

# Search wallpapers
curl "http://localhost:3000/api/wallpapers/search?q=nature"

# Delete wallpaper
curl -X DELETE http://localhost:3000/api/wallpapers/f364fa22-9d90-4b34-99e6-3db394bc581a

# Get system stats
curl http://localhost:3000/api/stats
```

### JavaScript Examples

```javascript
// Get wallpapers with pagination
const response = await fetch('/api/wallpapers?page=1&limit=20');
const data = await response.json();
console.log(`Page ${data.pagination.currentPage} of ${data.pagination.totalPages}`);

// Add wallpaper with error handling
try {
  const response = await fetch('/api/wallpapers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: 'https://example.com/image.jpg',
      category: 'Nature',
      description: 'Beautiful landscape'
    })
  });
  
  if (response.status === 409) {
    const error = await response.json();
    console.log('URL already exists:', error.existing);
  } else if (response.ok) {
    const result = await response.json();
    console.log('Added:', result.wallpaper);
  }
} catch (error) {
  console.error('Network error:', error);
}
```

---

## Mobile App Integration

This API is designed to work seamlessly with mobile applications. See `MOBILE_EXAMPLES.md` for platform-specific integration examples.

---

## Performance Notes

- **JSON Storage**: Suitable for up to ~10,000 wallpapers
- **Pagination**: Default 50 items per page, configurable up to 1,000
- **Search**: Linear search through descriptions and categories
- **ID Generation**: Cryptographically secure UUIDs with collision detection

For larger datasets, consider migrating to a database (see `SCALABILITY_GUIDE.md`).