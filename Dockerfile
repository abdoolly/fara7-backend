# FROM node:12.14.0
FROM node:10.16.0

WORKDIR /usr/src

COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn install

COPY . .

CMD [ "yarn","start" ]