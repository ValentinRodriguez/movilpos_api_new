import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RightMenuPageComponent } from './right-menu-page.component';

describe('RightMenuPageComponent', () => {
  let component: RightMenuPageComponent;
  let fixture: ComponentFixture<RightMenuPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RightMenuPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightMenuPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
