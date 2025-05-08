FROM node:20

WORKDIR /app

# 1) Copy only lockfiles and install
COPY package*.json ./
RUN npm ci

# 2) Copy source & build
COPY . .
RUN npm run build

# 3) Install serve & expose
RUN npm install -g serve
EXPOSE 8081
CMD ["serve", "-s", "dist", "-l", "8081"]
