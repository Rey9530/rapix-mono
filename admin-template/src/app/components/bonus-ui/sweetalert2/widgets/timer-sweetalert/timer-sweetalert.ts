import { Component } from '@angular/core';

import Swal from 'sweetalert2';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-timer-sweetalert',
  imports: [Card],
  templateUrl: './timer-sweetalert.html',
  styleUrl: './timer-sweetalert.scss',
})
export class TimerSweetalert {
  open() {
    let timerInterval: ReturnType<typeof setInterval>;
    Swal.fire({
      title: 'Auto close alert!',
      html: 'I will close in <b></b> milliseconds.',
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal?.getPopup()?.querySelector('b');
        if (timer)
          timerInterval = setInterval(() => {
            timer.textContent = `${Swal.getTimerLeft()}`;
          }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    });
  }
}
