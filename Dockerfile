FROM node:12

RUN mkdir /app
ENV NODE_ENV production
EXPOSE 80

WORKDIR /app

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

ARG GITHUB_ACCESS_TOKEN

RUN npm run build

ENV GITHUB_ACCESS_TOKEN=${GITHUB_ACCESS_TOKEN}

CMD [ "npm", "run", "start", "--", "-p", "80" ]
