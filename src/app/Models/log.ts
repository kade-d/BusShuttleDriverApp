export class Log {
  boarded: number;
  stop: string;
  loop: string;
  driver: string;
  leftBehind: number;
  id?:   number;
  constructor(
    boarded: number,
    stop: string,
    loop: string,
    driver: string,
    leftBehind: number,
    id?:   number) {}
}
