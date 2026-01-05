FROM node:20-alpine AS builder

WORKDIR /app

ARG APPLICATION_PORT=8080
ENV APPLICATION_PORT=${APPLICATION_PORT}

EXPOSE ${APPLICATION_PORT}

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist

EXPOSE ${APPLICATION_PORT}

CMD ["node", "dist/src/main"]