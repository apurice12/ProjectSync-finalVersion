FROM maven:3-openjdk-15 as build
WORKDIR /app

# Copy the Maven wrapper and pom.xml
COPY ProjectSync-backend/.mvn .mvn
COPY ProjectSync-backend/mvnw mvnw
COPY ProjectSync-backend/pom.xml .

# Ensure mvnw is executable
RUN chmod +x ./mvnw

# Get all dependencies
RUN ./mvnw dependency:go-offline

# Copy your project source
COPY ProjectSync-backend/src src

# Build your project
RUN ./mvnw clean package -DskipTests

FROM openjdk:15.0.2-jdk-slim
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
