# 1. Temel image
FROM node:18-alpine AS builder

# 2. Çalışma dizini oluştur
WORKDIR /app

# 3. Bağımlılıkları yükle
COPY package.json package-lock.json* ./
RUN npm install

# 4. Projeyi kopyala ve build et
COPY . .
RUN npm run build

# 5. Production için daha küçük bir image
FROM node:18-alpine AS runner

WORKDIR /app

# Gerekli sadece build edilen dosyaları kopyala
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Set default environment variables
ENV NEXTAUTH_SECRET=super-secret-default-key-23924
ENV NEXTAUTH_URL=http://localhost:3000

EXPOSE 3000

CMD ["npm", "start"]
