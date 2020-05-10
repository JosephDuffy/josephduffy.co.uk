# syntax=docker/dockerfile:experimental

FROM node:12 as builder

RUN mkdir /app
ENV NODE_ENV production
WORKDIR /build

COPY package*.json ./

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm ci

COPY components components
COPY data data
COPY layouts layouts
COPY models models
COPY pages pages
COPY public public
COPY next-env.d.ts .
COPY next.config.js .
COPY tsconfig.json .

ARG GIT_COMMIT
ENV NEXT_PUBLIC_GIT_COMMIT=$GIT_COMMIT
ARG BUILD_DATE
ENV NEXT_PUBLIC_BUILD_DATE=$BUILD_DATE

RUN --mount=type=secret,id=GITHUB_ACCESS_TOKEN,required npm run build

FROM node:12-alpine

RUN mkdir /app
ENV NODE_ENV production
EXPOSE 80
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY --from=builder /build/.next .next
COPY --from=builder /build/public public
COPY nginx-include .

ARG GIT_COMMIT
ENV NEXT_PUBLIC_GIT_COMMIT=$GIT_COMMIT
ARG BUILD_DATE
ENV NEXT_PUBLIC_BUILD_DATE=$BUILD_DATE

CMD [ "npm", "run", "start", "--", "-p", "80" ]
