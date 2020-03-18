export class InspectionLog {
    driver: string;
    loop: string;
    busNumber: string;
    stop: string;
    timestamp: string;
    date: string;
    begin: string;
    ending: string;
    startMileage: string;
    endMileage: string;
    pre: string;
    post: string;
    id?:   number;
    constructor(
        driver: string,
        loop: string,
        busNumber: string,
        stop: string,
        timestamp: string,
        date: string,
        begin: string,
        ending: string,
        startMileage: string,
        endMileage: string,
        pre: string,
        post: string,
        id?:   number) {}
}