import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsContractsComponent } from './clients-contracts.component';

describe('ClientsContractsComponent', () => {
  let component: ClientsContractsComponent;
  let fixture: ComponentFixture<ClientsContractsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientsContractsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientsContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
