import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { imageCheckbox } from '../../../../../shared/data/form-control';

@Component({
  selector: 'app-image-checkbox',
  imports: [Card],
  templateUrl: './image-checkbox.html',
  styleUrl: './image-checkbox.scss',
})
export class ImageCheckbox {
  public imageCheckbox = imageCheckbox;
}
