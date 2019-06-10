const express = require('express');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const Player = require('./Player.js');
const Game = require('./Loby.js');

app.use(express.static(__dirname + "/public"));

/* Create object to store all joining players */
var players = {};

io.on('connection', function(socket) {
    var pid = socket.id; // Get id of new connected client
    players[pid] = new Player; // Create a new Player in the players obj
    console.log("user %s initialized", pid);
    if (Object.keys(players).length == 1) {
        console.log("new player is first, setting VIP");
        players[pid].isVip = true;
    }

    /* On client disconnected */
    socket.on('disconnect', function() {
        console.log('user %s disconnected', pid);

        /* check if player leaving was VIP */
        var needNewVip = false;
        if (players[pid].isVip) {
            needNewVip = true;
        }

        /* delete player from players obj */
        delete players[pid];

        /* check if last player, or if need new VIP */
        if (Object.keys(players).length == 0) {
            console.log("!! leaving player was the last player");
        } else if (needNewVip) {
            console.log("! leaving player was VIP, setting new one")
            players[Object.keys(players)[0]].isVip = true;
        }
    });

    socket.on('set name', function(data) {
        console.log("setting new name for %s: %s", pid, data.newName);
        /* Set the new name for the Player in the players obj */
        players[pid].name = data.newName;

        /* Tell that player they're all set, wait for game start */
        socket.emit('readyStart');
    });
});

/* Start listening on the provided port */
//var port = Math.floor(Math.random() * (9999 - 1000)) + 1000;
var port = 8888;
http.listen(port, function() {
    console.log("listening on *:" + port);
});
