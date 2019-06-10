class Player {
    constructor(id, name = "Nani", isVip = false) {
        //console.log("Constructing new player");
        this._name = name;
        this._id = id;
        this._isVip = isVip;
    }

    get name() { return this._name; }
    set name(newName) { this._name = newName; }

    get id() { return this._id; }

    get isVip() { return this._isVip; }
    set isVip(newVip) { this._isVip = newVip; }
}

module.exports = Player;