
# Front-End
1. Install Node.js and npm from https://nodejs.org/en/

1. Navigate inside of project folder and run `npm install`

___

To see a demo of what's currently in this branch, visit https://www.mildvariety.club
To see the database of entries for development/debugging, visit https://www.mildvariety.club/buslog

Current versioning:
*  _npm version 6.4.1_
*  _node version 10.9.0_

## Development server
Run `ng serve` inside of the cloned folder for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build and Deploy
Run `npm run dist` to generate a dist/ folder that holds a BusLog/ folder that can be uploaded to a web server.

## Setup SQL Database
In our case, our main webhost allows us to use phpMyAdmin to create and manage our MySQL database. Currently, we are using Dreamhost for testing and protyping. We have included documents [here](https://github.com/kdesimini/Bus-Shuttle-Log-Collection-System/blob/master/Resources/Create_Database_Dev.sql) to be used to recreate our database.

## Running unit tests
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests
Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
