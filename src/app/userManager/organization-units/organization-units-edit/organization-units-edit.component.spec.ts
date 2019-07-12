import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationUnitsEditComponent } from './organization-units-edit.component';

describe('OrganizationUnitsEditComponent', () => {
  let component: OrganizationUnitsEditComponent;
  let fixture: ComponentFixture<OrganizationUnitsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationUnitsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationUnitsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
