import { Component } from '@angular/core';

import { Timer } from '../timer/timer';

@Component({
  selector: 'app-coming-soon',
  imports: [Timer],
  templateUrl: './coming-soon.html',
  styleUrl: './coming-soon.scss',
})
export class ComingSoon {}
