
FROM openjdk:15.0.2 AS build


ENV MAVEN_VERSION 3.6.3
RUN mkdir -p /usr/share/maven /usr/share/maven/ref \
  && curl -fsSL https://archive.apache.org/dist/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.tar.gz \
  | tar -xzC /usr/share/maven --strip-components=1 \
  && ln -s /usr/share/maven/bin/mvn /usr/bin/mvn

ENV MAVEN_HOME /usr/share/maven
ENV MAVEN_CONFIG "$USER_HOME_DIR/.m2"


WORKDIR /app

COPY ProjectSync-backend/pom.xml .


RUN mvn dependency:go-offline


COPY ProjectSync-backend/src src


RUN mvn clean package -DskipTests

FROM openjdk:15.0.2-jdk-slim

WORKDIR /app


COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080


ENTRYPOINT ["java", "-jar", "app.jar"]
