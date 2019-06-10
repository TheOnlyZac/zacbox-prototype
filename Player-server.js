class Player {
    constructor(name = "Nani") {
        console.log("Constructing new player");
        this._name = name;
    }

    get name() {
        return name;
    }

    set name(newName) {
        this._name = newName
    }
}

module.exports = Player;