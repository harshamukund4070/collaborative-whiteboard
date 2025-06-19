const express = require('express');
const app = express();
const http = require('http').createServer(app);
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server: http });

app.use(express.static('public'));

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    // broadcast to all other clients
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });
});

http.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
