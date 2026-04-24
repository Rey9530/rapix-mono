import { Component } from '@angular/core';

import Swal from 'sweetalert2';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-dismiss-sweetalert',
  imports: [Card],
  templateUrl: './dismiss-sweetalert.html',
  styleUrl: './dismiss-sweetalert.scss',
})
export class DismissSweetalert {
  open() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong!',
      footer: '<a href="#">Why do I have this issue?</a>',
    });
  }
}
