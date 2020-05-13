export class InspectionLog {
    driver: string;
    loop: string;
    busNumber: string;
    timestamp: string;
    date: string;
    beginningHours: string;
    endingHours: string;
    startingMileage: string;
    endingMileage: string;
    preInspection: string;
    postInspection: string;
    id?:   number;
    constructor(
        driver: string,
        loop: string,
        busNumber: string,
        timestamp: string,
        date: string,
        beginningHours: string,
        endingHours: string,
        startingMileage: string,
        endingMileage: string,
        preInspection: string,
        postInspection: string,
        id?:   number) {}
}
