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
// DATABASE
const { Pool, Client } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'hackeps',
    password: 'admin',
    port: 5432,
});
pool.query('SELECT NOW()', (err, res) => {
    console.log(err, res);
    pool.end();
});
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'hackeps',
    password: 'admin',
    port: 5432,
});
const app = express();
//initialize a simple http server
const server = http.createServer(app);
//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
    //connection is up, let's add a simple simple event
    ws.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
        //log the received message and send it back to the client
        console.log('received: %s', message);
        ws.send(`Hello, you sent -> ${message}`);
        client.connect(function (err) {
            if (err)
                throw err;
            client.query("SELECT * FROM public.\"Geometria\"", function (err, result, fields) {
                if (err)
                    throw err;
                console.log(result);
            });
        });
        console.log("hola");
    }));
    //send immediatly a feedback to the incoming connection    
    ws.send('Hi there, I am a WebSocket server');
});
//start our server
server.listen(process.env.PORT || 8999, () => {
    var _a;
    console.log('Server started on port a' + ((_a = server.address()) === null || _a === void 0 ? void 0 : _a.toString()));
});
//# sourceMappingURL=server.js.map