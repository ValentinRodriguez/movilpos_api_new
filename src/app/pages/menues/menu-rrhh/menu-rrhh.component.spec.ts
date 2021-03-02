import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MenuRrhhComponent } from './menu-rrhh.component';

describe('MenuRrhhComponent', () => {
  let component: MenuRrhhComponent;
  let fixture: ComponentFixture<MenuRrhhComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuRrhhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuRrhhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
