# yesboss

## Architecture du projet

Le projet est decoupé en 2 parties principales

- **server**
- **client**

Le client lui aussi est divisé en 2 parties

- **mobile**
- **web**

## Prerequisites

- Node version _14.X.X_
- Yarn
- Docker

### FRONT

#### Mobile

Dans le dossier `client/mobile`:

Il faut copier le contenu du fichier env.example dans un fichier .env

Après si c'est pour la première fois que vous alliez lancer le projet,

vous devez faire un `yarn install`.

Puis vous exécuter la commande `yarn start` pour lancer le serveur metro.

Après dans un autre terminal vous faite la commande `yarn android` pour

lancer l'application sur votre smartphone android.

#### Web

Dans le dossier `client/Web/yesboss`:

Il faut copier le contenu du fichier env.staging dans un fichier .env

Après si c'est pour la première fois que vous alliez lancer le projet,

vous devez faire un `yarn install`.

Puis pour lancer l'application web vous exécuter tout simplement la commande `yarn start`.

### BACK

Dans `server`:

Il faut copier le fichier .env.example danns un fichier .env

Ensuite, builder les containers docker :

    docker-compose build

Ensuite pour demarrer l'app, il faut lancer la commande

    docker-compose up -d

### Pour tout réinitialiser

    docker-compose rm -sf
    docker-compose build api graphql
    docker-compose up -d

### Pour les logs à l'intérieur du conteneur graphql

    docker-compose logs -f graphql

### MIGRATION

# Créer mais ne pas appliquer la migration en dev (s'assurer que le conteneur postgres est en marche)

    yarn migrate:create

# Pour créer && appliquer la migration en dev (Assurez-vous que tous les conteneurs sont en marche)

    yarn migrate:dev

# Pour amorcer les données (s'assurer que tous les conteneurs sont en marche)

    yarn seed

# Migration sur la production

    yarn migrate

##### OUTLOOK

Pour les changements d'environnement modifier la valeur de:

- `OUTLOOK_ADMIN_EMAIL`
- `OUTLOOK_ADMIN_PASSWORD`
- `OUTLOOK_ADMIN_TENANT_ID`
- `OAUTH_APP_ID`
- `OAUTH_APP_SECRET`
- `OAUTH_AUTHORITY`

dans votre fichier server/graphql/.env et modifiez la valeur de

`OUTLOOK_APP_ID` dans votre fichier client/mobile/.env avec la valeur appropriée.

##### GOOGLE

Pour les changements d'environnement remplacer le contenu du fichier `server/graphql/services-accounts.json`

par le votre.
