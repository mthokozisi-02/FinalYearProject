import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminQuotationComponent } from './admin-quotation.component';

describe('AdminQuotationComponent', () => {
  let component: AdminQuotationComponent;
  let fixture: ComponentFixture<AdminQuotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminQuotationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
