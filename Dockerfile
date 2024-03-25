# Build stage with Maven and OpenJDK
FROM maven:3-openjdk-15 as build
COPY pom.xml .
RUN mvn dependency:go-offline
COPY . .
RUN mvn clean package -DskipTests

# Final stage with only JRE and our built JAR
FROM openjdk:15.0.2-jdk-slim
COPY --from=build /target/demo-0.0.1-SNAPSHOT.jar demo.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","demo.jar"]
