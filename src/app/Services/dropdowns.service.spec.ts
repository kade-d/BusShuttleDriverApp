import { TestBed } from '@angular/core/testing';

import { DropdownsService } from './dropdowns.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LogService } from './log.service';
import { Loop } from '../Models/loop';
import { Stop } from '../Models/stop';

describe('DropdownsService', () => {
  let service: DropdownsService;
  let httpMock: HttpTestingController;


  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
            DropdownsService
        ]
    });
    service = TestBed.get(DropdownsService);
    httpMock = TestBed.get(HttpTestingController);
});

  it('should perform GET request and return dummyLoop obj.', () => {
    const dummyLoop: Loop = { name: 'Red', loops: '' };

    service.getAllLoops().subscribe(returnObj => {
        expect(returnObj).toEqual(dummyLoop);
    });

    const request = httpMock.expectOne(service.baseUrl + '/getLoops.php');
    expect(request.request.method).toBe('GET');
    request.flush(dummyLoop);
});

it('should perform GET request and return dummyStop obj.', () => {
    const dummyStop: Stop = { name: 'Anthony', stops: '' };

    service.getAllStops('Green Loop').subscribe(returnObj => {
        expect(returnObj).toEqual(dummyStop);
    });

    const request = httpMock.expectOne(service.baseUrl + '/getStops.php?searchTerm=Green Loop');
    expect(request.request.method).toBe('GET');
    request.flush(dummyStop);
});
});
