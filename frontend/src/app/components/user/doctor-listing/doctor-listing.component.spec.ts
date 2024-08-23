import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorListingComponent } from './doctor-listing.component';

describe('DoctorListingComponent', () => {
  let component: DoctorListingComponent;
  let fixture: ComponentFixture<DoctorListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DoctorListingComponent]
    });
    fixture = TestBed.createComponent(DoctorListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
