# frontend/Dockerfile

# === 1) Build Stage: use Node to compile the Vite app ===
FROM node:18-alpine AS build

# Create a working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your source code
COPY . .

# Build the production bundle
RUN npm run build

# === 2) Production Stage: serve files with Nginx ===
FROM nginx:alpine

# Copy build output from the build stage to the Nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 in the container
EXPOSE 80

# Launch Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
