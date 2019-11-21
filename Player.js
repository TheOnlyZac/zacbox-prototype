class Player {
    constructor(id, name = "Nani", color = 'white', isVip = false) {
        //console.log("Constructing new player");
        this._id = id;
        this._name = name;
        this._color = color;
        this._score = 0;
        this._vote = false;
        this._ready = false;
    }

    get id() { return this._id; }

    get name() { return this._name; }
    set name(newName) { this._name = newName; }
    
    get color() { return this._color; }
    set color(newColor) { this._color = newColor; }

    get score() { return this._score; }
    set score(newScore) { this._score = newScore; }
    
    get vote() { return this._vote; }
    set vote(newVote) { this._vote = newVote; }

    get isReady() { return this._ready; }
    set isReady(newReady) { this._ready = newReady; }
}

module.exports = Player;