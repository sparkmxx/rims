import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutStorageListComponent } from './out-storage-list.component';

describe('OutStorageListComponent', () => {
  let component: OutStorageListComponent;
  let fixture: ComponentFixture<OutStorageListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutStorageListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutStorageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
