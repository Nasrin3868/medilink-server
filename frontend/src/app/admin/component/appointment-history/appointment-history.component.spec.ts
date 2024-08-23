import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentHistoryComponent } from './appointment-history.component';

describe('AppointmentHistoryComponent', () => {
  let component: AppointmentHistoryComponent;
  let fixture: ComponentFixture<AppointmentHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppointmentHistoryComponent]
    });
    fixture = TestBed.createComponent(AppointmentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
