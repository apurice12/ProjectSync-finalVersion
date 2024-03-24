FROM maven:3-openjdk-15 AS build
COPY . .

FROM amazoncorretto:15
COPY --from=build /target/demo-0.0.1-SNAPSHOT.jar demo.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "demo.jar"]
