var sys = require("sys")
  , fs = require("fs")
  , path = require("path")
  , http = require("http")
  , ws = require('websocket-server');

exports.start = function(port){
  /*-----------------------------------------------
    Spin up our server:
  -----------------------------------------------*/
  var httpServer = http.createServer(function(req, res){});


  var server = ws.createServer({
    debug: true
  }, httpServer);

  server.addListener("listening", function(){
    log("Listening for connections.");
  });

  // Handle WebSocket Requests
  server.addListener("connection", function(conn){
    var currentCommand = '[NONE]'
    var fileMeta = {}
    log("opened connection: "+conn.id);
    
    server.send(conn.id, "Connected as: "+conn.id);
    conn.broadcast("<"+conn.id+"> connected right now!");
    
    conn.addListener("message", function(message){
      if(message[0] == '['){
        currentCommand = message
        server.send(conn.id, "Received command " + message);
      }else{
        if(currentCommand == '[META]') fileMeta = JSON.parse(message)
        else if( currentCommand == '[DATA]'){
          fs.writeFile(__dirname+'/files/'+fileMeta.name, message, function(){
            console.log('file written!')
          })
        }
      }
    });
  });

  server.addListener("close", function(conn){
    log("closed connection: "+conn.id);
    conn.broadcast("<"+conn.id+"> disconnected");
  });
  server.listen(port);
}

var log = function(str){
  console.log(sys.inspect(str))
}
