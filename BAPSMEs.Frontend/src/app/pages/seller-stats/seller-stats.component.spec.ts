import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerStatsComponent } from './seller-stats.component';

describe('SellerStatsComponent', () => {
  let component: SellerStatsComponent;
  let fixture: ComponentFixture<SellerStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SellerStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
