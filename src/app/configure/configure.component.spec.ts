import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureComponent } from './configure.component';
import { HttpClient } from 'selenium-webdriver/http';
import { LogService } from '../Services/log.service';
import { HttpClientModule } from '@angular/common/http';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ConfigureComponent', () => {
  let component: ConfigureComponent;
  let fixture: ComponentFixture<ConfigureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
      HttpClientModule,
      BrowserAnimationsModule
      ],
      declarations: [ ConfigureComponent ],
      providers: [
        LogService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
