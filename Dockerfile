# Use the official Node.js image as the base image
FROM node:18:slim

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Angular app
RUN npm run build --development

# Use a lightweight web server to serve the Angular app
FROM nginx:alpine
COPY --from=0 /app/dist/your-angular-app /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start the web server
CMD ["nginx", "-g", "daemon off;"]