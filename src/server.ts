import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { Observable, of, Subscriber } from 'rxjs';
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

const con = client.connect()

const app = express();

const clients = [];


//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {
    
    //connection is up, let's add a simple simple event
    ws.on('message', async (message: string) => {

        console.log('received: %s', message);
        let message_array = message.split('=')
        switch(message_array[0]){
          case "Altura":{
            update("Altura", message_array[1])
            break
          }
          case "Amplada":{
            update("Amplada", message_array[1])
            break
          }
          case "RotacioX":{
            update("RotacioX", message_array[1])
            break
          }
          case "RotacioY":{
            update("RotacioY", message_array[1])
            break
          }
          case "Animacio":{
            update("Animacio", message_array[1])
            break
          }
          case "Llargada":{
            update("Llargada", message_array[1])
            break
          }
          case "Color":{
            console.log(message_array[1])
            update("Color", message_array[1])
            break
          }
        }  
        broadcast_updated_info()
    });

    //send immediatly a feedback to the incoming connection

    getAll().subscribe(data => ws.send(data))
});

//start our server
server.listen(process.env.PORT || 8999, () => {
    console.log('Server started on port a' + server.address()?.toString());
});

function update(column: string, value: any){
  client.query(`UPDATE public."Geometria" SET "` + column + `"='` + value +`';`, function(err:any, result:any, fields:any){
    if (err) throw err;
  })
}
/*  
function getAll(){
  client.query("SELECT * FROM public.\"Geometria\"", function(err:any, result:any, fields:any){
    if (err) throw err;
    console.log(JSON.stringify(result.rows[0]))
    return JSON.stringify(result.rows[0]); 
  })
}*/

function getAll() : Observable<any>{
  let observable = new Observable(subscriber => {
    client.query("SELECT * FROM public.\"Geometria\"", function(err:any, result:any, fields:any){
      if (err) throw err;
      console.log(JSON.stringify(result.rows[0]))
      subscriber.next(JSON.stringify(result.rows[0])); 
    })
  })
  return observable;
}

function broadcast_updated_info(){
  wss.clients.forEach(client => {
    getAll().subscribe(data => client.send(data))
  })
}
