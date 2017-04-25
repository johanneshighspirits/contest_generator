var connect = require('connect');
var serveStatic = require('serve-static');
var app = connect();
app
  .use("/images/PC/kampanj/contest/", serveStatic(__dirname + "/placeholderImgs"))
  .use("/images/PC/kampanj/osterrike0416/", serveStatic(__dirname + "/placeholderImgs"))
  .use("/css/", serveStatic(__dirname + "/src/css"))
  .use(serveStatic(__dirname + "/dist"))
  .use("/", serveStatic(__dirname + "/dist"))
  .listen(9999, function(){
    console.log('Server running on 9999');
});