import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MenuContabilidadGeneralComponent } from './menu-contabilidad-general.component';

describe('MenuContabilidadGeneralComponent', () => {
  let component: MenuContabilidadGeneralComponent;
  let fixture: ComponentFixture<MenuContabilidadGeneralComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuContabilidadGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuContabilidadGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
