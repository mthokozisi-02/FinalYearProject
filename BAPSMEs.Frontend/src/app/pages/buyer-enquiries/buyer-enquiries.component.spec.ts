import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerEnquiriesComponent } from './buyer-enquiries.component';

describe('BuyerEnquiriesComponent', () => {
  let component: BuyerEnquiriesComponent;
  let fixture: ComponentFixture<BuyerEnquiriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuyerEnquiriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerEnquiriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
