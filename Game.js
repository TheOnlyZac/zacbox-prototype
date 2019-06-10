const Player = require('./Player.js');

class WordSpudGame {
    constructor() {
        this._players = {};
        this._numPlayers = 0;
        this._vipId = null;
    }

    get players() { return this._players; }
    get numPlayers() { return this._numPlayers; }
    get vip() { return this._vipId; }

    /* Add a Player to the _players obj */
    addPlayer(id, name = "Player" + this._numPlayers) {
        /* Add the new player to the lobby, and increment numPlayers */
        this._players[id] = new Player(id, name);
        this._numPlayers++;
        console.log("user %s initialized as %s", id, this.getName(id));

        
        /* Check if this is the first player, and assign VIP */
        if (this.numPlayers == 1) {
            console.log(">new player is first, setting VIP");
            this._vipId = id;
        }
    }

    /* Delete a player from the _players obj */
    removePlayer(id) {
        /* Check if the player actually exists */
        if (this._players[id] == undefined) {
            console.log("failed to delete player w/ id %s", id);
            return;
        }

        /* Check if player leaving was VIP */
        var needNewVip = false;
        if (this._vipId == id)
            needNewVip = true;

        /* Delete player from the loby and dec numPlayers */
        delete this._players[id];
        this._numPlayers--;
        console.log('user %s successfully disconnected', id);

        /* Check if last player, or if we need to set new VIP */
        if (this._numPlayers == 0) {
            console.log(">leaving player was the last player");
        } else if (needNewVip) {
            this._vipId = this.playerIds[0];
            console.log(">leaving player was VIP, the new one is %s", this.getName(this._vipId));
        }
    }

    getName(id) {
        return this._players[id].name;
    }

    getPlayer(id) {
        return this._players[id];
    }

    /* Return an array of playerIds */
    get playerIds() { return Object.keys(this._players); }

    /* Check if all players are ready */
    get isReady() {
        /* Iterate over every player */
        for (var i = 0; i < this.playerIds.length; i++) {
            /* Check if current player is NOT ready */
            if (!(this._players[this.playerIds[i]].isReady)) {
                /* Someone is not ready, return false */
                return false;
            }
            /* Everyone is ready! */
            return true;
        }
    }

    nameChange(id, newName) {
        console.log("changing name of %s from %s to %s", id, this.getName(id), newName);
        this._players[id].name = newName;
    }
}

module.exports = WordSpudGame;