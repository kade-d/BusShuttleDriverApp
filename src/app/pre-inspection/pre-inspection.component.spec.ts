import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreInspectionComponent } from './pre-inspection.component';

describe('PreInspectionComponent', () => {
  let component: PreInspectionComponent;
  let fixture: ComponentFixture<PreInspectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreInspectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
