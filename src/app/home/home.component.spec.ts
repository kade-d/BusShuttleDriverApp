import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { FormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { SwUpdate, ServiceWorkerModule } from '@angular/service-worker';

describe('HomeComponent', () => {
let component: HomeComponent;
let fixture: ComponentFixture<HomeComponent>;
let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent
      ],
      imports: [
        FormsModule,
        ServiceWorkerModule.register('', {enabled: false})
      ],
      providers: [
        HttpClient,
        HttpHandler,
        SwUpdate,
        ServiceWorkerModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    // fixture.detectChanges;
  });
});


