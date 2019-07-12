import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintRecordsComponent } from './print-records.component';

describe('PrintRecordsComponent', () => {
  let component: PrintRecordsComponent;
  let fixture: ComponentFixture<PrintRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
