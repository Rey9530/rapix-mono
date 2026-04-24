import { Component, input } from '@angular/core';

import { SvgIcon } from '../../../../shared/components/ui/svg-icon/svg-icon';

@Component({
  selector: 'app-completed',
  imports: [SvgIcon],
  templateUrl: './completed.html',
  styleUrl: './completed.scss',
})
export class Completed {
  readonly type = input<string>('simple');
}
