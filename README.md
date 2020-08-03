# Latitude: Description Service
Prototype of a system architecture designed to handle production-level web traffic, refactoring a preexisting Description microservice of a service-oriented room reservation app. The Description service shows descriptive details about each available room listing.

## System requirements
  - Node 10.20.1
  - npm package manager
  - Nodemon 2.0.4
  - PostgreSQL 12.3

## Seed PostgreSQL with demo data

#### 1. Create tables without indexes
CREATE TABLE amenities (<br/>
  id TEXT,<br/>
  type TEXT NOT NULL,<br/>
  amenity TEXT NOT NULL<br/>
);

CREATE TABLE users (<br/>
  userId TEXT,<br/>
  name TEXT NOT NULL,<br/>
  image TEXT NOT NULL<br/>
);

CREATE TABLE listings (<br/>
  listingId CHAR(8),<br/>
  user_id TEXT NOT NULL,<br/>
  title TEXT NOT NULL,<br/>
  body TEXT NOT NULL,<br/>
  guests INT NOT NULL,<br/>
  publicBaths INT NOT NULL,<br/>
  privateBaths INT NOT NULL,<br/>
  bedrooms INT NOT NULL,<br/>
  beds INT NOT NULL,<br/>
  sleepingArrangements JSONB NOT NULL<br/>
);

CREATE TABLE amenities_listings (<br/>
  id TEXT,<br/>
  amenity_id TEXT NOT NULL,<br/>
  listing_id CHAR(8) NOT NULL,<br/>
  description TEXT<br/>
);

#### 2. Generate CSVs with demo data
npm run seedpsql
  - This script will generate four CSV files in ../../../latitude_db_files

  - To change the directory where CSV files will be saved, update the *pathForGeneratedFiles* variable in db/seed2.0/seedpsql.js

  - To change the number of records generated, update the *targetedRecords* variable in db/seed2.0/seedpsql.js. By default, this script will generate 10M primary room listing records, which equates to over 100M records across the four SQL tables.

#### 3. Copy demo data from CSV files into PostgreSQL
COPY amenities FROM '&lt;file path&gt;' WITH (FORMAT CSV, HEADER TRUE)
COPY users FROM '&lt;file path&gt;' WITH (FORMAT CSV, HEADER TRUE)
COPY listings FROM '&lt;file path&gt;' WITH (FORMAT CSV, HEADER TRUE)
COPY amenities_listings FROM '&lt;file path&gt;' WITH (FORMAT CSV, HEADER TRUE)

#### 4. Add indexes to tables
ALTER TABLE amenities ADD PRIMARY KEY (id);
ALTER TABLE users ADD PRIMARY KEY (userId);
ALTER TABLE listings ADD PRIMARY KEY (listingId);
ALTER TABLE amenities_listings ADD PRIMARY KEY (id);

ALTER TABLE listings ADD FOREIGN KEY (user_id) REFERENCES users (userId);
ALTER TABLE amenities_listings ADD FOREIGN KEY (amenity_id) REFERENCES amenities (id);
ALTER TABLE amenities_listings ADD FOREIGN KEY (listing_id) REFERENCES listings (listingId);

CREATE INDEX amenities_listings_listingId ON amenities_listings (listing_id) INCLUDE (description, amenity_id);

## Start the application
  - Add New Relic config file with license key, filename 'newrelic.js' (as named in .gitignore), or remove New Relic reference in server/server.js
  - npm install
  - npm run client:dev || npm run client:build
  - npm run server || npm run server:prod
  - Environment variables:
    - **PORT |** Port number for server; defaults to 3000
    - **DB |** PostgreSQL database host URL; defaults to 'localhost'
    - **USER |** PostgreSQL database user; defaults to 'chelseaschmidt'
    - **PW |** PostgreSQL database password; defaults to ''
  - Navigate to http://localhost:3000/00000001
    - To toggle between available room listings, change the requested resource in the URL from 00000001 to any ID between 00000002 - 10000000

## Run front-end tests
  - npm test

## API
##### To view the application in the browser
  - **Endpoint:** /:id
  - **Method:** GET

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
