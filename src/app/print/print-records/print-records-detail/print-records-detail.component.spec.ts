import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintRecordsDetailComponent } from './print-records-detail.component';

describe('PrintRecordsDetailComponent', () => {
  let component: PrintRecordsDetailComponent;
  let fixture: ComponentFixture<PrintRecordsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintRecordsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintRecordsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
