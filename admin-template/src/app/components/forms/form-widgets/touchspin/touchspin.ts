import { Component } from '@angular/core';

import { ButtonWithPrefixPostfix } from './button-with-prefix-postfix/button-with-prefix-postfix';
import { DefaultTouchspin } from './default-touchspin/default-touchspin';
import { IconWithPrefixPostfix } from './icon-with-prefix-postfix/icon-with-prefix-postfix';
import { OutlineTouchspin } from './outline-touchspin/outline-touchspin';
import { RoundedTouchspin } from './rounded-touchspin/rounded-touchspin';

@Component({
  selector: 'app-touchspin',
  imports: [
    DefaultTouchspin,
    OutlineTouchspin,
    IconWithPrefixPostfix,
    ButtonWithPrefixPostfix,
    RoundedTouchspin,
  ],
  templateUrl: './touchspin.html',
  styleUrl: './touchspin.scss',
})
export class Touchspin {}
