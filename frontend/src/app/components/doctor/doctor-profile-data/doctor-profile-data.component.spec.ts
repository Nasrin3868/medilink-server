import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorProfileDataComponent } from './doctor-profile-data.component';

describe('DoctorProfileDataComponent', () => {
  let component: DoctorProfileDataComponent;
  let fixture: ComponentFixture<DoctorProfileDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DoctorProfileDataComponent]
    });
    fixture = TestBed.createComponent(DoctorProfileDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
