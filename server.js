const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const Player = require('./Player-server.js');

app.use(express.static(__dirname + "/wordspud-app"));

/* Create object to store all joining players */
var players = {};

io.on('connection', function(socket) {
    var pid = socket.id; // Get id of new connected client
    players[pid] = new Player; // Create a new Player in the players obj
    console.log("user %s initialized", pid);

    /* On client disconnected */
    socket.on('disconnect', function() {
        console.log('user %s disconnected', pid);
        delete players[pid]; // Delete player from players obj
    });

    socket.on('set name', function(data) {
        console.log("setting new name for %s: %s", pid, data.newName);
        players[pid].name = data.newName;
    });
});

/* Start listening on the provided port */
//var port = Math.floor(Math.random() * (9999 - 1000)) + 1000;
var port = 3000;
http.listen(port, function() {
    console.log("listening on *:" + port);
});