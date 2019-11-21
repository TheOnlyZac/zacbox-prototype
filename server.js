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
            "name": game.getPlayer(oldPlayers[i]).name,
            "color": game.getPlayer(oldPlayers[i]).color
        });
    }

    /* Send the current VIP id to ALL players */
    io.sockets.emit('set vip', game.vip);

    /* On client disconnected */
    socket.on('disconnect', function() {
        /* Remove the player from the Game lobby */
        game.removePlayer(pid);

        if (io.sockets.connected.length == 0) {
            game.endGame();
            return;
        }
        
        /* Tell all clients to remove the disconnected player */
        io.sockets.emit('remove player', pid)

        /* Send the current VIP id to ALL players */
        io.sockets.emit('set vip', game.vip);

        if (game.currentPlayer == pid) {
            turnOver();
        }
    });

    /* After player enters their name */
    socket.on('log in', function(newName) {
        /* Add the new Player to the lobby with their proper name */
        game.addPlayer(pid, newName);

        /* Send the new player to ALL clients */
        io.sockets.emit('add player', {
            "id": game.getPlayer(pid).id,
            "name": game.getPlayer(pid).name,
            "color": game.getPlayer(pid).color
        });

        /* Send the current VIP id to ALL players */
        io.sockets.emit('set vip', game.vip);

        /* Tell that player they're all set, wait for game start */
        if (game.started) {
            socket.emit('set phase', 2);
        } else {
            socket.emit('set phase', 1);
        }
    });

    socket.on('check vip', function() {
        if (game.getPlayer(pid).isVip) socket.emit('vip status', true);
        else socket.emit('vip status', false);
    });
    
    socket.on('start game', function() {
        game.startGame();

        io.sockets.emit('spud add', {
            'spudText': game.wordSpud[0].word,
            'color': 'white'
        })

        io.sockets.emit('set phase', 2);

        turnOver();
    });

    socket.on('live type', function(newText) {
        if (pid == game.currentPlayer) {
            io.sockets.emit('set word2', {
                'newText': newText,
                'color': game.players[game.currentPlayer].color
            });
        }
    });

    socket.on('spud submit', function(spudText) {
        game.addSpud(spudText, game.players[game.currentPlayer].color);
        io.sockets.emit('spud add', {
            'spudText': spudText,
            'color': game.players[game.currentPlayer].color
        })
        turnOver();
    });

    socket.on('pass turn', function() {
        turnOver();
    });

    function turnOver() {
        game.nextPlayer();
        currPlayerId = game.currentPlayer;
        //console.log("currplayer: " + currPlayerId);
        io.sockets.emit('your turn', currPlayerId);
    }
});

/* Start listening on the provided port */
//var port = Math.floor(Math.random() * (9999 - 1000)) + 1000;
var port = 8888;
http.listen(port, function() {
    console.log("listening on *:" + port);
});
