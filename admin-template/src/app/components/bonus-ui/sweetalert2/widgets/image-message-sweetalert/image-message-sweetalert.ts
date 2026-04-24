import { Component } from '@angular/core';

import Swal from 'sweetalert2';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-image-message-sweetalert',
  imports: [Card],
  templateUrl: './image-message-sweetalert.html',
  styleUrl: './image-message-sweetalert.scss',
})
export class ImageMessageSweetalert {
  open() {
    Swal.fire({
      title: 'Sweet!',
      text: 'Modal with a custom image.',
      imageUrl: 'https://unsplash.it/400/200',
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: 'Custom image',
    });
  }
}
