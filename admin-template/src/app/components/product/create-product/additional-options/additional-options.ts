import { Component, output, input } from '@angular/core';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { Inventory } from './inventory/inventory';
import { Publish } from './publish/publish';
import { SeoTags } from './seo-tags/seo-tags';
import { Shipping } from './shipping/shipping';
import { Variations } from './variations/variations';
import { additionalOptions } from '../../../../shared/data/product';

@Component({
  selector: 'app-additional-options',
  imports: [NgbNavModule, Inventory, SeoTags, Shipping, Variations, Publish],
  templateUrl: './additional-options.html',
  styleUrl: './additional-options.scss',
})
export class AdditionalOptions {
  readonly active = input<number>();
  readonly changeTab = output<number>();

  public additionalOptions = additionalOptions;
  public additionalActiveId: number = 1;

  changeTabDetails(value: number) {
    this.additionalActiveId = value;
  }

  handleChangeTab(value: number) {
    this.changeTab.emit(value);
  }
}
