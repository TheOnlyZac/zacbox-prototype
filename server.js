const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const Player = require('./Player-server.js');

app.use(express.static(__dirname + "/public"));

/* create dictionary to store all joining players */
var players = {};

io.on('connection', function(socket) {
    console.log('user connected');
    var pid = socket.id;
    players[pid] = new Player;
    console.log(players);

    socket.on('disconnect', function() {
        console.log('user disconnected');
        delete players[pid];
        console.log(players);
    });

    socket.on('set name', function(newName) {
        console.log(newName);
        players[pid].name = newName;
        console.log(players);
    });
});

/* Start listening on the provided port */
//var port = Math.floor(Math.random() * (9999 - 1000)) + 1000;
var port = 3000;
http.listen(port, function() {
    console.log("listening on *:" + port);
});

function onSocketConnect() {
    console.log('user connected');
}

function onSocketDisconnect() {
    console.log('user disconnected');
}