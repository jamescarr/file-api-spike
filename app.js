require.paths.unshift(__dirname+'/lib/')

var express = require('express'),
    connect = require('connect'),
    ws = require('./socket')
    
var app = express.createServer();

app.configure(function(){
  app.use(connect.methodOverride());
  app.use(connect.bodyDecoder());
  app.use(app.router);
  app.use(connect.staticProvider(__dirname + '/public'));
  app.set('views', __dirname + '/views');
});


app.get('/', function(req, res){
  res.render('index.haml')
})

app.listen(3000, function(a){
  console.log("started up app server at localhost on port 3000")
  ws.start(3001)
})
