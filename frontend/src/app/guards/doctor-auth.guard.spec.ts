import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { doctorAuthGuard } from './doctor-auth.guard';

describe('doctorAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => doctorAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
