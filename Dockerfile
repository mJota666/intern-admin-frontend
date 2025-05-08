# ─── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies from lockfile
COPY package*.json ./
RUN npm ci

# Copy source & build
COPY . .
RUN npm run build

# ─── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM nginx:stable-alpine
# Remove default static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from the builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the same port you map in Docker Compose
EXPOSE 8081

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
