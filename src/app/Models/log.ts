import { Stop } from './stop';

export class Log {
  boarded: number;
  stop: string;
  timestamp: string;
  loop: string;
  driver: number;
  leftBehind: number;
  busNumber:   string;
  id?:   number;

  constructor(
    boarded: number,
    stop: string,
    timestamp: string,
    loop: string,
    driver: string,
    leftBehind: number,
    busNumber:   string,
    id?:   number) {}
}
