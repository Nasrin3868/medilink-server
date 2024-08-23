import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserVideoCallRoomComponent } from './user-video-call-room.component';

describe('UserVideoCallRoomComponent', () => {
  let component: UserVideoCallRoomComponent;
  let fixture: ComponentFixture<UserVideoCallRoomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserVideoCallRoomComponent]
    });
    fixture = TestBed.createComponent(UserVideoCallRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
