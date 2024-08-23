import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserdoctorProfileComponent } from './userdoctor-profile.component';

describe('UserdoctorProfileComponent', () => {
  let component: UserdoctorProfileComponent;
  let fixture: ComponentFixture<UserdoctorProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserdoctorProfileComponent]
    });
    fixture = TestBed.createComponent(UserdoctorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
