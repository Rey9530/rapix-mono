import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import Swal from 'sweetalert2';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-copy-portion-from-paragraph',
  imports: [FormsModule, Card],
  templateUrl: './copy-portion-from-paragraph.html',
  styleUrl: './copy-portion-from-paragraph.scss',
})
export class CopyPortionFromParagraph {
  public copyHighlightTxt: string =
    'Web design is the process of creating websites';
  public copyText: string = '';

  copyFunction(txt: string) {
    navigator.clipboard.writeText(txt);
    Swal.fire({
      title: 'Copied to Clipboard',
      icon: 'success',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }
}
