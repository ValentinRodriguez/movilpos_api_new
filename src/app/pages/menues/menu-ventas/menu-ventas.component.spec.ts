import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MenuVentasComponent } from './menu-ventas.component';

describe('MenuVentasComponent', () => {
  let component: MenuVentasComponent;
  let fixture: ComponentFixture<MenuVentasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuVentasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
