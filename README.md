# Latitude: Description Service
Refactor of an existing Description microservice as part of prototyping a system architecture able to handle production-level web traffic, for a service-oriented room reservation app. The Description service shows descriptive details about each available room listing.

## System requirements
  - Node 10.20.1
  - npm package manager
  - Nodemon 2.0.4
  - PostgreSQL 12.3

## Seed PostgreSQL with demo data

#### 1. Create tables without indexes
CREATE TABLE amenities (<br/>
&nbsp;&nbsp;id TEXT,<br/>
&nbsp;&nbsp;type TEXT NOT NULL,<br/>
&nbsp;&nbsp;amenity TEXT NOT NULL<br/>
);

CREATE TABLE users (<br/>
&nbsp;&nbsp;userId TEXT,<br/>
&nbsp;&nbsp;name TEXT NOT NULL,<br/>
&nbsp;&nbsp;image TEXT NOT NULL<br/>
);

CREATE TABLE listings (<br/>
&nbsp;&nbsp;listingId CHAR(8),<br/>
&nbsp;&nbsp;user_id TEXT NOT NULL,<br/>
&nbsp;&nbsp;title TEXT NOT NULL,<br/>
&nbsp;&nbsp;body TEXT NOT NULL,<br/>
&nbsp;&nbsp;guests INT NOT NULL,<br/>
&nbsp;&nbsp;publicBaths INT NOT NULL,<br/>
&nbsp;&nbsp;privateBaths INT NOT NULL,<br/>
&nbsp;&nbsp;bedrooms INT NOT NULL,<br/>
&nbsp;&nbsp;beds INT NOT NULL,<br/>
&nbsp;&nbsp;sleepingArrangements JSONB NOT NULL<br/>
);

CREATE TABLE amenities_listings (<br/>
&nbsp;&nbsp;id TEXT,<br/>
&nbsp;&nbsp;amenity_id TEXT NOT NULL,<br/>
&nbsp;&nbsp;listing_id CHAR(8) NOT NULL,<br/>
&nbsp;&nbsp;description TEXT<br/>
);

#### 2. Generate CSVs with demo data
npm run seedpsql
  - This script will generate four CSV files in ../../../latitude_db_files

  - To change the directory where CSV files will be saved, update the *pathForGeneratedFiles* variable in db/seed2.0/seedpsql.js

  - To change the number of records generated, update the *targetedRecords* variable in db/seed2.0/seedpsql.js. By default, this script will generate 10M primary room listing records, which equates to over 100M records across the four SQL tables.

#### 3. Copy demo data from CSV files into PostgreSQL
COPY amenities FROM '&lt;file path&gt;' WITH (FORMAT CSV, HEADER TRUE)<br/>
COPY users FROM '&lt;file path&gt;' WITH (FORMAT CSV, HEADER TRUE)<br/>
COPY listings FROM '&lt;file path&gt;' WITH (FORMAT CSV, HEADER TRUE)<br/>
COPY amenities_listings FROM '&lt;file path&gt;' WITH (FORMAT CSV, HEADER TRUE)<br/>

#### 4. Add indexes to tables
ALTER TABLE amenities ADD PRIMARY KEY (id);<br/>
ALTER TABLE users ADD PRIMARY KEY (userId);<br/>
ALTER TABLE listings ADD PRIMARY KEY (listingId);<br/>
ALTER TABLE amenities_listings ADD PRIMARY KEY (id);<br/>

ALTER TABLE listings ADD FOREIGN KEY (user_id) REFERENCES users (userId);<br/>
ALTER TABLE amenities_listings ADD FOREIGN KEY (amenity_id) REFERENCES amenities (id);<br/>
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
