class Usuario{
    #id;
    #username;

    constructor(id, username){
        this.#id = id;
        this.#username = username;
    }
    get id(){
        return this.#id;
    }
    set username(value){
        this.#username = value;
    }
    get username(){
        return this.#username;
    }
    toJSON() {
        return {
            id: this.#id,
            username: this.#username
        }
    }
}

module.exports = Usuario;