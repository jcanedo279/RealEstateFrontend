# Stage 1: Build the React application
FROM node:14.17.0 AS build
WORKDIR /app

# Copy package.json and install dependencies
COPY app/package*.json ./
RUN npm install --production

# Copy the rest of your frontend application
COPY app/ ./

# Copy the .env file into the container
COPY .env ./

# Run the build script defined in the correct package.json
RUN npm run build

# Stage 2: Serve the app
FROM node:14.17.0 AS serve
WORKDIR /app

# Copy the built files from the previous stage
COPY --from=build /app/build ./build

# Install serve module locally
RUN npm install -g serve

# Expose port 80 for HTTP traffic
EXPOSE 80

# Define the command to start the HTTP server
CMD ["serve", "-s", "build", "-l", "80"]
