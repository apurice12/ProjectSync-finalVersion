# Stage 0: Prepare the Node.js and build the React Application
FROM node:21 as react-build

# Set the working directory in the Docker image
WORKDIR /app/frontend

# Copy the React app files into the container
COPY ./frontend/package.json ./path/to/your/react-app/package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of your frontend app
COPY ./frontend/ ./

# Build the React app
RUN npm run build

# Stage 1: Build the Java application using JDK 15
FROM openjdk:15.0.2 AS java-build

# Manually download and install Maven
ENV MAVEN_VERSION 3.6.3
RUN mkdir -p /usr/share/maven /usr/share/maven/ref \
  && curl -fsSL https://archive.apache.org/dist/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.tar.gz \
  | tar -xzC /usr/share/maven --strip-components=1 \
  && ln -s /usr/share/maven/bin/mvn /usr/bin/mvn

ENV MAVEN_HOME /usr/share/maven
ENV MAVEN_CONFIG "$USER_HOME_DIR/.m2"

# Set the working directory in the Docker image
WORKDIR /app

# Copy the project files into the container
COPY ProjectSync-backend/pom.xml .

# Download all dependencies
RUN mvn dependency:go-offline

# Copy the rest of the application source
COPY ProjectSync-backend/src src

# Build the application without running tests
RUN mvn clean package -DskipTests

# Stage 2: Create the final image
FROM openjdk:15.0.2-jdk-slim

WORKDIR /app

# Copy the JAR file from the Java build stage
COPY --from=java-build /app/target/*.jar app.jar

# Copy the React build artifacts from the React build stage to the static directory
# Adjust the target directory according to where your backend serves static files from
COPY --from=react-build /app/frontend/build /path/to/static/content

# Expose the port the application listens on
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
