import { Inspection } from './../Models/inspection-item';
import { Component,  OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InspectionService } from './../Services/inspection.service';

@Component({
  selector: 'app-pre-inspection',
  templateUrl: './pre-inspection.component.html',
  styleUrls: ['./pre-inspection.component.css']
})
export class PreInspectionComponent implements OnInit {

  allItems = [];
  preItems = [];

  constructor(private router: Router, private inspecService: InspectionService) {
}
  buttonState() {
    return !this.preItems.every(_ => _.state);
  }

  ngOnInit() {
    this.inspecService.getDBItems()
    .subscribe(
      (jsonData: Inspection) => {
        // tslint:disable-next-line:forin We know this already works.
        for (const x in jsonData.data) {
          this.allItems.push(new Inspection( jsonData.data[x].id, jsonData.data[x].inspection_item_name,
            jsonData.data[x].pre_trip_inspection, jsonData.data[x].post_trip_inspection));

            if (jsonData.data[x].pre_trip_inspection === '1') {
              this.preItems.push(new Inspection( jsonData.data[x].id, jsonData.data[x].inspection_item_name,
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


