# Build stage (optional if you prefer to copy the fat JAR)
FROM eclipse-temurin:17-jdk-jammy as build
WORKDIR /workspace
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml pom.xml
# copy only sources to enable layer caching
COPY src src
RUN ./mvnw -B -DskipTests package

# Run stage
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY --from=build /workspace/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
