import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutStoragePurchaseComponent } from './out-storage-purchase.component';

describe('OutStoragePurchaseComponent', () => {
  let component: OutStoragePurchaseComponent;
  let fixture: ComponentFixture<OutStoragePurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutStoragePurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutStoragePurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
