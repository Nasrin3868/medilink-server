import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorVideoCallRoomComponent } from './doctor-video-call-room.component';

describe('DoctorVideoCallRoomComponent', () => {
  let component: DoctorVideoCallRoomComponent;
  let fixture: ComponentFixture<DoctorVideoCallRoomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DoctorVideoCallRoomComponent]
    });
    fixture = TestBed.createComponent(DoctorVideoCallRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
