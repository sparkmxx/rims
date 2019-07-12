import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnumDictionaryComponent } from './enum-dictionary.component';

describe('EnumDictionaryComponent', () => {
  let component: EnumDictionaryComponent;
  let fixture: ComponentFixture<EnumDictionaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnumDictionaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnumDictionaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
