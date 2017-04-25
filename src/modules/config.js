/* This is your root URL. Relative or absolute */
var rootURL = "/";

/**
For identical contests running in different countries, you
have the opportunity to create them all at the same time.
NOTE: This is just a list of all possible languages, when 
creating the actual contest, you will be asked to choose 
one or more.
*/
var possibleLanguages = [
  "SE", 
  "NO", 
  "DK", 
  "FI"
];

module.exports = {
	possibleLanguages: possibleLanguages,
  rootURL: rootURL
};