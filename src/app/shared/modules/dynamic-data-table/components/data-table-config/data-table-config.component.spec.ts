import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableConfigComponent } from './data-table-config.component';

describe('DataTableConfigComponent', () => {
  let component: DataTableConfigComponent;
  let fixture: ComponentFixture<DataTableConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTableConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTableConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
