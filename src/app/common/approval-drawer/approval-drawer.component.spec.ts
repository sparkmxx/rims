import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalDrawerComponent } from './approval-drawer.component';

describe('ApprovalDrawerComponent', () => {
  let component: ApprovalDrawerComponent;
  let fixture: ComponentFixture<ApprovalDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
