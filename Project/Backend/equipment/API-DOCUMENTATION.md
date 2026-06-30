# Equipment Service API Documentation

## Overview

The Equipment Service is a microservice that manages equipment and vendor information in the Equipment Tracking System. It provides RESTful APIs for equipment registration, lifecycle tracking, status management, and vendor management.

## Technology Stack

- **Framework**: Spring Boot 4.0.2
- **Language**: Java 17
- **Database**: MySQL
- **Security**: JWT Bearer Authentication
- **Documentation**: SpringDoc OpenAPI 3 (Swagger)
- **Build Tool**: Maven

## Base URL

- **Development**: `http://localhost:8080`
- **Production**: `https://api.equipmenttracking.com`

## API Documentation Access

### Interactive API Documentation (Swagger UI)

Once the application is running, access the interactive API documentation at:

```
http://localhost:8080/swagger-ui.html
```

### OpenAPI Specification (JSON)

Access the raw OpenAPI specification at:

```
http://localhost:8080/api-docs
```

## Authentication

Most API endpoints require JWT authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

**Note**: For development purposes, authentication is currently disabled for API endpoints.

## API Endpoints

### Equipment Management

#### 1. Register New Equipment

**Endpoint**: `POST /api/equipment`

**Description**: Creates a new equipment entry in the system.

**Request Body**:

```json
{
  "equipmentName": "Industrial CNC Machine",
  "category": "Manufacturing",
  "installationDate": "2024-01-15",
  "equipmentStatus": "ACTIVE",
  "model": "CNC-5000X",
  "weightKg": 2500.5,
  "powerKW": 15.5,
  "capacity": "500 units/hour",
  "vendorId": "VEN-001"
}
```

**Response** (201 Created):

```json
{
  "equipmentId": "EQ-001",
  "equipmentName": "Industrial CNC Machine",
  "category": "Manufacturing",
  "installationDate": "2024-01-15",
  "equipmentStatus": "ACTIVE",
  "model": "CNC-5000X",
  "weightKg": 2500.5,
  "powerKW": 15.5,
  "capacity": "500 units/hour",
  "vendorId": "VEN-001",
  "vendorName": "Tech Equipment Suppliers Inc.",
  "contactEmail": "contact@techequipment.com",
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00"
}
```

#### 2. Get All Equipment

**Endpoint**: `GET /api/equipment`

**Description**: Retrieves a list of all equipment in the system.

**Response** (200 OK):

```json
[
  {
    "equipmentId": "EQ-001",
    "equipmentName": "Industrial CNC Machine",
    "category": "Manufacturing",
    "installationDate": "2024-01-15",
    "equipmentStatus": "ACTIVE",
    "model": "CNC-5000X",
    "weightKg": 2500.5,
    "powerKW": 15.5,
    "capacity": "500 units/hour",
    "vendorId": "VEN-001",
    "vendorName": "Tech Equipment Suppliers Inc.",
    "contactEmail": "contact@techequipment.com",
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  }
]
```

#### 3. Get Equipment by ID

**Endpoint**: `GET /api/equipment/{equipmentId}`

**Description**: Retrieves detailed information about a specific equipment.

**Path Parameters**:

- `equipmentId` (required): Unique identifier of the equipment (e.g., "EQ-001")

**Response** (200 OK):

```json
{
  "equipmentId": "EQ-001",
  "equipmentName": "Industrial CNC Machine",
  "category": "Manufacturing",
  "installationDate": "2024-01-15",
  "equipmentStatus": "ACTIVE",
  "model": "CNC-5000X",
  "weightKg": 2500.5,
  "powerKW": 15.5,
  "capacity": "500 units/hour",
  "vendorId": "VEN-001",
  "vendorName": "Tech Equipment Suppliers Inc.",
  "contactEmail": "contact@techequipment.com",
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00"
}
```

#### 4. Update Equipment Status

**Endpoint**: `PUT /api/equipment/{equipmentId}/status`

**Description**: Updates the operational status of equipment.

**Path Parameters**:

- `equipmentId` (required): Unique identifier of the equipment (e.g., "EQ-001")

**Request Body**:

```json
{
  "status": "MAINTENANCE"
}
```

**Valid Status Values**:

- `ACTIVE`
- `INACTIVE`
- `MAINTENANCE`
- `RETIRED`
- `UNDER_REPAIR`

**Response** (200 OK):

```json
{
  "equipmentId": "EQ-001",
  "equipmentName": "Industrial CNC Machine",
  "equipmentStatus": "MAINTENANCE"
  // ... other fields
}
```

#### 5. Get Equipment Lifecycle History

**Endpoint**: `GET /api/equipment/{equipmentId}/lifecycle`

**Description**: Retrieves the complete lifecycle history of equipment, including all status changes.

**Path Parameters**:

- `equipmentId` (required): Unique identifier of the equipment (e.g., "EQ-001")

**Response** (200 OK):

```json
[
  {
    "id": 1,
    "equipmentId": "EQ-001",
    "oldStatus": "ACTIVE",
    "newStatus": "MAINTENANCE",
    "changedAt": "2024-01-20T14:45:00",
    "changedBy": "admin@example.com"
  }
]
```

---

### Vendor Management

#### 1. Register New Vendor

**Endpoint**: `POST /api/vendors`

**Description**: Creates a new vendor entry in the system.

**Request Body**:

```json
{
  "vendorName": "Tech Equipment Suppliers Inc.",
  "contactEmail": "contact@techequipment.com"
}
```

**Response** (201 Created):

```json
{
  "vendorId": "VEN-001",
  "vendorName": "Tech Equipment Suppliers Inc.",
  "contactEmail": "contact@techequipment.com",
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00"
}
```

#### 2. Get All Vendors

**Endpoint**: `GET /api/vendors`

**Description**: Retrieves a list of all vendors in the system.

**Response** (200 OK):

```json
[
  {
    "vendorId": "VEN-001",
    "vendorName": "Tech Equipment Suppliers Inc.",
    "contactEmail": "contact@techequipment.com",
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  }
]
```

#### 3. Get Vendor by ID

**Endpoint**: `GET /api/vendors/{vendorId}`

**Description**: Retrieves detailed information about a specific vendor.

**Path Parameters**:

- `vendorId` (required): Unique identifier of the vendor (e.g., "VEN-001")

**Response** (200 OK):

```json
{
  "vendorId": "VEN-001",
  "vendorName": "Tech Equipment Suppliers Inc.",
  "contactEmail": "contact@techequipment.com",
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00"
}
```

---

## Error Responses

### 400 Bad Request

Invalid request data or validation error.

```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/equipment"
}
```

### 401 Unauthorized

Missing or invalid JWT token.

```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token",
  "path": "/api/equipment"
}
```

### 404 Not Found

Resource not found.

```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Equipment not found with ID: EQ-999",
  "path": "/api/equipment/EQ-999"
}
```

### 409 Conflict

Resource already exists.

```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 409,
  "error": "Conflict",
  "message": "Vendor with given ID already exists",
  "path": "/api/vendors"
}
```

---

## Health Checks

### Application Health

**Endpoint**: `GET /actuator/health`

**Response**:

```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "MySQL",
        "validationQuery": "isValid()"
      }
    },
    "diskSpace": {
      "status": "UP"
    }
  }
}
```

---

## Data Validation Rules

### Equipment Request

- **equipmentName**: Required, non-blank string
- **category**: Required, non-blank string
  - Valid values: Manufacturing, Construction, IT, Medical, Laboratory, Office
- **installationDate**: Required, valid date (YYYY-MM-DD)
- **equipmentStatus**: Required, non-blank string
  - Valid values: ACTIVE, INACTIVE, MAINTENANCE, RETIRED, UNDER_REPAIR
- **model**: Required, non-blank string
- **weightKg**: Required, positive number (> 0)
- **powerKW**: Required, positive number (> 0)
- **capacity**: Required, non-blank string
- **vendorId**: Optional, string (must reference existing vendor)

### Vendor Request

- **vendorName**: Required, non-blank string
- **contactEmail**: Required, valid email format

---

## Examples Using cURL

### Register Equipment

```bash
curl -X POST http://localhost:8080/api/equipment \
  -H "Content-Type: application/json" \
  -d '{
    "equipmentName": "Industrial CNC Machine",
    "category": "Manufacturing",
    "installationDate": "2024-01-15",
    "equipmentStatus": "ACTIVE",
    "model": "CNC-5000X",
    "weightKg": 2500.5,
    "powerKW": 15.5,
    "capacity": "500 units/hour",
    "vendorId": "VEN-001"
  }'
```

### Get All Equipment

```bash
curl -X GET http://localhost:8080/api/equipment
```

### Update Equipment Status

```bash
curl -X PUT http://localhost:8080/api/equipment/EQ-001/status \
  -H "Content-Type: application/json" \
  -d '{"status": "MAINTENANCE"}'
```

### Register Vendor

```bash
curl -X POST http://localhost:8080/api/vendors \
  -H "Content-Type: application/json" \
  -d '{
    "vendorName": "Tech Equipment Suppliers Inc.",
    "contactEmail": "contact@techequipment.com"
  }'
```

---

## Best Practices for Production

1. **Enable JWT Authentication**: Configure proper JWT authentication for all API endpoints
2. **Use HTTPS**: Always use HTTPS in production environments
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **API Versioning**: Consider versioning your API (e.g., `/api/v1/equipment`)
5. **Logging**: Enable comprehensive logging for audit trails
6. **Monitoring**: Use the Actuator endpoints for monitoring and health checks
7. **Database**: Use connection pooling and optimize database queries
8. **Error Handling**: Implement comprehensive error handling and validation
9. **Documentation**: Keep API documentation up-to-date with code changes
10. **Testing**: Write comprehensive integration and unit tests

---

## Additional Resources

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI Spec**: http://localhost:8080/api-docs
- **Health Check**: http://localhost:8080/actuator/health
- **Application Info**: http://localhost:8080/actuator/info

---

## Support

For issues or questions, please contact:

- **Email**: support@equipmenttracking.com
- **GitHub**: https://github.com/Vishnu-9293/Equipment-Tracking-System-Microservice

---

**Version**: 1.0.0  
**Last Updated**: January 2026
