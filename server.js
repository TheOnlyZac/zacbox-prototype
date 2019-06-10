const express = require('express');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const Player = require('./Player.js');
const Game = require('./Game.js');

app.use(express.static(__dirname + "/public"));

/* Create new WordSpugGame instance */
game = new Game();

io.on('connection', function(socket) {
    /* Get ID of new connected client and send it to them */
    var pid = socket.id;
    socket.emit('you are', pid)

    /* Add the new Player to the lobby */
    game.addPlayer(pid)

    /* Send the current VIP id to ALL players */
    io.sockets.emit('set vip', game.vip);

    /* On client disconnected */
    socket.on('disconnect', function() {
        /* Remove the player from the Game lobby */
        game.removePlayer(pid);

        /* Send the current VIP id to ALL players */
        io.sockets.emit('set vip', game.vip);
    });

    /* Change the name of a player */
    socket.on('set name', function(newName) {
        /* Change the Player name in the Game lobby */
        game.nameChange(pid, newName);

        /* Send the new player to ALL clients */
        io.sockets.emit('add player', {
            "id": pid,
            "name": newName
        });

        /* Tell that player they're all set, wait for game start */
        socket.emit('setPhase', 1);

        /* Check if everyone is ready */
        if (game.numPlayers == 2 && game.isReady) {
            /* All ready, set phase to game start! */
            socket.emit('setPhase', 2);
        }
    });

    socket.on('check vip', function() {
        if (game.getPlayer(pid).isVip) socket.emit('vip status', true);
        else socket.emit('vip status', false);
    })
});

/* Start listening on the provided port */
//var port = Math.floor(Math.random() * (9999 - 1000)) + 1000;
var port = 8888;
http.listen(port, function() {
    console.log("listening on *:" + port);
});
