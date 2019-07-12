import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseStorageComponent } from './purchase-storage.component';

describe('PurchaseStorageComponent', () => {
  let component: PurchaseStorageComponent;
  let fixture: ComponentFixture<PurchaseStorageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseStorageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
