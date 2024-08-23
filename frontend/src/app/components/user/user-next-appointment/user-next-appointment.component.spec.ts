import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNextAppointmentComponent } from './user-next-appointment.component';

describe('UserNextAppointmentComponent', () => {
  let component: UserNextAppointmentComponent;
  let fixture: ComponentFixture<UserNextAppointmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserNextAppointmentComponent]
    });
    fixture = TestBed.createComponent(UserNextAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
