class WordSpudGame {
    constructor() {
        this._players = {};
        this._numPlayers = 0;
        this._vipId = null;
        this._myId = null;
        this._currPlayer = null;
    }

    get players() { return this._players; }
    get numPlayers() { return this._numPlayers; }

    get vip() { return this._vipId; }
    set vip(newVip) { this._vipId = newVip; }

    get me() { return this._myId; }
    set me(newId) { this._myId = newId; }

    get currPlayer() { return this._currPlayer; }
    set currPlayer(newId) { this._currPlayer = newId; }

    /* Add a Player to the _players obj */
    addPlayer(id, name = "Player" + this._numPlayers) {
        /* Add the new player to the lobby, and increment numPlayers */
        this._players[id] = new Player(id, name);
        this._numPlayers++;
        console.log("user %s initialized as %s", id, this._players[id].name);
    }

    /* Delete a player from the _players obj */
    removePlayer(id) {
        /* Check if the player actually exists */
        if (this._players[id] == undefined) {
            console.log("failed to delete player w/ id %s", id);
            return;
        }

        /* Delete player from the loby and dec numPlayers */
        delete this._players[id];
        this._numPlayers--;
        console.log('user %s successfully disconnected', id);
    }
}