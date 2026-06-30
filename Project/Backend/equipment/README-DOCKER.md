# Equipment Service - Docker instructions

This README explains how to build and run the Equipment service using Docker and docker-compose.

Prerequisites

- Docker (Desktop) installed and running
- (Optional) If you prefer to build locally without Docker, Java 17 and Maven are required

Build & run using docker-compose (recommended)

1. From the `equipment` module folder, build and start services:

```powershell
# builds the app image (Dockerfile runs mvnw package) and starts MySQL and app
docker-compose up --build
```

2. The service will be available at http://localhost:8080
   - Health: http://localhost:8080/actuator/health (if actuator is enabled)
   - API endpoints: e.g. GET /api/equipment

If you prefer to build the JAR first and then run the image manually:

```powershell
# from equipment folder
./mvnw -DskipTests package
docker build -t equipment-app:local .
docker run --rm -p 8080:8080 --env SPRING_DATASOURCE_URL="jdbc:mysql://host.docker.internal:3306/equipment_db?createDatabaseIfNotExist=true" equipment-app:local
```

Notes

- The docker-compose file creates a MySQL container with database `equipment_db` and root password `root`. Adjust credentials as needed.
- If you run MySQL on the host already, update `SPRING_DATASOURCE_URL` or stop the host MySQL to allow the container to bind port 3306.
