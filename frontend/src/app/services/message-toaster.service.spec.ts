import { TestBed } from '@angular/core/testing';

import { MessageToasterService } from './message-toaster.service';

describe('MessageToasterService', () => {
  let service: MessageToasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageToasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
