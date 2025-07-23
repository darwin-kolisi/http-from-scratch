import * as net from 'net';

const port = 1234;

function newConn(socket: net.Socket): void {
  const clientAddress = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log(`[${clientAddress}] CLIENT CONNECTED`);

  // handle the connection
  socket.on('data', (data: Buffer) => {
    console.log(`[${clientAddress}] RECEIVED: ${data.toString().trim()}`);
    socket.write(data); // echo back the data

    if (data.includes('q')) {
      console.log('closing');
      socket.end();
    }
  });

  // client-side error
  socket.on('error', (err) => {
    console.error(`[${clientAddress}] CLIENT CONNECTION ERROR:`, err);
  });

  socket.on('end', () => {
    console.log(`[${clientAddress}] CLIENT DISCONNECTED`);
  });
}

let server = net.createServer();
server.on('error', (err: Error) => { 
  console.error('SERVER ERROR:', err);
  throw err; 
});
server.on('connection', newConn);
server.listen({ host: '127.0.0.1', port }, () => {
  console.log(`TCP Echo Server is running and listening 127.0.0.1 ${port}`);
});