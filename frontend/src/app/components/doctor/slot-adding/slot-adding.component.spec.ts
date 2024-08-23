import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotAddingComponent } from './slot-adding.component';

describe('SlotAddingComponent', () => {
  let component: SlotAddingComponent;
  let fixture: ComponentFixture<SlotAddingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SlotAddingComponent]
    });
    fixture = TestBed.createComponent(SlotAddingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
