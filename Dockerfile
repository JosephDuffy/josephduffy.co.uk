# Based on the example Docker setup: https://github.com/vercel/next.js/tree/canary/examples/with-docker

FROM node:22.17.0-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# Required for swc when building
RUN npm ci && npm install @next/swc-linux-x64-gnu --no-save

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
ENV NODE_ENV=production

ARG BUILD_DATE
ENV NEXT_PUBLIC_BUILD_DATE=$BUILD_DATE

ARG GIT_COMMIT
ENV NEXT_PUBLIC_GIT_COMMIT=$GIT_COMMIT

ARG WEBSITE_URL
ENV WEBSITE_URL=$WEBSITE_URL

ARG HCAPTCHA_SITE_KEY
ENV NEXT_PUBLIC_HCAPTCHA_SITE_KEY=$HCAPTCHA_SITE_KEY

RUN --mount=type=secret,id=GITHUB_ACCESS_TOKEN,required npm run build
# Remove non-dev dependencies
RUN npm ci

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/data ./data
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

ENV NEXT_TELEMETRY_DISABLED=1

ARG BUILD_DATE
ENV NEXT_PUBLIC_BUILD_DATE=$BUILD_DATE

ARG GIT_COMMIT
ENV NEXT_PUBLIC_GIT_COMMIT=$GIT_COMMIT

ARG WEBSITE_URL
ENV WEBSITE_URL=$WEBSITE_URL

ARG HCAPTCHA_SITE_KEY
ENV NEXT_PUBLIC_HCAPTCHA_SITE_KEY=$HCAPTCHA_SITE_KEY

CMD ["node", "server.js"]
