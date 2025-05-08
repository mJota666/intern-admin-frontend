# ─── Final Image: just serve CI-built files ──────────────────────────────────
FROM node:20-alpine AS runtime
WORKDIR /app

# Copy build output produced by CI (so your workflow must upload it to the build context)
COPY dist/ ./dist

# Install a lightweight static server
RUN npm install -g serve

EXPOSE 8081
CMD ["serve", "-s", "dist", "-l", "8081"]
