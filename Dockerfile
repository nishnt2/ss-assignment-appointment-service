FROM node:20-alpine3.18

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./

COPY . .

RUN pnpm install

EXPOSE 3002

CMD ["pnpm", "start"]
