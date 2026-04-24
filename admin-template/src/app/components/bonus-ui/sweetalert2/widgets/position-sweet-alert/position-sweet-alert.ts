import { Component, input } from '@angular/core';

import Swal, { SweetAlertPosition } from 'sweetalert2';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-position-sweet-alert',
  imports: [Card],
  templateUrl: './position-sweet-alert.html',
  styleUrl: './position-sweet-alert.scss',
})
export class PositionSweetAlert {
  readonly title = input<string>();
  readonly position = input<SweetAlertPosition>();
  readonly buttonColor = input<string>();

  open() {
    Swal.fire({
      title: 'Signed in successfully',
      icon: 'success',
      toast: true,
      position: this.position(),
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }
}
