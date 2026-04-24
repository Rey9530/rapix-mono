import { Component } from '@angular/core';

import { AnimatedButton } from './animated-button/animated-button';
import { BasicRadioCheckbox } from './basic-radio-checkbox/basic-radio-checkbox';
import { CustomCheckbox } from './custom-checkbox/custom-checkbox';
import { CustomRadioButton } from './custom-radio-button/custom-radio-button';
import { DefaultCheckbox } from './default-checkbox/default-checkbox';
import { DefaultRadioButton } from './default-radio-button/default-radio-button';
import { DefaultSwitch } from './default-switch/default-switch';
import { ImageCheckbox } from './image-checkbox/image-checkbox';
import { ImageRadio } from './image-radio/image-radio';
import { InlineInputTypes } from './inline-input-types/inline-input-types';
import { OutlineCheckboxStyle } from './outline-checkbox-style/outline-checkbox-style';
import { RadioToggleButton } from './radio-toggle-button/radio-toggle-button';

@Component({
  selector: 'app-checkbox-radio',
  imports: [
    DefaultCheckbox,
    CustomCheckbox,
    DefaultRadioButton,
    ImageCheckbox,
    ImageRadio,
    CustomRadioButton,
    DefaultSwitch,
    InlineInputTypes,
    AnimatedButton,
    BasicRadioCheckbox,
    RadioToggleButton,
    OutlineCheckboxStyle,
  ],
  templateUrl: './checkbox-radio.html',
  styleUrl: './checkbox-radio.scss',
})
export class CheckboxRadio {}
