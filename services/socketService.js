import io from 'socket.io-client';
import constants from '../src/constants.json';

let socket;

//Setup socket
export const setup = (userId) => {
  socket = io.connect(constants.SOCKET_URL, { query: `userId=${userId}` });
}

//Terminate socket
export const terminate = () => {
  socket = null;
}

//On event occured
export const on = (eventName, cb) => {
  socket.on(eventName, cb);
}

//Off event
export const off = (eventName, cb) => {
  socket.off(eventName, cb);
}

//Emit event
export const emit = (eventName, data) => {
  socket.emit(eventName, data);
}