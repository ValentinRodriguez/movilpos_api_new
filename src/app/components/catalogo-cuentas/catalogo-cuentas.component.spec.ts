import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CatalogoCuentasComponent } from './catalogo-cuentas.component';

describe('CatalogoCuentasComponent', () => {
  let component: CatalogoCuentasComponent;
  let fixture: ComponentFixture<CatalogoCuentasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogoCuentasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogoCuentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
