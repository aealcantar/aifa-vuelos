import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AeropasillosComponent } from './aeropasillos.component';

describe('AeropasillosComponent', () => {
  let component: AeropasillosComponent;
  let fixture: ComponentFixture<AeropasillosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AeropasillosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AeropasillosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
