import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerBookingsComponent } from './buyer-bookings.component';

describe('BuyerBookingsComponent', () => {
  let component: BuyerBookingsComponent;
  let fixture: ComponentFixture<BuyerBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuyerBookingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
