import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageOrdersComponent } from './storage-orders.component';

describe('StorageOrdersComponent', () => {
  let component: StorageOrdersComponent;
  let fixture: ComponentFixture<StorageOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
