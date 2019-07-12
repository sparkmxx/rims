import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationUnitsUsersComponent } from './organization-units-users.component';

describe('OrganizationUnitsUsersComponent', () => {
  let component: OrganizationUnitsUsersComponent;
  let fixture: ComponentFixture<OrganizationUnitsUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationUnitsUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationUnitsUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
