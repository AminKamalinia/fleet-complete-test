import { TestBed } from '@angular/core/testing';

import { FleetCompleteService } from './fleet-complete.service';

describe('FleetCompleteService', () => {
  let service: FleetCompleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FleetCompleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
