FROM node:12-alpine

WORKDIR /graphql

RUN apk update && apk add --no-cache python3 make g++ git bash coreutils

# Install curl and other dependencies for Google Cloud SDK
RUN apk add --no-cache curl

# Add the Google Cloud SDK distribution URI as a package source
RUN echo "http://dl-4.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories && \
    curl -sSL https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-378.0.0-linux-x86_64.tar.gz | tar -xz && \
    ./google-cloud-sdk/install.sh

# Update environment variables to include the Google Cloud SDK
ENV PATH $PATH:/graphql/google-cloud-sdk/bin

COPY package.json /graphql/package.json
COPY yarn.lock /graphql/

# Install packages
RUN yarn install

# Copy the service account key file into the container
COPY ./services-accounts.json /graphql/service-account-file.json

# Set the GOOGLE_APPLICATION_CREDENTIALS environment variable
ENV GOOGLE_APPLICATION_CREDENTIALS="/graphql/service-account-file.json"

COPY . /graphql/

EXPOSE 4000
EXPOSE 4002
EXPOSE 9229

ENV POSTGRES_HOST postgres
ENV POSTGRES_PORT 5432

CMD ./wait-for-it.sh -t 60 -h $POSTGRES_HOST -p $POSTGRES_PORT -- yes | yarn generate && yarn migrate && yarn seed && NODE_OPTIONS="--max-old-space-size=4096" yarn start:dev
