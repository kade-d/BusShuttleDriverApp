export class Log {
  boarded: number;
  stop: string;
  timestamp: string;
  date: string;
  loop: string;
  driver: string;
  id?:   number;
  constructor(
    boarded: number,
    stop: string,
    timestamp: string,
    date: string,
    loop: string,
    driver: string,
    id?:   number) {}
}
