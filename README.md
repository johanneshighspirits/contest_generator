# Contest Generator
### _Create a simple 1X2 contest_
__Contest Generator__ is an app that will generate all files needed for a simple web based competition. Fill in the form with your questions, either in 1X2 format (with alternatives) or as text questions.

All answers, along with _contestant name_, _email_ etc. will be saved in a database.

To draw random winners and see how many contestants have participated, an overview page will be included as well. From this page, you will also be able to download `*.csv` files with all contestant information.

## Requirements
* A remote server running `php`
* `Node.js` installed locally

## Setup
Clone this repo to your computer and install dependencies
```bash
$ git clone https://github.com/johanneshighspirits/contest_generator.git contest_generator
$ cd contest_generator
$ npm install
```
Modify these three files by replacing the default variables with the correct values.

* `/dist/contests/db.php`
* `/src/modules/config.js`
* `/src/modules/translations.js`

## Test
Start testing server from the command line:
```bash
$ node server.js
```
Opening `http://localhost:9999` in a browser will give a local preview.

To watch for changes in the source files using watchify:
```bash
$ npm run watch
```

## Deploy
Compile javascript
```bash
$ npm run build
```
Put all files in `/dist` on your server.

