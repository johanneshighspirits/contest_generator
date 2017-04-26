/* This is your root URL (where the contest generator is uploaded. Relative or absolute */
var rootURL = "/";

/* Discussion:
If iFrame will be on the same domain as the parent editorial,
iFrameDomain and mainDomain can be identical. If however, they're on
different domains, these variables are needed to make the competition
resize itself properly.

This is the domain where you will upload the final competition */
var iFrameDomain = "http://<domain>";
/* This is your main site domain, where the html that contains the iframe resides. */
var mainDomain = "http://<domain>";

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
  rootURL: rootURL,
  iFrameDomain: iFrameDomain,
  mainDomain: mainDomain
};