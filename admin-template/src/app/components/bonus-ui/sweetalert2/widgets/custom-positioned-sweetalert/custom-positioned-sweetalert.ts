import { Component } from '@angular/core';

import Swal from 'sweetalert2';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-custom-positioned-sweetalert',
  imports: [Card],
  templateUrl: './custom-positioned-sweetalert.html',
  styleUrl: './custom-positioned-sweetalert.scss',
})
export class CustomPositionedSweetalert {
  open() {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Your work has been saved',
      showConfirmButton: false,
      timer: 1500,
    });
  }
}
