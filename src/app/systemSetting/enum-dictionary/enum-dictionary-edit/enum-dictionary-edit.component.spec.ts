import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnumDictionaryEditComponent } from './enum-dictionary-edit.component';

describe('EnumDictionaryEditComponent', () => {
  let component: EnumDictionaryEditComponent;
  let fixture: ComponentFixture<EnumDictionaryEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnumDictionaryEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnumDictionaryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
