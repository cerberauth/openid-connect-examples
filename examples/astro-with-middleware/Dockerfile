FROM node:jod AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM node:jod-alpine

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 astro

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder --chown=astro:nodejs /app/dist /app/dist

USER astro

EXPOSE 3000

ENV PORT=3000
ENV HOST=0.0.0.0

CMD ["node", "dist/server/entry.mjs"]
