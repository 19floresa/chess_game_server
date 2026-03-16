
ARG NODE_VERSION=24-alpine


# ========================================
# Base
# ========================================
FROM node:${NODE_VERSION} AS base
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs && \
    chown -R nodejs:nodejs /app

# ========================================
# Dependency Stage
# ========================================
FROM base AS deps
COPY package.json package-lock.json ./

# cache: persistent cache dir that doesnt end up in final build
# target: mount cache
# sharing: share resources but one at a time
RUN --mount=type=cache,target=/root/.npm,sharing=locked && \
    npm ci --omit=dev && \
    npm cache clean --force

# Set proper ownership
RUN chown -R nodejs:nodejs /app

# ========================================
# Build Dependency Stage
# ========================================
FROM base as build-deps
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm ci --no-audit --no-fund && \
    npm cache clean --force

RUN mkdir -p /app/node_modules/.vite && \
    chown -R nodejs:nodejs /app

# ========================================
# Build Stage
# ========================================   
FROM build-deps AS build
COPY --chown=nodejs:nodejs . .
RUN npm run build
RUN chown -R nodejs:nodejs /app

# ========================================
# Development Stage
# ========================================  
FROM build-deps AS development
ENV NODE_ENV=development \
    NPM_CONFIG_LOGLEVEL=warn
COPY . .
RUN mkdir -p /app//node_modules/.vite && \
    chown -R nodejs:nodejs /app && \
    chmor -R 755 /app
USER nodejs
EXPOSE 3056
CMD ["npm", "run", "dev"]

# ========================================
# Production Stage
# ========================================
ARG NODE_VERSION=24-alpine
FROM node:${NODE_VERSION} AS Production
WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs && \
    chown -R nodejs:nodejs /app

ENV NODE_ENV=production \
    NODE_OPTIONS="--max-old-space-size=256 --no-warnings" \
    NPM_CONFIG_LOGLEVEL=silent

COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=deps --chown=nodejs:nodejs /app/package*.json ./
COPY --from=build --chown=nodejs:nodejs /app/dist ./dist

# switch users to non root
USER nodejs

EXPOSE 3056

CMD ["node", "dist/server.js"]


# ========================================
# Test Stage
# ========================================
FROM build-deps AS test

# Set environment
ENV NODE_ENV=test \
    CI=true

# Copy source files
COPY --chown=nodejs:nodejs . .

# Switch to non-root user
USER nodejs

# Run tests with coverage
CMD ["npm", "run", "test:coverage"]