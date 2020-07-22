FROM node:14.5.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
COPY . .
RUN npm run client:build

ENV DB="ec2-54-70-200-101.us-west-2.compute.amazonaws.com"
ENV PORT=80
ENV USER="postgres"

EXPOSE 80
CMD [ "npm", "run", "server:prod" ]
