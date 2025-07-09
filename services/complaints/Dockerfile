# services/<svc>/Dockerfile
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package manifests & install deps
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy source
COPY . .

# Expose port (you can keep 3000 inside, mapped externally)
EXPOSE 3000

# Start the service
CMD ["npm", "start"]
