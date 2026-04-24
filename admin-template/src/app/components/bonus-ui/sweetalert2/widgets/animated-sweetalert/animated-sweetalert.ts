import { Component } from '@angular/core';

import Swal from 'sweetalert2';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-animated-sweetalert',
  imports: [Card],
  templateUrl: './animated-sweetalert.html',
  styleUrl: './animated-sweetalert.scss',
})
export class AnimatedSweetalert {
  open() {
    Swal.fire({
      title: 'Custom animation with Animate.css',
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `,
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `,
      },
    });
  }
}
