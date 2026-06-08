FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev

COPY public ./public
COPY src ./src
COPY .env.example ./.env.example

RUN mkdir -p /app/storage

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]

