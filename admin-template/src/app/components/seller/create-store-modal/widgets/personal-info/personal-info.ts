import { Component } from '@angular/core';

import {
  Select2Data,
  Select2Module,
  Select2UpdateEvent,
} from 'ng-select2-component';

import { country } from '../../../../../shared/data/country';

@Component({
  selector: 'app-personal-info',
  imports: [Select2Module],
  templateUrl: './personal-info.html',
  styleUrl: './personal-info.scss',
})
export class PersonalInfo {
  public country: Select2Data = country;
  public states: Select2Data = [];
  public city: Select2Data = [];

  onCountryChange(event: Select2UpdateEvent) {
    const selectedCountryValue = event.value;
    const selectedCountry = this.country.find(
      (country) => 'value' in country && country.value === selectedCountryValue,
    );
    if (selectedCountry && selectedCountry.data) {
      this.states = selectedCountry?.data || [];
    }
  }

  onStateChange(event: Select2UpdateEvent) {
    const selectedStateValue = event.value;
    const selectedState = this.states.find(
      (state) => 'value' in state && state.value === selectedStateValue,
    );
    if (selectedState && selectedState.data) {
      this.city = selectedState.data;
    } else {
      this.city = [];
    }
  }
}
