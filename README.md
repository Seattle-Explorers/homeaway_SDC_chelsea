# Latitude
An open-source experiment in system design, intending to scale the database and server layers of the description service for a preexisting room reservation app.

## Start the application
 - 'npm install'
 - 'npm run client:dev' (development) || 'npm run client:build' (production)
 - Add New Relic config file with license key, filename 'newrelic.js' (as named in .gitignore), or remove New Relic reference in server.js
 - 'npm run server' (development) || 'npm run server:prod-no-seed' (production)
  - Environment variables:
    - PORT | Port number for server; defaults to 3000
    - DB | PostgreSQL database host URL; defaults to 'localhost'
    - USER | PostgreSQL database user; defaults to 'chelseaschmidt'
    - PW | PostgreSQL database password; defaults to ''

## System requirements
 - Node v10.20.1
 - Nodemon v2.0.4

## API

To get an individual listing:
  - Endpoint: /api/description/:id
  - Method: GET
  - Data: {}
  - Success response:
    - Condition: If listing ID exists
    - Status code: 200 OK
    - Content: JSON object. For example:
        {
          "id": 12345,
          "listingId": "00000001",
          "user": {
            "userId": 67891,
            "name": "Jane Doe",
            "image": "http://janedoeimage.com",
          },
          "title": "Great place to stay",
          "body": "What a great place to stay",
          "guests": 2,
          "bedrooms": 1,
          "beds": 1,
          "publicBaths": 1,
          "privateBaths": 1,
          "sleepingArrangements": [
            {
              "id": 15691,
              "beds": {
                "type": "Queen",
                "amount": 1,
              }
              "location": "Bedroom1",
            }
          ],
          "amenities": [
            {
              "id": 63901,
              "type": "Dining",
              "amenity": "Stove",
              "description": "A stove for cooking",
            }
          ]
        }
  - Error response:
    - Condition: If listing ID doesn't exist
    - Status code: 404 NOT FOUND
    - Content: {}
