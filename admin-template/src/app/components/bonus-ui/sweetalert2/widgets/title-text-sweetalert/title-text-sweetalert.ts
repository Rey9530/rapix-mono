import { Component } from '@angular/core';

import Swal from 'sweetalert2';

import { Card } from './../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-title-text-sweetalert',
  imports: [Card],
  templateUrl: './title-text-sweetalert.html',
  styleUrl: './title-text-sweetalert.scss',
})
export class TitleTextSweetalert {
  open() {
    Swal.fire({
      title: 'The Internet?',
      text: 'That thing is still around?',
      icon: 'question',
    });
  }
}
