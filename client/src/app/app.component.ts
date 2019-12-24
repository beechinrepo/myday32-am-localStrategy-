import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";
import { MyService } from './myservice';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constru
  performLogin(form: NgForm) {
    console.info(form.value);
    this.mySvc
  }
}
