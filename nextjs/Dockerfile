# Use Node.js 22-alpine
FROM node:22-alpine as builder

# Set working directory
WORKDIR /app

# Copy the necessary files
COPY package.json package-lock.json cache-handler.mjs  /app/
COPY . /app/

# Install the necessary Node.js packages
RUN set -ex \
    && npm install --force --verbose

# Build the application
RUN npm run build --verbose


### STAGE 2: Production ###

# Use Node.js 22-alpine
FROM node:22-alpine as production
WORKDIR /app
COPY --from=builder /app/next.config.js .
COPY --from=builder /app/cache-handler.mjs .
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set the script as the default command to run on container start
CMD [ "node", "server.js" ]
# Expose port 3000
EXPOSE 3000
