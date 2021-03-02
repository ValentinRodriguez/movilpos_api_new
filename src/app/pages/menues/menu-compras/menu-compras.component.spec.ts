import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MenuComprasComponent } from './menu-compras.component';

describe('MenuComprasComponent', () => {
  let component: MenuComprasComponent;
  let fixture: ComponentFixture<MenuComprasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuComprasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
