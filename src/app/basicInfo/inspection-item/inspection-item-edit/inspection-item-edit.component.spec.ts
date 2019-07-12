import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionItemEditComponent } from './inspection-item-edit.component';

describe('InspectionItemEditComponent', () => {
  let component: InspectionItemEditComponent;
  let fixture: ComponentFixture<InspectionItemEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionItemEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionItemEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
