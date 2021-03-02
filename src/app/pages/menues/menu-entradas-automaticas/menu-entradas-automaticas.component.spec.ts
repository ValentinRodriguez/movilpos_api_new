import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MenuEntradasAutomaticasComponent } from './menu-entradas-automaticas.component';

describe('MenuEntradasAutomaticasComponent', () => {
  let component: MenuEntradasAutomaticasComponent;
  let fixture: ComponentFixture<MenuEntradasAutomaticasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuEntradasAutomaticasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuEntradasAutomaticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
