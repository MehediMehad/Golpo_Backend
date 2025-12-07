# 1) Base image
FROM node:22.12.0

# 2) Working directory
WORKDIR /app

# 3) Copy package files first (better caching)
COPY package*.json ./

# 4) Install deps
RUN npm install

# 5) Copy project files
COPY . .

# 6) Generate Prisma client
RUN npx prisma generate

# 7) Build TypeScript
RUN npm run build

# 8) Run app
CMD ["npm", "run", "start"]

# Expose port
EXPOSE 3001
