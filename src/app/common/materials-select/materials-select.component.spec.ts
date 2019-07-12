import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsSelectComponent } from './materials-select.component';

describe('MaterialsSelectComponent', () => {
  let component: MaterialsSelectComponent;
  let fixture: ComponentFixture<MaterialsSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialsSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialsSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
