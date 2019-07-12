import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialRequestListComponent } from './material-request-list.component';

describe('MaterialRequestListComponent', () => {
  let component: MaterialRequestListComponent;
  let fixture: ComponentFixture<MaterialRequestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialRequestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
