import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TransaccionesInventarioComponent } from './transacciones-inventario.component';

describe('TransaccionesInventarioComponent', () => {
  let component: TransaccionesInventarioComponent;
  let fixture: ComponentFixture<TransaccionesInventarioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TransaccionesInventarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransaccionesInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
