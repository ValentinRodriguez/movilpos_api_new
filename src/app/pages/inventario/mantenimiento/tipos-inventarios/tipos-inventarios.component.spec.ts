import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TiposInventariosComponent } from './tipos-inventarios.component';

describe('TiposInventariosComponent', () => {
  let component: TiposInventariosComponent;
  let fixture: ComponentFixture<TiposInventariosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TiposInventariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposInventariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
