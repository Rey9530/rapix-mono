import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { Select2Group, Select2Module } from 'ng-select2-component';

import { animationValues } from '../../../shared/data/animation';

@Component({
  selector: 'app-animate',
  imports: [Select2Module, NgClass],
  templateUrl: './animate.html',
  styleUrl: './animate.scss',
})
export class Animate {
  public animationValues: Select2Group[] = animationValues;
  public animation = 'bounceIn';
  public animated: boolean = false;

  animate() {
    this.animated = true;

    setTimeout(() => {
      this.animated = false;
    }, 500);
  }
}
