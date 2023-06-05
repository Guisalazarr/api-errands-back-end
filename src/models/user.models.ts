import { v4 as createId } from 'uuid';
import { Errand } from './errand.models';

export class User {
    private _id: string;
    private _errand: Errand[];

    constructor(
        private _name: string,
        private _email: string,
        private _password: string
    ) {
        this._id = createId();
        this._errand = [];
    }

    public get id() {
        return this._id;
    }

    public get name() {
        return this._name;
    }
    public get email() {
        return this._email;
    }

    public get password() {
        return this._password;
    }
    public get errand() {
        return this._errand;
    }

    public set name(name: string) {
        this._name = name;
    }
    public set email(email: string) {
        this.email = email;
    }

    public toJson() {
        return {
            id: this._id,
            name: this._name,
            email: this._email,
            errand: this._errand,
        };
    }
}
