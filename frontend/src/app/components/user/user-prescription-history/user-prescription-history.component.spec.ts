import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPrescriptionHistoryComponent } from './user-prescription-history.component';

describe('UserPrescriptionHistoryComponent', () => {
  let component: UserPrescriptionHistoryComponent;
  let fixture: ComponentFixture<UserPrescriptionHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserPrescriptionHistoryComponent]
    });
    fixture = TestBed.createComponent(UserPrescriptionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
