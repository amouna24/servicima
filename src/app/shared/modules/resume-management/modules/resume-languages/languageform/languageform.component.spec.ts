import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageformComponent } from './languageform.component';

describe('LanguageformComponent', () => {
  let component: LanguageformComponent;
  let fixture: ComponentFixture<LanguageformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LanguageformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
