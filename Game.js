const Player = require('./Player.js');

class WordSpudGame {
    constructor() {
        this._players = {};
        this._numPlayers = 0;
    }

    get players() { return this._players; }
    get numPlayers() { return this._numPlayers; }

    /* Add a Player to the _players obj */
    addPlayer(id, name = "Player" + this._numPlayers) {
        this._players[id] = new Player(id, name);
        this._numPlayers++;
    }

    /* Delete a player from the _players obj */
    removePlayer(id) {
        if (this._players[id] == undefined) {
            console.log("Failed to delete player w/ id %s", id);
        } else {
            delete this._players[id];
            this._numPlayers--;
        }
    }

    /* Return an array of playerIds */
    get playerIds() { return Object.keys(_players); }

    /* Check if all players are ready */
    get isReady() {
        /* Iterate over every player */
        for (var i = 0; i < this.playerIds.length; i++) {
            /* Check if current player is NOT ready */
            if (!(_players[this.playerIds[i]].isReady)) {
                /* Someone is not ready, return false */
                return false;
            }
            /* Everyone is ready! */
            return true;
        }
    }
}

module.exports = WordSpudGame;