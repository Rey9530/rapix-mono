import { NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import {
  internationalizationMenu,
  internationalizationMenu2,
} from '../../shared/data/internationalization';
import { language } from './../../shared/data/header';

@Component({
  selector: 'app-internationalization',
  imports: [TranslatePipe, NgTemplateOutlet],
  templateUrl: './internationalization.html',
  styleUrl: './internationalization.scss',
})
export class Internationalization {
  private translate = inject(TranslateService);

  public languages = language;
  public internationalizationMenu = internationalizationMenu;
  public internationalizationMenu2 = internationalizationMenu2;

  constructor() {
    this.translate.use('en');
  }

  handleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target.value;

    if (value) {
      this.translate.use(value);
    }
  }
}
