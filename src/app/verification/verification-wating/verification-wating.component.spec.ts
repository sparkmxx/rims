import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationWatingComponent } from './verification-wating.component';

describe('VerificationWatingComponent', () => {
  let component: VerificationWatingComponent;
  let fixture: ComponentFixture<VerificationWatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificationWatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationWatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
