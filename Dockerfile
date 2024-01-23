FROM node:21-alpine As development

WORKDIR  /usr/src/app

COPY package*.json ./
COPY npm-shrinkwrap.json ./
COPY .npmrc ./

RUN --mount=type=cache,target=/root/.npm \
    npm install --global npm@latest
RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY --chown=node:node . .

CMD ["npm", "start"]

FROM development as builder

RUN npm run build

FROM node:21-alpine as production

ARG APP_ENV=development
ENV NODE_ENV=${APP_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY npm-shrinkwrap.json ./
COPY .npmrc ./

RUN --mount=type=cache,target=/root/.npm \
    npm install --global npm@latest
RUN mkdir -p ./node_modules && chown -R node:node ./node_modules

USER node:node

RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev --omit=optional

COPY --from=builder --chown=node:node /usr/src/app/dist ./dist

EXPOSE 3002

CMD ["node", "dist/main"]
