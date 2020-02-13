FROM golang:1.13 as certs

RUN apt-get update && apt-get install libnss3-tools -y

RUN git clone https://github.com/FiloSottile/mkcert && \
    cd mkcert && \
    go build -ldflags "-X main.Version=$(git describe --tags)" -o /bin/mkcert

WORKDIR /certs
ENV CAROOT /certs

RUN mkcert -install
RUN mkcert -key-file key.pem -cert-file cert.pem josephduffy.local

RUN ls -al /certs
RUN mkcert -CAROOT

FROM node:12 AS build

ARG GITHUB_OAUTH_TOKEN
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY components components
COPY data data
COPY layouts layouts
COPY models models
COPY pages pages
COPY public public
COPY custom.d.ts .
COPY next-env.d.ts .
COPY next.config.js .
COPY tsconfig.json .

RUN npm run build
RUN npm run export

FROM nginx:alpine

COPY --from=build /app/out/ /var/www/
COPY --from=certs /certs /etc/nginx/certs/
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
EXPOSE 443
