import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialRequestOutStorageComponent } from './material-request-out-storage.component';

describe('MaterialRequestOutStorageComponent', () => {
  let component: MaterialRequestOutStorageComponent;
  let fixture: ComponentFixture<MaterialRequestOutStorageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialRequestOutStorageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialRequestOutStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
