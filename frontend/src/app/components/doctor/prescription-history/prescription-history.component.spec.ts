import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionHistoryComponent } from './prescription-history.component';

describe('PrescriptionHistoryComponent', () => {
  let component: PrescriptionHistoryComponent;
  let fixture: ComponentFixture<PrescriptionHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrescriptionHistoryComponent]
    });
    fixture = TestBed.createComponent(PrescriptionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
