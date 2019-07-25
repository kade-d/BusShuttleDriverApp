import { Stop } from './stop';

export class Log {
  boarded: number;
  stop: Stop;
  timestamp: string;
  loop: string;
  driver: string;
  leftBehind: number;
  busNumber:   string;
  id?:   number;
  constructor(
    boarded: number,
    stop: Stop,
    timestamp: string,
    loop: string,
    driver: string,
    leftBehind: number,
    busNumber:   string,
    id?:   number) {}
}
