# Latitude
An open-source experiment in system design, intending to scale the database and server layers of the listing description widget for an online homestay marketplace.

## Start the application for development
 - npm install
 - npm run seed
 - npm run client:dev
 - npm run server

## System requirements
 - Node v10.20.1
 - MongoDB v4.2.7
 - Nodemon v2.0.4

## API

To get an individual listing:
  - Base URL: http://localhost:3000
  - Endpoint: /api/description/:id
  - Method: GET
  - Data: {}
  - Success response:
    - Condition: If listing ID exists
    - Status code: 200 OK
    - Content: JSON object. For example:
        {
          "id": 12345,
          "listingId": "001",
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

## noSQL schema design under consideration
{
  id: number,
  listingId: string,
  user: {
    userId: number,
    name: string,
    image: string
  },
  title: string,
  body: string,
  guests: number,
  bedrooms: number,
  beds: number,
  publicBaths: number,
  privateBaths: number,
  sleepingArrangements: [
    {
      id: number,
      beds: {
        type: string,
        amount: number,
      },
      location: string,
    }
  ],
  amenities: [
    {
      id: number,
      type: string,
      amenity: string,
      description: string
    }
  ]
}

## SQL schema design under consideration

See SQL Schema Design file saved in the root of this repository.