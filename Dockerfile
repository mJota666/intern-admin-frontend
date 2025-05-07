# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container
COPY . .

# Install dependencies
RUN npm install

# Build the frontend for production
RUN npm run build

# Serve the frontend (e.g., using a static server like serve)
RUN npm install -g serve

# Expose the frontend port
EXPOSE 8081

CMD ["serve", "-s", "build", "-l", "8081"]
