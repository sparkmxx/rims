import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialInspectionItemComponent } from './material-inspection-item.component';

describe('MaterialInspectionItemComponent', () => {
  let component: MaterialInspectionItemComponent;
  let fixture: ComponentFixture<MaterialInspectionItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialInspectionItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialInspectionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
