import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialBarcodesComponent } from './material-barcodes.component';

describe('MaterialBarcodesComponent', () => {
  let component: MaterialBarcodesComponent;
  let fixture: ComponentFixture<MaterialBarcodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialBarcodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialBarcodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
