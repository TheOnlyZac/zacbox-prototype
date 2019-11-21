const Player = require('./Player.js');

class WordSpudGame {
    constructor() {
        this._players = {};
        this._numPlayers = 0;
        this._vipId = null;
        this._started = false;
        this._turnOrder = [];
        this._currentPlayer = null;
        this._wordSpud = [];
        this._currSpud = '';
        this._colors = ['red',
            'orange',
            'yellow',
            'green',
            'blue',
            'purple',
            'violet',
            'aqua']
        this._startingWords = [
            'peanut', 'movie', 'red', 'road', 'blood',
            'friend', 'bad', 'day', 'cow', 'side',
            'flame', 'fire', 'game', 'fall', 'wild',
            'bear', 'wrist', 'foot', 'grand', 'life',
            'sun', 'over', 'right', 'mouse', 'under'
        ]
        this.shuffleArray(this._colors);
        this.shuffleArray(this._startingWords);

        this._voteTally = 0;
    }

    get colors() { return this._colors; }

    get players() { return this._players; }
    get numPlayers() { return this._numPlayers; }
    get vip() { return this._vipId; }
    get started() { return this._started; }
    get turnOrder() { return this._turnOrder; }
    get currentPlayer() { return this._currentPlayer; }
    get wordSpud() { return this._wordSpud; }
    get voteTally() { return this._voteTally; }
    get currSpud() { return this._currSpud; }
    
    /* Return an array of playerIds */
    get playerIds() { return Object.keys(this._players); }

    /* Check if all players are ready */
    get allReady() {
        /* Iterate over every player */
        for (let key in this._players) {
            /* Check if player is NOT ready */
            if (!this._players[key].isReady)  return false;
        }
        /* Everyone is ready! */
        return true;
    }

    get randomWord() {
        this.shuffleArray(this._startingWords);
        return this._startingWords[0];
    }

    /* Add a Player to the _players obj */
    addPlayer(id, name = "Player" + this._numPlayers) {
        /* Add the new player to the lobby, and increment numPlayers */
        this._players[id] = new Player(id, name, this._colors[this.numPlayers]);
        this._numPlayers++;
        console.log("user %s initialized as %s", id, this.getName(id));
        
        /* Check if this is the first player, and assign VIP */
        if (this.numPlayers == 1) {
            console.log(">new player is first, setting VIP");
            this._vipId = id;
        }

        /* Add them to the turn order and shuffle it */
        if (this._started) {
            this._turnOrder.push(id);
            this.shuffleArray(this._turnOrder);
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

        /* Check if player is in the turn order queue */
        if (this._turnOrder.indexOf(id) > -1) {
            this._turnOrder.splice(this._turnOrder.indexOf(id), 1);
        }

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

    nameChange(id, newName) {
        console.log("changing name of %s from %s to %s", id, this.getName(id), newName);
        this._players[id].name = newName;
    }

    getName(id) {
        return this._players[id].name;
    }

    getPlayer(id) {
        return this._players[id];
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i)
            const temp = array[i]
            array[i] = array[j]
            array[j] = temp
        }
        return array;
    }

    startGame() {
        console.log('game started!');
        this.addSpud(this._startingWords[0], "white");
        this._started = true;
    }

    endGame() {
        this._started = false;

    }

    nextPlayer() {
        // track who the previous player was
        var lastPlayer = this._currentPlayer;

        // if this player is the final player in the turn order...
        if (this._turnOrder.length == 0) {
            // repopulate the turn order queue
            this._turnOrder = Array.from(this.playerIds);
            // shuffle the turn order queue until the same player isn't next
            do { 
                this.shuffleArray(this._turnOrder);
            } while(this._turnOrder[this._turnOrder.length - 1] == lastPlayer && this._numPlayers > 1);
        }
        // pop the next player from the turn order queue and set their turn
        this._currentPlayer = this._turnOrder.pop();
        //console.log("Set current player to " + this._currentPlayer);
    }

    startVote(currPlayerId, currSpud) {
        for (let key in this._players) {
            this._players[key].isReady = false;
        }
        this._currSpud = currSpud;
        this._players[currPlayerId].isReady = true;
        this._voteTally = 0;
    }

    setVote(playerId, vote) {
        //console.log("setting vote: " + vote);
        this._players[playerId].vote = vote;
        this._players[playerId].isReady = true;

        this._voteTally += (vote == true ? 100 : -100);
        return this.allReady;
    }

    addSpud(word, color) {
        this._wordSpud.push({
            'word': word,
            'color': color
        })
    }
}

module.exports = WordSpudGame;