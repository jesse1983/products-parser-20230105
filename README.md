# Products Parser

## Description

This project aims to support the nutritionist team at Fitness Foods LC by enabling them to quickly review the nutritional information of foods that users post through the mobile application.

The service includes a module for importing data and a REST API to expose this data.

## Technology

The following technologies were used:

- NodeJS (Server)
- Typescript (language)
- NestJS (framework)
- MongoDB (NoSQL database)
- Docker (containerization)
- Jest (testing library)
- Cron (task scheduling)
- Eslint (code quality)
- Open API (documentation)

## Usage

### Minimum requirements
- Docker and Docker Compose

### Installation
- Download the repository
- Run `docker compose up`
- Access http://localhost:3000/api for documentation
- Access http://localhost:8081/ with user root / 12345678 to access MongoDB data

### Environments variables
- **MONGODB_URI**: MongoDB URI
- **OPEN_FOODS_FILES_URL**: List of files URL
- **OPEN_FOODS_JSON_URL**: List of products URL
- **OPEN_FOODS_MAX_ROWS**: Max of rows to importing per file
- **NOTIFY_PUBLISH_URL**: Channel URL to publish
- **MIGRATING_CRON**: Cron express to run importing

## Contribute

### Minimum requirements
- Node 18+
- Docker and Docker Compose
- Yarn

### Installation
- Download the repository
- Run `yarn`
- Start a container with Mongo and Mongo Express using `docker compose up -d mongo mongo-express`
- Rename the `.env.example` file to `.env`
- Run `yarn start:dev`

### Tests
The tests are End-to-End, running directly on the endpoints. To run them:
- Start a container with Mongo using `docker compose up -d mongo`
- Run `yarn test`

## TODO

- Consider using ElasticSearch for more elaborate searches with keywords and aggregations
- Increase coverage to 100%
- Add migration with events using RabbitMQ, Kafka or Redis (BullMQ)
- Improve error messages in the REST API

-------

> This is a challenge by [Coodesh](https://coodesh.com/)