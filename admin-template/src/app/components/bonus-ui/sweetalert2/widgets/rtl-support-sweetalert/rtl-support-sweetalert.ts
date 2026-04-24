import { Component } from '@angular/core';

import Swal from 'sweetalert2';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-rtl-support-sweetalert',
  imports: [Card],
  templateUrl: './rtl-support-sweetalert.html',
  styleUrl: './rtl-support-sweetalert.scss',
})
export class RtlSupportSweetalert {
  open() {
    Swal.fire({
      title: 'هل تريد الاستمرار؟',
      icon: 'question',
      iconHtml: '؟',
      confirmButtonText: 'نعم',
      cancelButtonText: 'لا',
      showCancelButton: true,
      showCloseButton: true,
    });
  }
}
