import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanRessourcesComponent } from './human-ressources.component';

describe('HumanRessourcesComponent', () => {
  let component: HumanRessourcesComponent;
  let fixture: ComponentFixture<HumanRessourcesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HumanRessourcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HumanRessourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
