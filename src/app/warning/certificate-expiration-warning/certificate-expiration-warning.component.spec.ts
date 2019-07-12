import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateExpirationWarningComponent } from './certificate-expiration-warning.component';

describe('CertificateExpirationWarningComponent', () => {
  let component: CertificateExpirationWarningComponent;
  let fixture: ComponentFixture<CertificateExpirationWarningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificateExpirationWarningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateExpirationWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
