import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorComponentComponent } from './doctor-component.component';

describe('DoctorComponentComponent', () => {
  let component: DoctorComponentComponent;
  let fixture: ComponentFixture<DoctorComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DoctorComponentComponent]
    });
    fixture = TestBed.createComponent(DoctorComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
