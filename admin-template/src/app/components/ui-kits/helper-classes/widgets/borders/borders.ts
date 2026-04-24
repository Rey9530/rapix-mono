import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-borders',
  imports: [NgClass],
  templateUrl: './borders.html',
  styleUrl: './borders.scss',
})
export class Borders {
  readonly title = input<string>();
  readonly class = input<string>('');
  readonly details = input<
    {
      class?: string;
      color?: string;
      position?: string;
    }[]
  >();
  readonly color = input<boolean>(false);
  readonly text = input<boolean>(false);
  readonly backgroundColor = input<boolean>(false);
  readonly helperText = input<string>('border');
}
