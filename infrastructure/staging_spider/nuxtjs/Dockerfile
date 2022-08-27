FROM node:12.16.1

RUN apt-get update && apt-get install -y vim

WORKDIR /app

COPY ./app ./

RUN yarn install

ENV HOST=0.0.0.0 PORT=3000 NODE_ENV=staging

EXPOSE ${PORT}

RUN yarn build

CMD node server/index.js
