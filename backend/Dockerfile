# Prisma 7 + stack requieren Node 24.10+.
FROM node:24.10-alpine AS builder
WORKDIR /app
# Corepack trae Yarn 4; respeta la versión declarada en package.json#packageManager
RUN corepack enable
COPY package.json yarn.lock .yarnrc.yml prisma.config.ts ./
COPY .yarn ./.yarn
COPY prisma ./prisma
RUN yarn install --immutable
COPY . .
# Prisma 7: generate ya no es automático tras instalar; hay que invocarlo explícito.
RUN yarn prisma generate && yarn build

FROM node:24.10-alpine
WORKDIR /app
RUN corepack enable
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/package.json /app/yarn.lock /app/.yarnrc.yml ./
COPY --from=builder /app/.yarn ./.yarn
EXPOSE 3000
CMD ["node", "dist/main.js"]
