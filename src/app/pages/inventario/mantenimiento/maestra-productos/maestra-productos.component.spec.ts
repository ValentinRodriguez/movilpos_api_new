import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MaestraProductosComponent } from './maestra-productos.component';

describe('MaestraProductosComponent', () => {
  let component: MaestraProductosComponent;
  let fixture: ComponentFixture<MaestraProductosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MaestraProductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaestraProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
