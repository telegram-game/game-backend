# LiveVPNConfigManager
* *Service name:* game-api-service
* *Framework:* NestJS
* *DatabaseORM:* Prisma

# Source code structure
```
├── README.md
├── nest-cli.json
├── yarn.lock
├── package.json
├── prisma
├── src
│   ├── app.module.ts
│   ├── main.ts
│   ├── config
│       ├── configuration.ts
│       └── validation.ts
│   ├── constants (for service constants)
│   ├── decorators (for some decorators)
│   ├── exceptions (exception modoles)
│   ├── filters (middleware for error handler)
│   ├── interceptors (service interceptors)
│   ├── interfaces (for the service interfaces)
│   ├── middlewares (service middlewares)
│   ├── models (some service common models)
│   ├── modules
│       ├── health
│       ├── http
│       ├── loggers
│       ├── prisma (prisma service)
│       ├── shared (the folder to define the shared services)
│       └── ... (domain modules)
│   ├── types
│   ├── utils
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── migrations.sh
├── Dockerfile
└── tsconfig.json
```

# ENV(s)
## Common configuration
|Name|Description|Default value|
|---|---|---|
|ENVIRONMENT| The environment of the server(local,development,qa,staging,prodution)|local|
|TZ|The timezone of the service|UTC|
|LOG_LEVEL|The log level of the service (error,warn,debug,info)|info|
|PORT|The service port|3000|
|HTTP_REQUEST_TIMEOUT|The http request timeout for all internal requests|10000|
|CONFIG_MANAGER_SERVICE_URL|The config manager service url|http://localhost:3000|
## The API Service
|Name|Description|Default value|
|---|---|---|
|APP_NAME=**GAME_API**|The specific app name|API|
|POSTGRESQL_USER| user of postgres db||
|POSTGRESQL_PASSWORD| password of postgres db||
|POSTGRESQL_HOST| host of postgres db||
|POSTGRESQL_DB| postgres db||
|POSTGRESQL_PORT| port of postgres db||
|REDIS_MODE| client or cluster|client|
|REDIS_HOST| client redis host|localhost|
|REDIS_PORT| client redis port|6379|
|REDIS_CLUSTER_NODES| The list of redis node in cluster mode. Split by comma.||
|IGNORE_AUTH_GUARD|Ignore auth guard check|true|
|JWT_ACCESS_TOKEN_PRIVATE_KEY| The private key to sign access token ||
|JWT_ACCESS_TOKEN_PUBLIC_KEY| The public key to verify access token ||
|JWT_REFRESH_TOKEN_PRIVATE_KEY| The private key to sign refresh token ||
|JWT_REFRESH_TOKEN_PUBLIC_KEY| The public key to verify refresh token ||

# How to install dependencies
## For dev
```
$ yarn install
```
## For production
```
$ yarn install --frozen-lockfile 
```

# How to create/ apply new migration
## Create new migration
```
$ ./migration.sh <migration_name>
```
## Apply the migration
```
$ set -o allexport && source .env
$ ./migrate/run.sh
```
Note: Please setup the `DATABASE_URL` point to the database engine we want to migrate

# How to run the service
* Copy the `.env.example` to `.env` and config the env environment
* Install the dependencies
* Install prisma client 
    ```
    $ npx prisma generate
    ```
* Run the command to run the service
    ```
    $ yarn start:dev
    ```

# How to run the unit test / coverage test
## Unit test
```
$ yarn test
```

## Coverage test
```
$ yarn test:cov
```

## Run in container (docker)
### Build the docker image
```
$ docker build -t game-api-image .
```
### Run docker container
## The GAME_API Service
```
$ docker run --name=game-api --env=APP_NAME=GAME_API --env=TZ=UTC --env=NODE_ENV=development --env=PORT=3000 --env=POSTGRESQL_USER="postgres" --env=POSTGRESQL_PASSWORD="postgres" --env=POSTGRESQL_PASSWORD="postgres" --env=POSTGRESQL_HOST="localhost" --env=POSTGRESQL_DB=livevpn-db --env=POSTGRESQL_PORT=5432 --env=REDIS_MODE="client" --env=REDIS_HOST="localhost" --env=REDIS_PORT=6379 -p 3000:3000 -d game-api-image
```

## Run the migration in container (docker)
### Build the docker image
```
$ docker build -t lvpn-config-manager-migration-image -f migrate/Dockerfile .
```
### Run migration docker container
```
$ docker run --name=lvpn-game-api-migration --env=POSTGRESQL_USER="postgres" --env=POSTGRESQL_PASSWORD="postgres" --env=POSTGRESQL_PASSWORD="postgres" --env=POSTGRESQL_HOST="localhost" --env=POSTGRESQL_DB=livevpn-db --env=POSTGRESQL_PORT=5432  -d lvpn-config-manager-migration-image



```