import { Component } from '@angular/core';

import Swal from 'sweetalert2';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-basic-sweetalert',
  imports: [Card],
  templateUrl: './basic-sweetalert.html',
  styleUrl: './basic-sweetalert.scss',
})
export class BasicSweetalert {
  open() {
    Swal.fire('Welcome! to the cuba theme!');
  }
}
