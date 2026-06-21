# Use lightweight Node 18 Alpine image for the backend
FROM node:18-alpine

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
