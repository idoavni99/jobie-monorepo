# Base Node.js image
FROM node:23-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy service source (expecting each service to mount its own folder context at build time)
COPY . .

# Install only production dependencies
RUN npm install --only=production

# Expose port dynamically via build-time ARG
ARG SERVICE_PORT=3000
ENV PORT=$SERVICE_PORT
EXPOSE $SERVICE_PORT

# Default command (can be overridden in docker-compose)
CMD ["node", "dist/main.js"]