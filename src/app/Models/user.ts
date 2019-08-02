export class User {
    [x: string]: any;
    id?: string;
    email?: string;
    password?: string;
    firstname?: string;
    lastname?: string;
    token?: string;
    name?: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
      }
}
