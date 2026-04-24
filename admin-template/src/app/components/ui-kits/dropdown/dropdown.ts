import { Component } from '@angular/core';

import { AlignmentOptionDropdown } from './widgets/alignment-option-dropdown/alignment-option-dropdown';
import { BasicDropdown } from './widgets/basic-dropdown/basic-dropdown';
import { DarkDropdown } from './widgets/dark-dropdown/dark-dropdown';
import { DividerDropdown } from './widgets/divider-dropdown/divider-dropdown';
import { DropdownSizing } from './widgets/dropdown-sizing/dropdown-sizing';
import { HeadingDropdown } from './widgets/heading-dropdown/heading-dropdown';
import { HelperCards } from './widgets/helper-cards/helper-cards';
import { InputTypeDropdown } from './widgets/input-type-dropdown/input-type-dropdown';
import { JustifyContents } from './widgets/justify-contents/justify-contents';
import { RoundedDropdown } from './widgets/rounded-dropdown/rounded-dropdown';
import { SplitDropdown } from './widgets/split-dropdown/split-dropdown';
import { UniqueDropdown } from './widgets/unique-dropdown/unique-dropdown';

@Component({
  selector: 'app-dropdown',
  imports: [
    BasicDropdown,
    RoundedDropdown,
    SplitDropdown,
    HeadingDropdown,
    InputTypeDropdown,
    DarkDropdown,
    UniqueDropdown,
    JustifyContents,
    AlignmentOptionDropdown,
    HelperCards,
    DividerDropdown,
    DropdownSizing,
  ],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
})
export class Dropdown {}
