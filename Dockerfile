# Install dependencies only when needed
FROM node:16.13.0-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM node:16.13.0 AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
ENV NODE_ENV production

ARG BUILD_DATE
ENV NEXT_PUBLIC_BUILD_DATE=$BUILD_DATE

ARG GIT_COMMIT
ENV NEXT_PUBLIC_GIT_COMMIT=$GIT_COMMIT

ARG WEBSITE_URL
ENV WEBSITE_URL=$WEBSITE_URL

ARG HCAPTCHA_SITE_KEY
ENV NEXT_PUBLIC_HCAPTCHA_SITE_KEY=$HCAPTCHA_SITE_KEY

RUN npm run build
# Remove non-dev dependencies
RUN npm ci

# Production image, copy all the files and run next
FROM node:16.13.0-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/data ./data
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000

ENV NEXT_TELEMETRY_DISABLED 1

ARG BUILD_DATE
ENV NEXT_PUBLIC_BUILD_DATE=$BUILD_DATE

ARG GIT_COMMIT
ENV NEXT_PUBLIC_GIT_COMMIT=$GIT_COMMIT

ARG WEBSITE_URL
ENV WEBSITE_URL=$WEBSITE_URL

ARG HCAPTCHA_SITE_KEY
ENV NEXT_PUBLIC_HCAPTCHA_SITE_KEY=$HCAPTCHA_SITE_KEY

CMD ["node_modules/.bin/next", "start"]
