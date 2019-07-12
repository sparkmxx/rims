import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialScanComponent } from './material-scan.component';

describe('MaterialScanComponent', () => {
  let component: MaterialScanComponent;
  let fixture: ComponentFixture<MaterialScanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialScanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
