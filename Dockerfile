FROM node:alpine

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

RUN npm run build

CMD [ "npm", "run", "start", "--", "-p", "80" ]
