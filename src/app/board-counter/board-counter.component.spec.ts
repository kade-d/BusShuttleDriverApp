import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardCounterComponent } from './board-counter.component';

describe('BoardCounterComponent', () => {
  let component: BoardCounterComponent;
  let fixture: ComponentFixture<BoardCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
