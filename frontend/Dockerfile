# --- Stage 1: Build the React Application ---
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# --- Stage 2: Serve the build files using Nginx ---
FROM nginx:1.25-alpine

# Copy the built assets from Stage 1 into Nginx web root directory
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Copy the custom Nginx server configuration block
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
