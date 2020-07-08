import { TestBed } from '@angular/core/testing';

import { NgxCronService } from './ngx-cron.service';

describe('NgxCronService', () => {
  let service: NgxCronService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [NgxCronService] });
    service = TestBed.inject(NgxCronService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
