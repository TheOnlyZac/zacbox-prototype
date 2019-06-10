const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const Player = require('./Player.js');
const Game = require('./Game.js');

app.use(express.static(__dirname + "/public"));

/* Create new WordSpudGame instance */
game = new Game();

io.on('connection', function(socket) {
    /* Get ID of new connected client and send it to them */
    var pid = socket.id;
    socket.emit('you are', pid)
    socket.emit('set phase', 0);

    /* Send all the existing players to the new player */
    var oldPlayers = game.playerIds;
    //console.log("oldPlayers: " + oldPlayers);
    for (var i = 0; i < oldPlayers.length; i++) {
        console.log(game.getPlayer(oldPlayers[i]));
        socket.emit('add player', {
            "id": game.getPlayer(oldPlayers[i]).id,
            "name": game.getPlayer(oldPlayers[i]).name
        });
    }

    /* Send the current VIP id to ALL players */
    io.sockets.emit('set vip', game.vip);

    /* On client disconnected */
    socket.on('disconnect', function() {
        /* Remove the player from the Game lobby */
        game.removePlayer(pid);

        /* Tell all clients to remove the disconnected player */
        io.sockets.emit('remove player', pid)

        /* Send the current VIP id to ALL players */
        io.sockets.emit('set vip', game.vip);
    });

    /* After player enters their name */
    socket.on('log in', function(newName) {
        /* Add the new Player to the lobby with their proper name */
        game.addPlayer(pid, newName)

        /* Send the new player to ALL clients */
        io.sockets.emit('add player', {
            "id": pid,
            "name": newName
        });

        /* Send the current VIP id to ALL players */
        io.sockets.emit('set vip', game.vip);

        /* Tell that player they're all set, wait for game start */
        socket.emit('set phase', 1);

        /* Check if everyone is ready */
        if (game.numPlayers == 2 && game.isReady) {
            /* All ready, set phase to game start! */
            socket.emit('set phase', 2);
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
