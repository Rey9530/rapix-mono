import { Component } from '@angular/core';

import { Alerts } from './alerts/alerts';
import { Badges } from './badges/badges';
import { Checkbox } from './checkbox/checkbox';
import { Input } from './input/input';
import { Progressbar } from './progressbar/progressbar';
import { RadioButton } from './radio-button/radio-button';
import { Select } from './select/select';
import { Switch } from './switch/switch';
import { TooltipTriggers } from './tooltip-triggers/tooltip-triggers';
import { UiComponents } from './ui-components/ui-components';

@Component({
  selector: 'app-table-components',
  imports: [
    UiComponents,
    Alerts,
    Progressbar,
    Checkbox,
    RadioButton,
    Select,
    Input,
    Badges,
    TooltipTriggers,
    Switch,
  ],
  templateUrl: './table-components.html',
  styleUrl: './table-components.scss',
})
export class TableComponents {}
