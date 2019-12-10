

# Front-End - Driver App
`let me know if you need the usernames and passwords`

Current versioning:
*  _npm: version 6.4.1_
*  _node: version 10.13.0_
___
1. Install Node.js and npm from https://nodejs.org/en/
1. Install Angular CLI from https://angular.io/cli
1. Clone this repository into a folder of your choosing (preferably where you won't have to change permissions)
1. Using Terminal or Command Prompt, navigate inside of project folder and run `npm install` (use `npm ci` instead to avoid package-lock.json: see https://stackoverflow.com/questions/48524417/should-the-package-lock-json-file-be-added-to-gitignore)
## Running a Development Server
(Service worker won't work in the development server)

Run `ng serve --open` inside of the project folder and let the project build and compile . If a browser window does not automatically open, navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Building and Deploying for Production Server
Run `ng build --prod` inside of the project folder. This will generate contents in `dist/BusLog/` that can be uploaded to a web server.

## Building and Deploying for Testing (tbus) Server
Run `ng build --configuration tbus` inside of the project folder. This will generate contents in `dist/BusLog/` that can be uploaded to a web server.

## Setting-Up the SQL Database
We have included the document[here](https://github.com/kdesimini/Bus-Shuttle-Log-Collection-System/blob/master/Resources/Create_Database_Dev.sql) to recreate our database.

## Running Unit Tests
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running End-To-End Tests
Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
___

To see a [list of third party software and licenses used in this project](https://github.com/kdesimini/Bus-Shuttle-Log-Collection-System/blob/master/README.md), visit our main project repository. 
