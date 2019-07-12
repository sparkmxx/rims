import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseApplyComponent } from './purchase-apply.component';

describe('PurchaseApplyComponent', () => {
  let component: PurchaseApplyComponent;
  let fixture: ComponentFixture<PurchaseApplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseApplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
