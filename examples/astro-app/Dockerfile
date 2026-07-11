FROM node:jod AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build && \
    npm prune --production

FROM node:jod-alpine

WORKDIR /app

ENV NODE_ENV production
ENV HOST 0.0.0.0
ENV PORT 4321

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 astro

COPY --from=builder --chown=astro:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=astro:nodejs /app/dist ./dist
COPY --from=builder --chown=astro:nodejs /app/package.json ./package.json

USER astro

EXPOSE 4321

CMD ["npm", "run", "start"]
