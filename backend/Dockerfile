# Base image with Node.js runtime
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package lists first (leveraging Docker build cache)
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the rest of the backend application code
COPY . .

# Expose the API port
EXPOSE 5000

# Start the Express server
CMD ["node", "server.js"]
