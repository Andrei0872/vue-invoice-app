FROM node:14-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci --production


FROM node:14-alpine

WORKDIR /app

# This is to know what code is running in production.
ARG GIT_COMMIT=unspecified
LABEL git_commit="${GIT_COMMIT}"

USER node

COPY --chown=node:node --from=build /app/node_modules /app/node_modules