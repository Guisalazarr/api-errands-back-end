import { v4 as createId } from 'uuid';

export enum ErrandStatus {
    unarchived = 'U',
    archived = 'A',
}

export class Errand {
    private _id: string;
    private _status: ErrandStatus;

    constructor(private _title: string, private _description: string) {
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
}
