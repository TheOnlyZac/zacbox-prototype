class Player {
    constructor(id, name) {
        //console.log("Constructing new player");
        this._name = name;
        this._id = id;
    }

    get name() { return this._name; }
    set name(newName) { this._name = newName; }

    get id() { return this._id; }
}