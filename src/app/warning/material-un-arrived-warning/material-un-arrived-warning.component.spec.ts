import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialUnArrivedWarningComponent } from './material-un-arrived-warning.component';

describe('MaterialUnArrivedWarningComponent', () => {
  let component: MaterialUnArrivedWarningComponent;
  let fixture: ComponentFixture<MaterialUnArrivedWarningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialUnArrivedWarningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialUnArrivedWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
