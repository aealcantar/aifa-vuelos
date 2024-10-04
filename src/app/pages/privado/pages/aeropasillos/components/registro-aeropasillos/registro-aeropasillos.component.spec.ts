import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroAeropasillosComponent } from './registro-aeropasillos.component';

describe('RegistroAeropasillosComponent', () => {
  let component: RegistroAeropasillosComponent;
  let fixture: ComponentFixture<RegistroAeropasillosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroAeropasillosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistroAeropasillosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
