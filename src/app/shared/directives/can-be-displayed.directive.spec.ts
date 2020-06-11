import { Component, DebugElement, ElementRef, TemplateRef, ViewContainerRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CanBeDisplayedDirective } from './can-be-displayed.directive';

@Component({
  selector: 'wid-my-test-component',
  template: `
    <div *canBeDisplayed="{feature: 'TEST', license: '123456'}"></div>
    <div *canBeDisplayed="{feature: 'dashboard', license: '123456'}"></div>
  `,
})
class TestComponent { }

describe('canBeDisplayed', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let divEls: DebugElement[];

  // tslint:disable-next-line:max-classes-per-file
  class MockElementRef implements ElementRef {
    nativeElement = { };
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ElementRef, useValue: new MockElementRef() },
        TemplateRef,
        ViewContainerRef,
      ],
      declarations: [ TestComponent, CanBeDisplayedDirective ],
    })
      .compileComponents().then(() => {
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      divEls = fixture.debugElement.queryAll(By.css('div'));
    });
  }));

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should has one div in template of my TestComponent', () => {
    expect(divEls.length).toEqual(1);
  });
});
