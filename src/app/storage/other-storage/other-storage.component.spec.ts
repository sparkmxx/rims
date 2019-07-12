import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherStorageComponent } from './other-storage.component';

describe('OtherStorageComponent', () => {
  let component: OtherStorageComponent;
  let fixture: ComponentFixture<OtherStorageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherStorageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
