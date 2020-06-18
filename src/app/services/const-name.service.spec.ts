import { TestBed } from '@angular/core/testing';

import { ConstNameService } from './const-name.service';

describe('ConstNameService', () => {
  let service: ConstNameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    //service = TestBed.inject(ConstNameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
