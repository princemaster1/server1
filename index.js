const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const { Client } = require('pg');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(cors());

const PUBLIC_URL = 'https://binding-wini-princemaster400.koyeb.app/';
const PORT = process.env.PORT || 8000;
const DATABASE_URL = 'postgres://collins_user:SpkuLYpAsCW0WdJ0niHg0ZrRKqFtxMs5@server1.binding-wini.koyeb/collins';

const maintenanceStatus = { active: false, startTime: null, stopTime: null };

const pgClient = new Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pgClient.connect();

io.on('connection', (socket) => {
  console.log('\x1b[32m%s\x1b[0m', 'User connected');

  socket.emit('maintenanceStatus', maintenanceStatus);

  socket.on('updateMaintenanceStatus', (newStatus) => {
    maintenanceStatus.active = newStatus.active;
    maintenanceStatus.startTime = newStatus.startTime;
    maintenanceStatus.stopTime = newStatus.stopTime;

    io.emit('maintenanceStatus', maintenanceStatus);
  });

  socket.on('disconnect', () => {
    console.log('\x1b[33m%s\x1b[0m', 'User disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
