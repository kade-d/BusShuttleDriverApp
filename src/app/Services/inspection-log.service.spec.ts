import { TestBed } from '@angular/core/testing';

import { InspectionLogService } from './inspection-log.service';

describe('InspectionLogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InspectionLogService = TestBed.get(InspectionLogService);
    expect(service).toBeTruthy();
  });
});
