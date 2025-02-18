# yesboss

## Project Architecture

The project is divided into 2 main parts:

- **server**
- **client**

The client is also divided into 2 parts:

- **mobile**
- **web**

## Prerequisites

- Node version _20.17.0_
- Yarn
- Docker

### FRONT

#### Mobile

In the `client/mobile` folder:

You need to copy the content of the `env.example` file into a `.env` file.

If this is the first time you are launching the project,

you need to run `yarn install`.

Then, go to the `ios` folder and run the command `pod install`.

Next, run the command `yarn start` to start the Metro server.

After that, in another terminal, run the command `yarn ios` to

launch the application on your iOS smartphone.

#### Web

In the `client/Web/yesboss` folder:

You need to copy the content of the `env.staging` file into a `.env` file.

If this is the first time you are launching the project,

you need to run `yarn install`.

Then, to launch the web application, simply run the command `yarn start`.

### BACK

In the `server` folder:

You need to copy the `env.example` file into a `.env` file.

Then, build the Docker containers:

    docker-compose build

To start the app, run the command:

    docker-compose up -d

### To reset everything

    docker-compose rm -sf
    docker-compose build api graphql
    docker-compose up -d

### For logs inside the graphql container

    docker-compose logs -f graphql

### MIGRATION

# Create but do not apply the migration in dev (make sure the postgres container is running)

    yarn migrate:create

# To create & apply the migration in dev (make sure all containers are running)

    yarn migrate:dev

# To seed the data (make sure all containers are running)

    yarn seed

# Migration in production

    yarn migrate

##### OUTLOOK

For environment changes, modify the value of:

- `OUTLOOK_ADMIN_EMAIL`
- `OUTLOOK_ADMIN_PASSWORD`
- `OUTLOOK_ADMIN_TENANT_ID`
- `OAUTH_APP_ID`
- `OAUTH_APP_SECRET`
- `OAUTH_AUTHORITY`

in your `server/graphql/.env` file and modify the value of

`OUTLOOK_APP_ID` in your `client/mobile/.env` file with the appropriate value.

##### GOOGLE

For environment changes, replace the content of the `server/graphql/services-accounts.json` file

with your own.