import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutStorageUseComponent } from './out-storage-use.component';

describe('OutStorageUseComponent', () => {
  let component: OutStorageUseComponent;
  let fixture: ComponentFixture<OutStorageUseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutStorageUseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutStorageUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
