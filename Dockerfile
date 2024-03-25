# Stage 1: Build the application
FROM maven:3.8.4-openjdk-11 AS build

# Set the working directory in the Docker image
WORKDIR /app

# Copy Maven wrapper and pom.xml file
COPY ProjectSync-backend/.mvn /app/.mvn
COPY ProjectSync-backend/mvnw /app/
COPY ProjectSync-backend/pom.xml /app/

# Ensure the Maven wrapper is executable
RUN chmod +x /app/mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline

# Copy the project source
COPY ProjectSync-backend/src /app/src

# Package the application
RUN ./mvnw clean package -DskipTests

# Stage 2: Create the Docker final image
FROM openjdk:15.0.2-jdk-slim

# Copy the JAR file from the build stage
COPY --from=build /app/target/*.jar /app/app.jar

# Expose the port the application listens on
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
