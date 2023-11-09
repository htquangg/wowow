ARG NODE_VERSION=18.18.0
ARG NODE_VERSION_ALPINE=18.18.0-alpine

# Stage 1: Build
FROM node:${NODE_VERSION} as build

WORKDIR /wow/backend

COPY package.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

# Stage 2: Install dependency 
FROM node:${NODE_VERSION} as dependency

WORKDIR /wow/backend

COPY --from=build /wow/backend/package.json .

RUN npm install --omit=dev --legacy-peer-deps

# Stage 3:  Run app
FROM node:${NODE_VERSION_ALPINE} as production

WORKDIR /wow/backend

ENV NODE_ENV production

COPY --from=dependency /wow/backend/package.json .
COPY --from=dependency /wow/backend/node_modules ./node_modules
COPY --from=build /wow/backend/dist ./dist
COPY --from=build /wow/backend/.env.docker .env

ENV PORT=50000

EXPOSE ${PORT}

CMD [ "node", "--max-semi-space-size=128", "./dist/index.grpc.js" ]
