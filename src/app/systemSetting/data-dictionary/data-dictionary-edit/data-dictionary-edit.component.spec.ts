import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataDictionaryEditComponent } from './data-dictionary-edit.component';

describe('DataDictionaryEditComponent', () => {
  let component: DataDictionaryEditComponent;
  let fixture: ComponentFixture<DataDictionaryEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataDictionaryEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataDictionaryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
