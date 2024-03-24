FROM maven:3-openjdk-15 AS build
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:15.0.2-jdk-slim
COPY --from=build /target/demo-0.0.1-SNAPSHOT.jar demo.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "demo.jar"]
