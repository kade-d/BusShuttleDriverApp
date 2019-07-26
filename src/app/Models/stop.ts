export class Stop {
  [x: string]: any;
    stops?: string;
    id?: string;
    name?: string;
    constructor(id: string, name: string) {
      this.id = id;
      this.name = name;
    }
  }
