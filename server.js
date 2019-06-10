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
    /* Get ID of new connected client */
    var pid = socket.id;
    /* Add the new Player to the lobby */
    game.addPlayer(pid)

    /* On client disconnected */
    socket.on('disconnect', function() {
        game.removePlayer(pid);
    });


    /* Change the name of a player */
    socket.on('set name', function(data) {
        game.nameChange(pid, data.newName);

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
