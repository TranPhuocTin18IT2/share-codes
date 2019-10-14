var app = require('express')();
var http = require('http').createServer(app);
var Hbs = require('express-handlebars');
var indexRoute = require('./routes/index');
var io = require('socket.io')(http);
// view engine setup
app.engine('.hbs',Hbs({defaultLayout:'layout',extname:'.hbs'}));
app.set('view engine','.hbs');
// connection event for incoming sockets
io.on('connection', function(socket){
  // emit an event to all connected sockets
  io.emit('chat message','A user connected !');
  // listen to the event
  socket.on('chat message', function(msg){
  // emit an event to all connected sockets
    io.emit('chat message',  msg);
  });
  // listent to the event
  socket.on('disconnect',function(){
  // emit an event to all connected sockets
    io.emit('chat message','A user disconnected !');
  });
});
app.use('/',indexRoute);
http.listen(3000,function(){
 console.log('Listening on *:3000');
});





















/* method 2
var app = require('express')();
var http = require('http').createServer(app);

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
*/
