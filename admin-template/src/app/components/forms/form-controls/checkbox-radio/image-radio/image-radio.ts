import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { imageRadio } from '../../../../../shared/data/form-control';

@Component({
  selector: 'app-image-radio',
  imports: [Card],
  templateUrl: './image-radio.html',
  styleUrl: './image-radio.scss',
})
export class ImageRadio {
  public imageRadio = imageRadio;
}
