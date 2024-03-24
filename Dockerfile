FROM maven:3-openjdk-15 AS build
COPY . .
RUN mvn -f ProjectSync-backend/pom.xml clean package

FROM amazoncorretto:15
COPY --from=build ProjectSync-backend/target/demo-0.0.1-SNAPSHOT.jar demo.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "demo.jar"]
