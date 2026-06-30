# TODO List for Spring Boot REST API Microservice

## Completed Tasks
- [x] Update pom.xml with necessary dependencies (SpringDoc OpenAPI, ModelMapper)
- [x] Create directory structure for the project
- [x] Create DTOs (PerformanceMetricRequest, PerformanceMetricResponse, AlertRequest, AlertResponse, GroupedAlertResponse)
- [x] Create Entities (PerformanceMetric, Alert)
- [x] Create Repositories (PerformanceMetricRepository, AlertRepository)
- [x] Create Services (PerformanceMetricService, AlertService)
- [x] Create Controllers (PerformanceMetricController, AlertController)
- [x] Create Exception Handler (GlobalExceptionHandler)
- [x] Create Configuration (ModelMapperConfig, OpenApiConfig)
- [x] Update application.properties with database and other settings
- [x] Update main application class with OpenAPI definition
- [x] Compile the project successfully

## Remaining Tasks
- [x] Test the application by running it - SUCCESSFULLY STARTED
- [ ] Verify API endpoints using Swagger UI
- [ ] Check database connectivity and schema creation
- [ ] Test validation and exception handling
- [ ] Ensure all mappings work correctly with ModelMapper

## Notes
- The microservice is designed to handle performance metrics and alerts for equipment monitoring.
- Endpoints include CRUD operations for performance metrics and alerts.
- Validation is implemented using Bean Validation annotations.
- Exception handling is centralized in GlobalExceptionHandler.
- API documentation is available via Swagger/OpenAPI.
- Logging is implemented using SLF4J.
- Project compiled successfully with BUILD SUCCESS.
- Fixed Hibernate dialect issue (changed from MySQL8Dialect to MySQLDialect for Hibernate 7.x compatibility).
