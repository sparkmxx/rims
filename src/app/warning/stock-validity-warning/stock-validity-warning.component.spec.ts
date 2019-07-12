import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockValidityWarningComponent } from './stock-validity-warning.component';

describe('StockValidityWarningComponent', () => {
  let component: StockValidityWarningComponent;
  let fixture: ComponentFixture<StockValidityWarningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockValidityWarningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockValidityWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
