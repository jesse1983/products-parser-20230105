FROM node:22-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

FROM node:22-alpine
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
RUN mkdir ./downloads

EXPOSE 3000
CMD [ "node", "dist/main" ]