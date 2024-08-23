import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorChatComponent } from './doctor-chat.component';

describe('DoctorChatComponent', () => {
  let component: DoctorChatComponent;
  let fixture: ComponentFixture<DoctorChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DoctorChatComponent]
    });
    fixture = TestBed.createComponent(DoctorChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
