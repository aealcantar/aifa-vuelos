import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroAerocaresComponent } from './registro-aerocares.component';

describe('RegistroAerocaresComponent', () => {
  let component: RegistroAerocaresComponent;
  let fixture: ComponentFixture<RegistroAerocaresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroAerocaresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistroAerocaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
