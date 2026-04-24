import { Component } from '@angular/core';

import { BasicInputGroup } from './basic-input-group/basic-input-group';
import { ButtonAddons } from './button-addons/button-addons';
import { ButtonDropdown } from './button-dropdown/button-dropdown';
import { CheckboxAndRadio } from './checkbox-and-radio/checkbox-and-radio';
import { CustomFileInput } from './custom-file-input/custom-file-input';
import { CustomForms } from './custom-forms/custom-forms';
import { MultipleInput } from './multiple-input/multiple-input';
import { SegmentButton } from './segment-button/segment-button';
import { Sizing } from './sizing/sizing';
import { VariationAddons } from './variation-addons/variation-addons';

@Component({
  selector: 'app-input-groups',
  imports: [
    ButtonAddons,
    CustomForms,
    CustomFileInput,
    ButtonDropdown,
    SegmentButton,
    CheckboxAndRadio,
    Sizing,
    MultipleInput,
    BasicInputGroup,
    VariationAddons,
  ],
  templateUrl: './input-groups.html',
  styleUrl: './input-groups.scss',
})
export class InputGroups {}
