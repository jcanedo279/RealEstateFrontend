# Stage 1: Build the React application
FROM node:14 AS build
WORKDIR /app

# Change directory to the app subdirectory where the correct package.json is located
COPY app/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your frontend application
COPY app/ ./

# Run the build script defined in the correct package.json
RUN npm run build

# Stage 2: Serve the app with NGINX
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
