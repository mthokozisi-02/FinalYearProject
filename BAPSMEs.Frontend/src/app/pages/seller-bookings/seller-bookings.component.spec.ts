import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerBookingsComponent } from './seller-bookings.component';

describe('SellerBookingsComponent', () => {
  let component: SellerBookingsComponent;
  let fixture: ComponentFixture<SellerBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SellerBookingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
