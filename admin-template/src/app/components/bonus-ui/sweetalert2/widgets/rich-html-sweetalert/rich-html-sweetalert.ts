import { Component } from '@angular/core';

import Swal from 'sweetalert2';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-rich-html-sweetalert',
  imports: [Card],
  templateUrl: './rich-html-sweetalert.html',
  styleUrl: './rich-html-sweetalert.scss',
})
export class RichHtmlSweetalert {
  open() {
    Swal.fire({
      title: '<strong>HTML <u>example</u></strong>',
      icon: 'info',
      html: `
        You can use <b>bold text</b>,
        <a href="javascript:void(0)">links</a>,
        and other HTML tags
      `,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: `
        <i class="fa fa-thumbs-up"></i> Great!
      `,
      confirmButtonAriaLabel: 'Thumbs up, great!',
      cancelButtonText: `
        <i class="fa fa-thumbs-down"></i>
      `,
      cancelButtonAriaLabel: 'Thumbs down',
    });
  }
}
