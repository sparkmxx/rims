import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseApprovalComponent } from './purchase-approval.component';

describe('PurchaseApprovalComponent', () => {
  let component: PurchaseApprovalComponent;
  let fixture: ComponentFixture<PurchaseApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
