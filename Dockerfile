# Stage 1: Build the application
FROM maven:3.8.4-openjdk-11 AS build

# Set the working directory in the Docker image
WORKDIR /app

# Optionally specify MAVEN_HOME and MAVEN_CONFIG if you suspect configuration issues
ENV MAVEN_HOME /usr/share/maven
ENV MAVEN_CONFIG "$MAVEN_HOME/conf"

# Copy the project files into the container
COPY ProjectSync-backend/pom.xml .

# Download all dependencies. Use the mvn command directly, ensuring no wrapper-induced issues.
RUN mvn dependency:go-offline

# Copy the rest of the application source
COPY ProjectSync-backend/src src

# Build the application without running tests. Directly use mvn to avoid wrapper issues.
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
