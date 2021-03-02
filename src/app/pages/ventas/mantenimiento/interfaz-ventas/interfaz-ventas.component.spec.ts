import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InterfazVentasComponent } from './interfaz-ventas.component';

describe('InterfazVentasComponent', () => {
  let component: InterfazVentasComponent;
  let fixture: ComponentFixture<InterfazVentasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InterfazVentasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfazVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
