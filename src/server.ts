import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';

// DATABASE

const { Pool, Client } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'hackeps',
  password: 'admin',
  port: 5432,
})

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'hackeps',
  password: 'admin',
  port: 5432,
})


const app = express();


//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {

    //connection is up, let's add a simple simple event
    ws.on('message', async (message: string) => {

        //log the received message and send it back to the client
        console.log('received: %s', message);
        ws.send(`Hello, you sent -> ${message}`);
        
        client.connect(function(err:any){
          if(err) throw err;
          client.query("SELECT * FROM public.\"Geometria\"", function(err:any, result:any, fields:any){
            if (err) throw err;
            console.log(result);
          })
        })
  
    });

    //send immediatly a feedback to the incoming connection    
    ws.send('Hi there, I am a WebSocket server');
});

//start our server
server.listen(process.env.PORT || 8999, () => {
    console.log('Server started on port a' + server.address()?.toString());
});


