import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerColumnChangerComponent } from './banner-column-changer.component';

describe('BannerColumnChangerComponent', () => {
  let component: BannerColumnChangerComponent;
  let fixture: ComponentFixture<BannerColumnChangerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BannerColumnChangerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerColumnChangerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
