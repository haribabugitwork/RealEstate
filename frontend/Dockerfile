FROM node:18-alpine as build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY public ./public
COPY src ./src
RUN npm run build

FROM nginx:alpine

# Copy build artifacts
COPY --from=build /app/build /usr/share/nginx/html

# Override default nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
