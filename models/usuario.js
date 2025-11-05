class Usuario {
    #id;
    #username;
    #email;
    #createdAt;
    #profile;

    constructor({ id, username, email = null, createdAt = null, profile = null } = {}) {
        this.#id = id;
        this.#username = username;
        this.#email = email;
        this.#createdAt = createdAt ? new Date(createdAt) : null;
        this.#profile = profile;
    }

    get id() {
        return this.#id;
    }

    get username() {
        return this.#username;
    }

    set username(value) {
        this.#username = value;
    }

    get email() {
        return this.#email;
    }

    set email(value) {
        this.#email = value;
    }

    get createdAt() {
        return this.#createdAt;
    }

    set createdAt(value) {
        this.#createdAt = value ? new Date(value) : null;
    }

    get profile() {
        return this.#profile;
    }

    set profile(value) {
        this.#profile = value;
    }

    toJSON() {
        return {
            id: this.#id,
            username: this.#username,
            email: this.#email,
            createdAt: this.#createdAt ? this.#createdAt.toISOString() : null,
            profile: this.#profile
        };
    }
}

module.exports = Usuario;
