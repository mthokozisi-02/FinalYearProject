import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerPaymentComponent } from './buyer-payment.component';

describe('BuyerPaymentComponent', () => {
  let component: BuyerPaymentComponent;
  let fixture: ComponentFixture<BuyerPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuyerPaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
