var connect = require('connect');
var serveStatic = require('serve-static');
// connect().use(serveStatic(__dirname)).listen(9999, function(){
//     console.log('Server running on 9999');
// });
var app = connect();
app
  .use("/images/PC/kampanj/contest/", serveStatic(__dirname + "/placeholderImgs"))
  .use("/css/", serveStatic(__dirname + "/src/css"))
  .use("/images/PC/kampanj/osterrike0416/", serveStatic(__dirname + "/placeholderImgs"))
  .use(serveStatic(__dirname + "/dist"))
  .use("/", serveStatic(__dirname + "/dist"))
  .listen(9999, function(){
    console.log('Server running on 9999');
});