# Stage 1: Build the application
FROM maven:3.8.4-openjdk-11 AS build

# Set the working directory in the Docker image
WORKDIR /app

# Copy only the pom.xml initially to leverage Docker cache
COPY ProjectSync-backend/pom.xml .

# Download all dependencies
RUN mvn dependency:go-offline

# Copy the Maven Wrapper and project source
COPY ProjectSync-backend/.mvn .mvn
COPY ProjectSync-backend/mvnw .
COPY ProjectSync-backend/src src

# Ensure the Maven wrapper is executable
RUN chmod +x mvnw

# Package the application without running tests using the wrapper
RUN ./mvnw clean package -DskipTests

# Stage 2: Create the Docker final image
FROM openjdk:15.0.2-jdk-slim

# Set the working directory in the Docker image
WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port the application listens on
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
