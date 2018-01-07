//server for socket.io
const app = require('express')(); // import and run right-away
const server = require('http').Server(app); // our 'app' is the http server
const io = require('socket.io')(server); // running socket.io on our server
const port = 3000;

server.listen(port, () => {
  console.log('Server is listening on port ' + port);
});

app.get('/', (req,res) => { //runs when we're at this URL(/) which is index.html
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/javascript', (req,res) => { //runs when we're at javascript.html
  res.sendFile(__dirname + '/public/javascript.html');
});

app.get('/swift', (req,res) => { //runs when we're at swift.html
  res.sendFile(__dirname + '/public/swift.html');
});

app.get('/css', (req,res) => { //runs when we're at css.html
  res.sendFile(__dirname + '/public/css.html');
});

/*
When the user connects to the server's socket, event 'connection' starts.
We alert in the console that the user is connected.
The socket runs another event 'message' that makes the socket emit a message.
On another event 'another event' on the socket, we display whatever the data
arrives.
*/

//namespace 'tech'
const tech = io.of('/tech');

tech.on('connection',(socket) => {
  socket.on('join',(data) => {
  	socket.join(data.room);
  	tech.in(data.room).emit('message','New user joined the ' + data.room + ' room!');
  });

  socket.on('message', (data) => {
    console.log('message: ' + data.msg);
    tech.in(data.room).emit('message',data.msg);
  });

  /*
  socket -> related to the client. io -> related to the server.
  So if we see socket.on it means the client initiated the event and  
  if we see io.emit it means the server sends the data to the client.

  io is replaced later with each namespace.
  */
  socket.on('disconnect', () => {
  	console.log('User is disconnected');
  	tech.emit('message','User is disconnected');
  });
});
