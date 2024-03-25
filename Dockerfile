# Stage 1: Build the frontend
FROM node:21.6.1 as frontend-build
WORKDIR /frontend
# Copy frontend source
COPY frontend/ .
# Install dependencies and build
RUN npm install && npm run build

# Stage 2: Set up the backend
FROM openjdk:15 as backend-build
WORKDIR /ProjectSync-backend
# Copy backend jar
COPY ProjectSync-backend/project-sync-exe.jar .

# Stage 3: Nginx to serve the frontend
FROM nginx:alpine
# Copy frontend build from stage 1
COPY --from=frontend-build /frontend/build /usr/share/nginx/html
# Remove default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf
# You can add your custom nginx.conf if you have any specific configurations
# COPY your-nginx.conf /etc/nginx/conf.d/

# Copy backend jar from stage 2
COPY --from=backend-build ProjectSync-backend/project-sync.jar /app/backend/project-sync-exe.jar

# Start command
CMD sh -c "java -jar ProjectSync-backend/target/project-sync-exe.jar & nginx -g 'daemon off;'"
