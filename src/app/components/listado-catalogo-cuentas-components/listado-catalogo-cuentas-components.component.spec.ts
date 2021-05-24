import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoCatalogoCuentasComponentsComponent } from './listado-catalogo-cuentas-components.component';

describe('ListadoCatalogoCuentasComponentsComponent', () => {
  let component: ListadoCatalogoCuentasComponentsComponent;
  let fixture: ComponentFixture<ListadoCatalogoCuentasComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoCatalogoCuentasComponentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoCatalogoCuentasComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
