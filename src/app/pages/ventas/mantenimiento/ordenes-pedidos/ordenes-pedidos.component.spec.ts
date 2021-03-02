import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrdenesPedidosComponent } from './ordenes-pedidos.component';

describe('OrdenesPedidosComponent', () => {
  let component: OrdenesPedidosComponent;
  let fixture: ComponentFixture<OrdenesPedidosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdenesPedidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenesPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
