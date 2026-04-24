import { Component } from '@angular/core';

import Swal from 'sweetalert2';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-password-generator-sweetalert',
  imports: [Card],
  templateUrl: './password-generator-sweetalert.html',
  styleUrl: './password-generator-sweetalert.scss',
})
export class PasswordGeneratorSweetalert {
  async open() {
    const { value: password } = await Swal.fire({
      title: 'Enter your password',
      input: 'password',
      inputLabel: 'Password',
      inputPlaceholder: 'Enter your password',
      inputAttributes: {
        maxlength: '10',
        autocapitalize: 'off',
        autocorrect: 'off',
      },
    });
    if (password) {
      Swal.fire(`Entered password: ${password}`);
    }
  }
}
