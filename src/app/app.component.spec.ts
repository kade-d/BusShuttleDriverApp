import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';



describe('AppComponent', () => {
let component: AppComponent;
let fixture: ComponentFixture<AppComponent>;
let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        FormsModule,
        RouterTestingModule
      ],
      providers: [
        HttpClient,
        HttpHandler
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    // fixture.detectChanges;
  });

  it('should create the component.', () => {
    expect(component).toBeTruthy();
  });
});


