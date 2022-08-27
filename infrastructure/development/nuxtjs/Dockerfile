FROM node:12.16.1

RUN apt-get update && apt-get install -y vim

WORKDIR /app

COPY ./app/package*.json ./

RUN yarn install

ENV HOST=0.0.0.0 PORT=3000

EXPOSE ${PORT}

CMD yarn dev
