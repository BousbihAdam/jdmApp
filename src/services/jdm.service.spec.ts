import { TestBed, inject } from '@angular/core/testing';

import { JdmService } from './jdm.service';

describe('JdmService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JdmService]
    });
  });

  it('should be created', inject([JdmService], (service: JdmService) => {
    expect(service).toBeTruthy();
  }));
});
