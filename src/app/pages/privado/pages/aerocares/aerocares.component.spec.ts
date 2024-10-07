import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AerocaresComponent } from './aerocares.component';

describe('AerocaresComponent', () => {
  let component: AerocaresComponent;
  let fixture: ComponentFixture<AerocaresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AerocaresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AerocaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
