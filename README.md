# Latitude: Description Service
Prototype of a system architecture designed to handle production-level web traffic, refactoring a preexisting Description microservice of a service-oriented room reservation app. The Description service shows descriptive details about each available room listing.

## System requirements
  - Node 10.20.1
  - npm package manager
  - Nodemon 2.0.4
  - PostgreSQL 12.3

## Start the application
  - Add New Relic config file with license key, filename 'newrelic.js' (as named in .gitignore), or remove New Relic reference in server/server.js
  - npm install
  - npm run client:dev || npm run client:build
  - npm run server:prod-no-seed || npm run server
  - Environment variables:
    - **PORT |** Port number for server; defaults to 3000
    - **DB |** PostgreSQL database host URL; defaults to 'localhost'
    - **USER |** PostgreSQL database user; defaults to 'chelseaschmidt'
    - **PW |** PostgreSQL database password; defaults to ''
  - Navigate to http://localhost:3000/00000001
    - To toggle between available room listings, change the requested resource in the URL from 00000001 to any ID between 00000002 - 10000000

## API

##### To get an individual listing:
  - **Endpoint:** /api/description/:id
  - **Method:** GET
  - **Data:** {}
  - **Success response:**
    - **Condition:** If listing ID exists
    - **Status code:** 200 OK
    - **Content:** JSON object with listing information for targeted ID
  - **Error response:**
    - **Condition:** If listing ID doesn't exist
    - **Status code:** 404 NOT FOUND
    - **Content:** {}
