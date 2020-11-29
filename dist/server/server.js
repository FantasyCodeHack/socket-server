"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const rxjs_1 = require("rxjs");
// DATABASE
const { Pool, Client } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'hackeps',
    password: 'admin',
    port: 5432,
});
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'hackeps',
    password: 'admin',
    port: 5432,
});
const con = client.connect();
const app = express();
const clients = [];
//initialize a simple http server
const server = http.createServer(app);
//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
    //connection is up, let's add a simple simple event
    ws.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('received: %s', message);
        let message_array = message.split('=');
        switch (message_array[0]) {
            case "Altura": {
                update("Altura", message_array[1]);
                break;
            }
            case "Amplada": {
                update("Amplada", message_array[1]);
                break;
            }
            case "RotacioX": {
                update("RotacioX", message_array[1]);
                break;
            }
            case "RotacioY": {
                update("RotacioY", message_array[1]);
                break;
            }
            case "Animacio": {
                update("Animacio", message_array[1]);
                break;
            }
            case "Llargada": {
                update("Llargada", message_array[1]);
                break;
            }
            case "Color": {
                console.log(message_array[1]);
                update("Color", message_array[1]);
                break;
            }
        }
        broadcast_updated_info();
    }));
    //send immediatly a feedback to the incoming connection
    getAll().subscribe(data => ws.send(data));
});
//start our server
server.listen(process.env.PORT || 8999, () => {
    var _a;
    console.log('Server started on port a' + ((_a = server.address()) === null || _a === void 0 ? void 0 : _a.toString()));
});
function update(column, value) {
    client.query(`UPDATE public."Geometria" SET "` + column + `"='` + value + `';`, function (err, result, fields) {
        if (err)
            throw err;
    });
}
/*
function getAll(){
  client.query("SELECT * FROM public.\"Geometria\"", function(err:any, result:any, fields:any){
    if (err) throw err;
    console.log(JSON.stringify(result.rows[0]))
    return JSON.stringify(result.rows[0]);
  })
}*/
function getAll() {
    let observable = new rxjs_1.Observable(subscriber => {
        client.query("SELECT * FROM public.\"Geometria\"", function (err, result, fields) {
            if (err)
                throw err;
            console.log(JSON.stringify(result.rows[0]));
            subscriber.next(JSON.stringify(result.rows[0]));
        });
    });
    return observable;
}
function broadcast_updated_info() {
    wss.clients.forEach(client => {
        getAll().subscribe(data => client.send(data));
    });
}
//# sourceMappingURL=server.js.map