import { v4 as createId } from 'uuid';
import { User } from './user.models';
import { ErrandEntity } from '../database/entities/errand.entity';

export enum ErrandStatus {
    unarchived = 'U',
    archived = 'A',
}

export class Errand {
    private _id: string;
    private _status: ErrandStatus;

    constructor(
        private _title: string,
        private _description: string,
        private _user: User
    ) {
        this._id = createId();
        this._status = ErrandStatus.unarchived;
    }

    public get id() {
        return this._id;
    }
    public get status() {
        return this._status;
    }

    public get title() {
        return this._title;
    }

    public get description() {
        return this._description;
    }

    public get user() {
        return this._user;
    }

    public set title(title: string) {
        this._title = title;
    }

    public set status(status: ErrandStatus) {
        this._status = status;
    }

    public set description(description: string) {
        this._description = description;
    }

    public toJson() {
        return {
            id: this._id,
            title: this._title,
            description: this._description,
            status: this._status,
        };
    }
    public static create(row: ErrandEntity, user: User) {
        const errand = new Errand(row.title, row.description, user);
        errand._id = row.id;
        errand._status = row.status as ErrandStatus;

        return errand;
    }
}
