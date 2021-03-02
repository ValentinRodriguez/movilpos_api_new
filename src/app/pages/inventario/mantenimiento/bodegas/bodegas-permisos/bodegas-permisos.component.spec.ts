import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BodegasPermisosComponent } from './bodegas-permisos.component';

describe('BodegasPermisosComponent', () => {
  let component: BodegasPermisosComponent;
  let fixture: ComponentFixture<BodegasPermisosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BodegasPermisosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodegasPermisosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
