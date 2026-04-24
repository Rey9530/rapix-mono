import { Component } from '@angular/core';

import {
  Select2Module,
  Select2Data,
  Select2UpdateEvent,
} from 'ng-select2-component';

import { country } from '../../../../shared/data/country';

@Component({
  selector: 'app-information',
  imports: [Select2Module],
  templateUrl: './information.html',
  styleUrl: './information.scss',
})
export class Information {
  public country: Select2Data = country;
  public states: Select2Data = [];

  onCountryChange(event: Select2UpdateEvent) {
    const selectedCountryValue = event.value;

    const selectedCountry = this.country.find(
      (country) => 'value' in country && country.value === selectedCountryValue,
    );

    if (selectedCountry && selectedCountry.data) {
      this.states = selectedCountry?.data || [];
    }
  }
}
