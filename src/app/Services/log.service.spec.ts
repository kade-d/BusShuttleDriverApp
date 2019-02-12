import { TestBed } from '@angular/core/testing';
import { LogService } from './log.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Log } from '../Models/log';
import { Loop } from '../Models/loop'
import { Stop } from '../Models/stop'

describe('LogService', () => {
    let service: LogService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [LogService]
        });
        service = TestBed.get(LogService);
        httpMock = TestBed.get(HttpTestingController);
    });

    it('should perform POST request and return dummyLog obj.', () => {
        const dummyLog: Log = { boarded: 4, stop: 'MU', loop: 'Green', driver: 'steve', leftBehind: 3 };

        service.store(dummyLog).subscribe(returnObj => {
            expect(returnObj).toEqual(dummyLog);
        });

        const request = httpMock.expectOne(service.baseUrl + '/store');
        expect(request.request.method).toBe('POST');
        request.flush(dummyLog);
    });

    it('should perform GET request and return dummyLoop obj.', () => {
        const dummyLoop: Loop = { name: 'Red',loops: '' };

        service.getAllLoops().subscribe(returnObj => {
            expect(returnObj).toEqual(dummyLoop);
        });

        const request = httpMock.expectOne(service.baseUrl + '/getLoops.php');
        expect(request.request.method).toBe('GET');
        request.flush(dummyLoop);
    });

    it('should perform GET request and return dummyStop obj.', () => {
        const dummyStop: Stop = { name: 'Anthony',stops: '' };

        service.getAllStops().subscribe(returnObj => {
            expect(returnObj).toEqual(dummyStop);
        });

        const request = httpMock.expectOne(service.baseUrl + '/getStops.php');
        expect(request.request.method).toBe('GET');
        request.flush(dummyStop);
    });

});
