import { TestBed } from '@angular/core/testing';
import { LogService } from './log.service';
import { HttpClientTestingModule,HttpTestingController } from '@angular/common/http/testing';
import { Log } from './log';

describe('LogService', () => {
    let service: LogService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [LogService]
        });
        service = TestBed.get(LogService)
        httpMock = TestBed.get(HttpTestingController);
    });

    it('should perform POST request and return dummyLog obj.', () => {
        const dummyLog: Log = { boarded: 4, stop: 'MU', loop: 'Green', driver: 'steve' };

        service.store(dummyLog).subscribe(returnObj => {
            expect(returnObj).toEqual(dummyLog);
        });

        const request = httpMock.expectOne(service.baseUrl + '/store');
        expect(request.request.method).toBe('POST');
        request.flush(dummyLog)
    });

});