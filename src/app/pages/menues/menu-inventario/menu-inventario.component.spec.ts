import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MenuInventarioComponent } from './menu-inventario.component';

describe('MenuInventarioComponent', () => {
  let component: MenuInventarioComponent;
  let fixture: ComponentFixture<MenuInventarioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuInventarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
