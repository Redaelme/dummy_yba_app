import express from 'express';
import http from 'http';
import { msalConfiguration, subscriptionConfiguration } from '../../configs/config';
import { Server } from 'socket.io';

const socketServer = http.createServer(express);
export const ioServer = new Server(socketServer, {
  cors: {
    origin: [
      msalConfiguration.redirectUri.substring(0, msalConfiguration.redirectUri.lastIndexOf('/')),
      subscriptionConfiguration.notificationUrl.substring(
        0,
        subscriptionConfiguration.notificationUrl.lastIndexOf('/'),
      ),
    ],
    methods: ['GET', 'POST'],
  },
});

socketServer.listen(3001);

// Socket event
ioServer.on('connection', (socket) => {
  socket.on('create_room', (subscriptionId) => {
    console.log('JOIN SUBSCRIPTION ID');

    socket.join(subscriptionId);
  });
});
