# Latitude
An open-source experiment in system design, intending to scale the database and server layers of the description service for a preexisting room reservation app.

## System requirements
 - Node 10.20.1
 - npm package manager
 - Nodemon 2.0.4
 - PostgreSQL 12.3

## Start the application
 - npm install
 - npm run client:dev || npm run client:build
 - Add New Relic config file with license key, filename 'newrelic.js' (as named in .gitignore), or remove New Relic reference in server.js
 - npm run server:prod-no-seed || npm run server
  - Environment variables:
    - PORT | Port number for server; defaults to 3000
    - DB | PostgreSQL database host URL; defaults to 'localhost'
    - USER | PostgreSQL database user; defaults to 'chelseaschmidt'
    - PW | PostgreSQL database password; defaults to ''

## API

To get an individual listing:
  - Endpoint: /api/description/:id
  - Method: GET
  - Data: {}
  - Success response:
    - Condition: If listing ID exists
    - Status code: 200 OK
    - Content: JSON object with listing information for targeted ID
  - Error response:
    - Condition: If listing ID doesn't exist
    - Status code: 404 NOT FOUND
    - Content: {}
