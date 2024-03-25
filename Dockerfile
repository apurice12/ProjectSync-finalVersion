# Use Maven and OpenJDK base image for the build stage
FROM maven:3.8.4-openjdk-15 as build

# Set the working directory in the Docker image
WORKDIR /app

# Copy the Maven wrapper files
COPY ProjectSync-backend/.mvn /app/.mvn
COPY ProjectSync-backend/mvnw /app/mvnw

# Make sure the Maven wrapper is executable
RUN chmod +x /app/mvnw

# Copy the Maven POM file and source code
COPY ProjectSync-backend/pom.xml /app/pom.xml
COPY ProjectSync-backend/src /app/src

# Use the Maven wrapper to install dependencies and package the application
RUN ./mvnw clean package -DskipTests

# Use OpenJDK base image for the final stage
FROM openjdk:15.0.2-jdk-slim

# Copy the JAR file from the build stage to the final image
COPY --from=build /app/target/*.jar /app/app.jar

# Expose the port the application runs on
EXPOSE 8080

# Set the entry point to run the application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
