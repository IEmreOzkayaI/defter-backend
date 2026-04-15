FROM node:20-alpine AS base

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@8.14.1 --activate

FROM base AS deps

COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

FROM deps AS build

COPY . .
RUN pnpm run build

FROM base AS prod-deps

COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

FROM node:20-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000
CMD ["node", "dist/main.js"]