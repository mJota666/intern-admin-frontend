# ─── Builder Stage ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps, cached until package*.json changes
COPY package*.json tsconfig*.json ./
RUN npm ci

# Copy source & build
COPY . .
RUN npm run build

# ─── Runtime Stage ────────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime
WORKDIR /app

# Only copy production files
COPY --from=builder /app/dist ./dist

# Install static file server
RUN npm install -g serve

EXPOSE 8081
CMD ["serve", "-s", "dist", "-l", "8081"]
