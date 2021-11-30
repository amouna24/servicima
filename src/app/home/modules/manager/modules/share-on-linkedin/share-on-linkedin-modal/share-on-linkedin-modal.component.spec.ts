import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareOnLinkedinModalComponent } from './share-on-linkedin-modal.component';

describe('ShareOnLinkedinModalComponent', () => {
  let component: ShareOnLinkedinModalComponent;
  let fixture: ComponentFixture<ShareOnLinkedinModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareOnLinkedinModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareOnLinkedinModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
