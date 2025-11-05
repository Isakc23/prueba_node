class Usuario {
    _id;
    _username;
    _email;
    _createdAt;
    _profile;

    constructor({ id, username, email = null, createdAt = null, profile = null } = {}) {
        this._id = id;
        this._username = username;
        this._email = email;
        this._createdAt = createdAt ? new Date(createdAt) : null;
        this._profile = profile;
    }
    get id() {
        return this._id;
    }
    get username() {
        return this._username;
    }

    set username(value) {
        this._username = value;
    }
    get email() {
        return this._email;
    }

    set email(value) {
        this._email = value;
    }

    get createdAt() {
        return this._createdAt;
    }

    set createdAt(value) {
        this._createdAt = value ? new Date(value) : null;
    }

    get profile() {
        return this._profile;
    }

    set profile(value) {
        this._profile = value;
    }
    toJSON() {
            return {
                id: this._id,
                username: this._username,
                email: this._email,
                createdAt: this._createdAt ? this._createdAt.toISOString() : null,
                profile: this._profile
            };
        }
    }

module.exports = Usuario;