# --- Stage 1: Build app ---
FROM node:20-alpine AS builder

# Cài đặt Yarn 1.22.22 (phiên bản classic)
RUN corepack disable && npm install -g yarn@1.22.22

WORKDIR /app

# Copy file cấu hình
COPY package.json yarn.lock ./

# Cài đặt dependencies với Yarn 1.22.22
RUN yarn install --frozen-lockfile

# Copy toàn bộ source
COPY . .

# Build Next.js app
RUN yarn build


# --- Stage 2: Run app ---
FROM node:20-alpine AS runner

RUN corepack disable && npm install -g yarn@1.22.22

WORKDIR /app

# Copy các file cần thiết từ stage build
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

# Cài production dependencies
RUN yarn install --production --frozen-lockfile && yarn add typescript

EXPOSE 3000

CMD ["yarn", "start"]
