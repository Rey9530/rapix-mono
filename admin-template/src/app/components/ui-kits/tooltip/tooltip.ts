import { Component } from '@angular/core';

import { BasicTooltip } from './widgets/basic-tooltip/basic-tooltip';
import { ColoredTooltip } from './widgets/colored-tooltip/colored-tooltip';
import { DisabledTooltip } from './widgets/disabled-tooltip/disabled-tooltip';
import { IconTooltip } from './widgets/icon-tooltip/icon-tooltip';
import { LightTooltip } from './widgets/light-tooltip/light-tooltip';
import { SvgTooltip } from './widgets/svg-tooltip/svg-tooltip';
import { TooltipDirection } from './widgets/tooltip-direction/tooltip-direction';
import { TooltipHtmlElement } from './widgets/tooltip-html-element/tooltip-html-element';
import { TooltipOutlined } from './widgets/tooltip-outlined/tooltip-outlined';

@Component({
  selector: 'app-tooltip',
  imports: [
    BasicTooltip,
    ColoredTooltip,
    LightTooltip,
    TooltipDirection,
    TooltipHtmlElement,
    TooltipOutlined,
    DisabledTooltip,
    SvgTooltip,
    IconTooltip,
  ],
  templateUrl: './tooltip.html',
  styleUrl: './tooltip.scss',
})
export class Tooltip {}
