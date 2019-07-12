import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryWaitingListComponent } from './inventory-waiting-list.component';

describe('InventoryWaitingListComponent', () => {
  let component: InventoryWaitingListComponent;
  let fixture: ComponentFixture<InventoryWaitingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryWaitingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryWaitingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
