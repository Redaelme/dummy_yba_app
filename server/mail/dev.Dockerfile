FROM node:12-alpine

WORKDIR /graphql

RUN apk update && apk add --no-cache python3 make g++ git bash coreutils

COPY package.json /graphql/package.json
COPY yarn.lock /graphql/

# Install packages
RUN yarn install

COPY . /graphql/

EXPOSE 4000
EXPOSE 9229

ENV POSTGRES_PORT 5432

CMD  yarn start:dev
