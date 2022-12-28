FROM node:16-alpine as base

WORKDIR /home/node/app

COPY package.json ./

FROM base as development
RUN npm install
COPY . .

FROM base as production
RUN npm install --only=production
COPY . .
RUN tsc 


EXPOSE 5050