import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerTermsAndConditionsComponent } from './seller-terms-and-conditions.component';

describe('SellerTermsAndConditionsComponent', () => {
  let component: SellerTermsAndConditionsComponent;
  let fixture: ComponentFixture<SellerTermsAndConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SellerTermsAndConditionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerTermsAndConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
