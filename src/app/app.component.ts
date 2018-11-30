import { Component, OnInit } from '@angular/core';

import { Car } from './car';
import { CarService } from './car.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  cars: Car[];
  error = '';
  success = '';
  total = 0;

  car = new Car(0, '', '', '', '', '');

  constructor(private carService: CarService) {
  }

  ngOnInit() {
    this.getCars();
    
  }

  calculateTotal(): void {
    this.total = 0;
    for(let i = 0; i < this.cars.length; i++){
      this.total = this.total + Number(this.cars[i].boarded);
      console.log(this.total);
    }
  }
  getCars(): void {
    this.carService.getAll().subscribe(
      (res: Car[]) => {
        this.cars = res;
        this.calculateTotal()
      },
      (err) => {
        this.error = err;
      }
    );
  }

  getGreen(): void {
    this.carService.getAllGreen().subscribe(
      (res: Car[]) => {
        this.cars = res;
        this.calculateTotal()
      },
      (err) => {
        this.error = err;
      }
    );
  }

  getRed(): void {
    this.carService.getAllRed().subscribe(
      (res: Car[]) => {
        this.cars = res;
        this.calculateTotal()
      },
      (err) => {
        this.error = err;
      }
    );
  }

  addCar(f) {
    this.resetErrors();

    this.carService.store(this.car)
      .subscribe(
        (res: Car[]) => {
          // Update the list of cars
          this.cars = res;

          // Inform the user
          this.success = 'Created successfully';

          // Reset the form
          f.reset();
        },
        (err) => this.error = err
      );
  }

  updateCar(name, price, id) {
    this.resetErrors();

    this.carService.update({ model: name.value, price: price.value, id: +id })
      .subscribe(
        (res) => {
          this.cars    = res;
          this.success = 'Updated successfully';
        },
        (err) => this.error = err
      );
  }

  deleteCar(id) {
    this.resetErrors();

    this.carService.delete(+id)
      .subscribe(
        (res: Car[]) => {
          this.cars = res;
          this.success = 'Deleted successfully';
        },
        (err) => this.error = err
      );
  }

  private resetErrors(){
    this.success = '';
    this.error   = '';
  }

}
