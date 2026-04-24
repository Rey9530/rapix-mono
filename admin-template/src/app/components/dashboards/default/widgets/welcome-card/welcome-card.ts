import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-welcome-card',
  imports: [RouterModule, Card],
  templateUrl: './welcome-card.html',
  styleUrl: './welcome-card.scss',
})
export class WelcomeCard {
  public minute: ReturnType<typeof setInterval>;
  public second: ReturnType<typeof setInterval>;
  public hour: ReturnType<typeof setInterval>;
  public time: Date = new Date();
  public today: number = Date.now();
  public dates = new Date().getDate();
  public month = new Date().getMonth();
  public year = new Date().getFullYear();
  public date: { year: number; month: number } | string;

  setTime() {
    this.minute = setInterval(function () {
      var second = new Date().getSeconds();
      var secondDegree = second * 6;
      var secondRotate = 'rotate(' + secondDegree + 'deg)';
      document.getElementById('second')!.style.transform = secondRotate;
    }, 1000);
    this.second = setInterval(function () {
      var mins = new Date().getMinutes();
      var minuteDegree = mins * 6;
      var minuteRotate = 'rotate(' + minuteDegree + 'deg)';
      document.getElementById('minute')!.style.transform = minuteRotate;
    }, 1000);
    this.hour = setInterval(function () {
      var hour = new Date().getHours();
      var mints = new Date().getMinutes();
      var times = new Date();

      document.getElementById('txt')!.innerHTML = times.toLocaleString(
        'en-US',
        { hour: 'numeric', minute: 'numeric', hour12: true },
      );

      var hourDegree = hour * 30 + mints / 2;
      var hourRotate = 'rotate(' + hourDegree + 'deg)';
      document.getElementById('hour')!.style.transform = hourRotate;
    }, 1000);
  }

  ngOnInit() {
    this.setTime();
  }

  ngOnDestroy() {
    if (this.minute) {
      clearInterval(this.minute);
    }
    if (this.second) {
      clearInterval(this.second);
    }
    if (this.hour) {
      clearInterval(this.hour);
    }
  }
}
