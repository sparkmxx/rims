import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialStockWarningComponent } from './material-stock-warning.component';

describe('MaterialStockWarningComponent', () => {
  let component: MaterialStockWarningComponent;
  let fixture: ComponentFixture<MaterialStockWarningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialStockWarningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialStockWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
