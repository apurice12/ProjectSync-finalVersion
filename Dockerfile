FROM maven:3-openjdk-15 AS build
COPY . .

run amazoncorretto:15 java -version
COPY ProjectSync-backend/target/demo-0.0.1-SNAPSHOT.jar demo.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "demo.jar"]
