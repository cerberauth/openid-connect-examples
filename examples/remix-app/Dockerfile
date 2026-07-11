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

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 remix

COPY --from=builder --chown=remix:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=remix:nodejs /app/build ./build
COPY --from=builder --chown=remix:nodejs /app/package.json ./package.json

USER remix

EXPOSE 3000

ENV PORT 3000
ENV HOST "0.0.0.0"

CMD ["npm", "run", "start"]
