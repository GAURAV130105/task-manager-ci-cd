# ── Security-hardened Node.js backend image ──────────────────
# node:20-alpine is the latest LTS on the smallest OS footprint.
# Upgraded from node:18-alpine to node:20-alpine (fewer known CVEs).
FROM node:20-alpine

# Patch ALL Alpine OS packages to their latest secure versions.
# This eliminates CRITICAL OS-level CVEs (e.g., libssl, libcrypto)
RUN apk update && apk upgrade --no-cache

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package files first (Docker caches this layer if package.json is unchanged)
COPY package*.json ./

# Install only production dependencies (skip devDependencies like nodemon)
RUN npm install --omit=dev

# Copy all remaining backend source files
COPY . .

# Expose the port the Express server listens on
EXPOSE 5000

# Start the Node.js server
CMD ["node", "server.js"]
