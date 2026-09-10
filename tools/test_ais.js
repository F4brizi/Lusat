const WebSocket = require('ws');

const socket = new WebSocket('wss://stream.aisstream.io/v0/stream');

socket.on('open', function open() {
  console.log('Connected to AisStream');
  const subscriptionMessage = {
    APIKey: "INVALID_KEY",
    BoundingBoxes: [[[-60.0, -85.0], [15.0, -30.0]]]
  };
  socket.send(JSON.stringify(subscriptionMessage));
});

socket.on('message', function message(data) {
  console.log('received: %s', data);
});

socket.on('error', function error(err) {
  console.error('Error:', err);
});

socket.on('close', function close(code, reason) {
  console.log('Closed:', code, reason.toString());
});
