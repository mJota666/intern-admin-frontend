# Use an official Node.js image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Copy TypeScript configuration files
COPY tsconfig*.json ./

# Copy the rest of your application files into the container
COPY . .

# Clean the node_modules if they exist
RUN rm -rf node_modules

# Install dependencies inside the container
RUN npm install --legacy-peer-deps

# Build the admin frontend
RUN npm run build

# Install a simple static file server globally
RUN npm install -g serve

# Expose port 8081 for the admin frontend
EXPOSE 8081

# Command to serve the app using the "serve" command on port 8081
CMD ["serve", "-s", "build", "-l", "8081"]
