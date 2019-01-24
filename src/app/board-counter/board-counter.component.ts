import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board-counter',
  templateUrl: './board-counter.component.html',
  styleUrls: ['./board-counter.component.css']
})
export class BoardCounterComponent implements OnInit {

  count = 0;

  constructor() { }

  ngOnInit() {
  }

}
