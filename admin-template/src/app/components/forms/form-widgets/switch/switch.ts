import { Component } from '@angular/core';

import { CommonSwitch } from './common-switch/common-switch';
import { CustomSwitch } from './custom-switch/custom-switch';
import { DisabledOutlineSwitch } from './disabled-outline-switch/disabled-outline-switch';
import { SwitchSizing } from './switch-sizing/switch-sizing';
import { SwitchWithIcons } from './switch-with-icons/switch-with-icons';
import { VariationSwitch } from './variation-switch/variation-switch';

@Component({
  selector: 'app-switch',
  imports: [
    CustomSwitch,
    DisabledOutlineSwitch,
    VariationSwitch,
    SwitchSizing,
    SwitchWithIcons,
    CommonSwitch,
  ],
  templateUrl: './switch.html',
  styleUrl: './switch.scss',
})
export class Switch {}
