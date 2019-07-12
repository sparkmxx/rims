import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationUnitsSettingComponent } from './organization-units-setting.component';

describe('OrganizationUnitsSettingComponent', () => {
  let component: OrganizationUnitsSettingComponent;
  let fixture: ComponentFixture<OrganizationUnitsSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationUnitsSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationUnitsSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
