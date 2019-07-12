import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialPrintComponent } from './material-print.component';

describe('MaterialPrintComponent', () => {
  let component: MaterialPrintComponent;
  let fixture: ComponentFixture<MaterialPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
