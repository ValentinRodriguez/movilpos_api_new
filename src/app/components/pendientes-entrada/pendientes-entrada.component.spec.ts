import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PendientesEntradaComponent } from './pendientes-entrada.component';

describe('PendientesEntradaComponent', () => {
  let component: PendientesEntradaComponent;
  let fixture: ComponentFixture<PendientesEntradaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PendientesEntradaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendientesEntradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
