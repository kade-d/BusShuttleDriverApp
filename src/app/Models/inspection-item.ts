export class Inspection {
    [x: string]: any;
    id?: string;
    name?: string;
    pre?: string;
    post?: string;

    constructor(id: string, name: string, pre: string, post: string) {
        this.id = id;
        this.name = name;
        this.pre = pre;
        this.post = post;
      }
}
