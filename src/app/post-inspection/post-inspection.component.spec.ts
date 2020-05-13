import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostInspectionComponent } from './post-inspection.component';

describe('PostInspectionComponent', () => {
  let component: PostInspectionComponent;
  let fixture: ComponentFixture<PostInspectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostInspectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
