import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareOnLinkedinComponent } from './share-on-linkedin.component';

describe('ShareOnLinkedinComponent', () => {
  let component: ShareOnLinkedinComponent;
  let fixture: ComponentFixture<ShareOnLinkedinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareOnLinkedinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareOnLinkedinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
