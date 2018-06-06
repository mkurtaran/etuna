import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { SharedService } from '../../services/shared.service';
import { Alert } from '../alert/alert.model';
import { share } from 'rxjs/operator/share';
import { del } from 'selenium-webdriver/http';


@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  constructor(private sharedService: SharedService) {

    /*sharedService.changeEmitted$.subscribe(
      alert => {
        let alertMessage = alert as Alert;
        this.showAlertWithType(alertMessage.message, alertMessage.delay, alertMessage.alertType);

      });*/

    sharedService.mySubscribe(AlertComponent.name,
      sharedService.changeEmitted$,
      (
        alert => {
          let alertMessage = alert as Alert;
          this.showAlertWithType(alertMessage.message, alertMessage.delay, alertMessage.alertType);
        })
    );
  }

  staticAlertClosed = true;
  message: string = "default message";
  delay: number = 0;
  alertType: string = "alert-primary";

  ngOnInit(): void {

  }

  showAlert(message: string) {
    this.showAlertWithDelay(message, this.delay);
  }

  showAlertWithDelay(message: string, delay: number) {
    this.showAlertWithType(message, delay, this.alertType);
  }

  showAlertWithType(message: string, delay: number, alertType: string) {
    this.message = message;
    this.delay = delay;
    this.alertType = alertType;

    this.staticAlertClosed = false;
    if (this.delay > 0) {
      setTimeout(() => this.staticAlertClosed = true, this.delay);
    }

  }

  ngOnDestroy() {
    this.sharedService.disposeClass(AlertComponent.name);
  }




}
