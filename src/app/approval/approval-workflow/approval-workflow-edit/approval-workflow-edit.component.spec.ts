import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalWorkflowEditComponent } from './approval-workflow-edit.component';

describe('ApprovalWorkflowEditComponent', () => {
  let component: ApprovalWorkflowEditComponent;
  let fixture: ComponentFixture<ApprovalWorkflowEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalWorkflowEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalWorkflowEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
