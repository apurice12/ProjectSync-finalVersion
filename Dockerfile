# Stage 1: Build the application using JDK 15
FROM openjdk:15.0.2 AS build

# Install Maven
RUN apt-get update && \
    apt-get install -y maven

# Set the working directory in the Docker image
WORKDIR /app

# Copy the project files into the container
COPY ProjectSync-backend/pom.xml .

# Download all dependencies
RUN mvn dependency:go-offline

# Copy the rest of the application source
COPY ProjectSync-backend/src src

# Build the application without running tests
RUN mvn clean package -DskipTests

# Stage 2: Create the final image
FROM openjdk:15.0.2-jdk-slim

WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port the application listens on
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
