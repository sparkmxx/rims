import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutstorageOrdersComponent } from './outstorage-orders.component';

describe('OutstorageOrdersComponent', () => {
  let component: OutstorageOrdersComponent;
  let fixture: ComponentFixture<OutstorageOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutstorageOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutstorageOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
