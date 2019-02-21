import { TestBed } from '@angular/core/testing';
import { LogService } from './log.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Log } from '../Models/log';
import { Loop } from '../Models/loop';
import { Stop } from '../Models/stop';
import { DropdownsService } from './dropdowns.service';

describe('LogService', () => {
    let service: LogService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                LogService
            ]
        });
        service = TestBed.get(LogService);
        httpMock = TestBed.get(HttpTestingController);
    });

    it('should perform POST request and return dummyLog obj.', () => {
        const dummyLog: Log = { boarded: 4, stop: 'MU', timestamp: '2019/02/19 05:09:36', loop: 'Green', driver: 'steve', leftBehind: 3 };

        service.store(dummyLog).subscribe(returnObj => {
            expect(returnObj).toEqual(dummyLog);
        });

        const request = httpMock.expectOne(service.baseUrl + '/store');
        expect(request.request.method).toBe('POST');
        request.flush(dummyLog);
    });



});
