# Build stage with Maven and OpenJDK
FROM maven:3-openjdk-15 as build

# Set the working directory inside the container to the backend project
WORKDIR /app

# First, copy the Maven wrapper and pom.xml only to fetch dependencies
COPY ProjectSync-backend/mvnw ProjectSync-backend/mvnw.cmd ProjectSync-backend/.mvn /app/.mvn/
COPY ProjectSync-backend/pom.xml /app/

# Optional: If your project depends on other modules or specific files outside the backend directory, copy them as needed

# Get all dependencies
RUN ./mvnw dependency:go-offline

# Copy the rest of the project
COPY ProjectSync-backend/src /app/src

# Package the application
RUN ./mvnw clean package -DskipTests

# Final stage with just the JRE and the built JAR file
FROM openjdk:15.0.2-jdk-slim
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
