export class Driver {
    [x: string]: any;
    id: number;
    firstname: string;
    lastname: string;

    constructor(id: number, firstname: string, lastname: string) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
    }

}
