# Contest Generator
### _Create a simple 1X2 contest_
__Contest Generator__ is an app that will generate all files needed for a simple web based competition. Fill in the form with your questions, either in 1X2 format (with alternatives) or as text questions.

All answers, along with _contestant name_, _email_ etc. will be saved in a database.

To draw random winners and see how many contestants have participated, an overview page will be included as well. From this page, you will also be able to download `*.csv` files with all contestant information.

## Setup
* Clone this repo to your computer.
* Modify `config/config.js` by replacing the default variables with the correct values.

## Requirements
* A server running `php`
* `Node.js` installed locally for previewing purposes

## Test
Start testing server from the command line
```bash
$ node server.js
```
Open `http://localhost:9999` in your browser

## Deploy
Compile javascript
```bash
$ npm run build
```
Upload all files in `/dist` to your server.

