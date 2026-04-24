import { Component } from '@angular/core';

import { CarouselModule } from 'ngx-owl-carousel-o';

import { Card } from '../../../../../shared/components/ui/card/card';
import { birthdayUsers } from '../../../../../shared/data/dashboard/hr';

@Component({
  selector: 'app-today-birthday',
  imports: [CarouselModule, Card],
  templateUrl: './today-birthday.html',
  styleUrl: './today-birthday.scss',
})
export class TodayBirthday {
  public birthdayUsers = birthdayUsers;

  public options = {
    loop: true,
    mouseDrag: false,
    autoplay: true,
    dots: false,
    nav: true,
    navSpeed: 1000,
    setInterval: true,
    navText: [
      '<i class="icon-angle-left"></i>',
      '<i class="icon-angle-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
    },
  };
}
