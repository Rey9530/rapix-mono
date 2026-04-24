import { Component } from '@angular/core';

import Swal from 'sweetalert2';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-date-sweetalert',
  imports: [Card],
  templateUrl: './date-sweetalert.html',
  styleUrl: './date-sweetalert.scss',
})
export class DateSweetalert {
  async open() {
    const { value: date } = await Swal.fire({
      title: 'Select departure date',
      input: 'date',
      didOpen: () => {
        const today = new Date().toISOString();
        const inputElement = Swal.getInput();
        if (inputElement) {
          inputElement.min = today.split('T')[0];
        }
      },
    });
    if (date) {
      Swal.fire('Departure date', date);
    }
  }
}
