import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListadoDireccionesComponent } from './listado-direcciones.component';

describe('ListadoDireccionesComponent', () => {
  let component: ListadoDireccionesComponent;
  let fixture: ComponentFixture<ListadoDireccionesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoDireccionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoDireccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
