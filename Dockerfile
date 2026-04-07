FROM node:20-bookworm-slim

# Instalar openssl (requerido por Prisma)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . /app

WORKDIR /app/backend

RUN npm install --production=false && npx tsc && npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]
