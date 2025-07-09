# services/gateway/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy manifests and install deps
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy service code
COPY . .

# Expose the port your app listens on (3000 internally)
EXPOSE 3000

# Start the gateway
CMD ["npm", "start"]
