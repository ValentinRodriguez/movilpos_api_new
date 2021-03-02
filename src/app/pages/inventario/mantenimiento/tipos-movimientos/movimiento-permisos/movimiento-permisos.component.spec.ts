import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MovimientoPermisosComponent } from './movimiento-permisos.component';

describe('MovimientoPermisosComponent', () => {
  let component: MovimientoPermisosComponent;
  let fixture: ComponentFixture<MovimientoPermisosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MovimientoPermisosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovimientoPermisosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
