import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MenuTiendaOnlineComponent } from './menu-tienda-online.component';

describe('MenuTiendaOnlineComponent', () => {
  let component: MenuTiendaOnlineComponent;
  let fixture: ComponentFixture<MenuTiendaOnlineComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuTiendaOnlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuTiendaOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
