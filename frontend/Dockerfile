# ── Stage 1: Build the React app ──────────────────────────────
# Use Node 20 (required by Vite 6.x)
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package files first (this layer is cached by Docker if package.json doesn't change)
COPY package*.json ./

# Install all dependencies (including dev dependencies needed for the build)
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the React app — outputs to /app/dist
RUN npm run build

# ── Stage 2: Serve with Nginx ──────────────────────────────────
# Start fresh from a tiny Nginx image — no Node.js, no source code
FROM nginx:1.25-alpine

# Copy the compiled static files from the builder stage into Nginx's web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom Nginx config (handles SPA routing + /api/ reverse proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for HTTP traffic
EXPOSE 80

# Start Nginx in the foreground (required for Docker containers)
CMD ["nginx", "-g", "daemon off;"]
