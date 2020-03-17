import { InspectionService } from './../Services/inspection.service';
import { Component, OnInit } from '@angular/core';
import { Inspection } from './../Models/inspection-item';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-inspection',
  templateUrl: './post-inspection.component.html',
  styleUrls: ['./post-inspection.component.css']
})
export class PostInspectionComponent implements OnInit {
  allItems = [];
  postItems = [];

  constructor(
    private inspecService: InspectionService,
    private router: Router
  ) { }


  ngOnInit() {
    this.inspecService.getDBItems()
    .subscribe(
      (jsonData: Inspection) => {
        // tslint:disable-next-line:forin We know this already works.
        for (const x in jsonData.data) {
          this.allItems.push(new Inspection( jsonData.data[x].id, jsonData.data[x].inspection_item_name,
            jsonData.data[x].pre_trip_inspection, jsonData.data[x].post_trip_inspection));

            if (jsonData.data[x].post_trip_inspection === '1') {
              this.postItems.push(new Inspection( jsonData.data[x].id, jsonData.data[x].inspection_item_name,
                jsonData.data[x].pre_trip_inspection, jsonData.data[x].post_trip_inspection));
            }
        }
      }
    );



  }
  validateStartButton() {
    this.router.navigate(['/form']);
  }
}
