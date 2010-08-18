$(function(){
    
  var dropbox = $('#upload').get(0)
  dropbox.addEventListener("dragenter", dragEnter, false);
  dropbox.addEventListener("dragexit", dragExit, false);
  dropbox.addEventListener("dragover", dragOver, false);
  dropbox.addEventListener("drop", drop, false);
})
var conn = new WebSocket("ws://localhost:3001/test")
conn.onmessage = function(evt) {
  console.log('f-' + evt.data);
};

conn.onclose = function() {
  console.log("closed");
};

conn.onopen = function() {
  console.log("opened");
};

var dragEnter = dragExit = dragOver = drop = function(e){
  e.stopPropagation();
  e.preventDefault();
}

var drop = function(e){
  e.stopPropagation();
  e.preventDefault();
  var files = e.dataTransfer.files
  
  if(files.length > 0){
    conn.send('[META]')
    conn.send(JSON.stringify(files[0]))
    var reader = new FileReader();
    reader.readAsBinaryString(files[0])
    reader.onload = function(e){
      conn.send('[DATA]')
      conn.send(reader.result)
    }
  }
}

