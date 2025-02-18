import { io } from 'socket.io-client';
const socket = io('http://localhost:3001');

// Socket `notification_received` event handler.
socket.on('notification_received', (notificationData) => {
  console.log('notification data :::>', notificationData);
});

function getQueryStringParameter(paramToRetrieve: string) {
  const params = document.URL.split('#')[0].split('?')[1].split('&');

  for (let i = 0; i < params.length; i++) {
    const singleParam = params[i].split('=');

    if (singleParam[0] === paramToRetrieve) return singleParam[1];
  }
  return null;
}
