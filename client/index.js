const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
  socket.on('location', msg => {
    io.emit('location', msg);
  });
  socket.on('homePosition', msg => {
    io.emit('homePosition', msg);
  });
  socket.on('schoolPosition', msg => {
    io.emit('schoolPosition', msg);
  });
  socket.on('bike', msg => {
    io.emit('bike', msg);
  });
  socket.on('weather', msg => {
    io.emit('weather', msg);
  });
  socket.on('airPollution', msg => {
    io.emit('airPollution', msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
