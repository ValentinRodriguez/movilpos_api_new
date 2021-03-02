import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrdenesComprasComponent } from './ordenes-compras.component';

describe('OrdenesComprasComponent', () => {
  let component: OrdenesComprasComponent;
  let fixture: ComponentFixture<OrdenesComprasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdenesComprasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenesComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
