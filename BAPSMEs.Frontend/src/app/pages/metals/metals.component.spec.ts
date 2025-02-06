import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetalsComponent } from './metals.component';

describe('MetalsComponent', () => {
  let component: MetalsComponent;
  let fixture: ComponentFixture<MetalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MetalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
