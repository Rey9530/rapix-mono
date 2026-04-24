import { Component, viewChild } from '@angular/core';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {
  CarouselComponent,
  CarouselModule,
  OwlOptions,
  SlidesOutputData,
} from 'ngx-owl-carousel-o';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions1 } from '../../../../../shared/data/common';
import { priorityTask } from '../../../../../shared/data/dashboard/projects';

@Component({
  selector: 'app-priority-task',
  imports: [CarouselModule, NgbTooltipModule, Card],
  templateUrl: './priority-task.html',
  styleUrl: './priority-task.scss',
})
export class PriorityTask {
  readonly carousel = viewChild<CarouselComponent>('carousel');

  public priorityTask = priorityTask;
  public cardToggleOption = cardToggleOptions1;
  public activeSlide: string = '';

  public options: OwlOptions = {
    loop: false,
    mouseDrag: false,
    autoplay: false,
    dots: false,
    nav: true,
    navSpeed: 1000,
    margin: 20,
    navText: [
      ' <div class="prev"><i class="fa-solid fa-arrow-right-long fa-flip-horizontal"></i></div>',
      '  <div class="next"><i class="fa-solid fa-arrow-right-long"></i></div>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      606: {
        items: 2,
      },
      906: {
        items: 3,
      },
    },
  };

  onCarouselLoad() {
    this.activeSlide = this.priorityTask[0].id.toString();
  }

  onSlideChange(event: SlidesOutputData) {
    if (this.carousel() && event && event.slides && event.slides.length > 0) {
      const firstVisibleSlideIndex = event.startPosition;
      if (
        firstVisibleSlideIndex !== undefined &&
        firstVisibleSlideIndex < this.priorityTask.length
      ) {
        this.activeSlide =
          this.priorityTask[firstVisibleSlideIndex].id.toString();
      }
    }
  }
}
