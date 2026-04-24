import { SafeHtml } from '@angular/platform-browser';

export interface ICountry {
  id: number;
  country_name: SafeHtml;
  flag: string;
  area: number;
  population: number;
}
