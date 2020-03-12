import { Inspection } from './../Models/inspection-item';
import { Component,  OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pre-inspection',
  templateUrl: './pre-inspection.component.html',
  styleUrls: ['./pre-inspection.component.css']
})
export class PreInspectionComponent implements OnInit {
  arr: Inspection = [
    {done: true, id: 1, name: 'no item', pre: '0', post: '0'},
    {done: true, id: 2, name: 'pre item 1', pre: '1', post: '0'},
    {done: true, id: 3, name: 'pre item 2', pre: '1', post: '0'},
    {done: true, id: 4, name: 'post item 1', pre: '0', post: '1'},
    {done: true, id: 5, name: 'post item 2', pre: '0', post: '1'},
    {done: true, id: 6, name: 'both item', pre: '1', post: '1'},
];
  constructor(private router: Router) {
}

  ngOnInit() {
  }

  validateStartButton() {
      this.router.navigate(['/form']);
    }
}


