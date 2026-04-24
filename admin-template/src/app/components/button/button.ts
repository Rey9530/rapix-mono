import { Component } from '@angular/core';

import { BlockLevelButton } from './widgets/block-level-button/block-level-button';
import { BoldBorderOutlineButton } from './widgets/bold-border-outline-button/bold-border-outline-button';
import { ButtonGroup } from './widgets/button-group/button-group';
import { ButtonSizes } from './widgets/button-sizes/button-sizes';
import { ButtonVariations } from './widgets/button-variations/button-variations';
import { DashedBorder } from './widgets/dashed-border/dashed-border';
import { DefaultsButtons } from './widgets/defaults-buttons/defaults-buttons';
import { DisableButton } from './widgets/disable-button/disable-button';
import { FlatButtons } from './widgets/flat-buttons/flat-buttons';
import { IconWithTitle } from './widgets/icon-with-title/icon-with-title';
import { IconsButton } from './widgets/icons-button/icons-button';
import { LoaderButton } from './widgets/loader-button/loader-button';
import { OutlineButtonSizes } from './widgets/outline-button-sizes/outline-button-sizes';
import { OutlineRoundedButton } from './widgets/outline-rounded-button/outline-rounded-button';
import { OutlineRoundedSizes } from './widgets/outline-rounded-sizes/outline-rounded-sizes';
import { RadialButton } from './widgets/radial-button/radial-button';
import { RadioCheckboxAnimatedButton } from './widgets/radio-checkbox-animated-button/radio-checkbox-animated-button';
import { RippleButton } from './widgets/ripple-button/ripple-button';
import { RoundedButton } from './widgets/rounded-button/rounded-button';
import { RoundedSizes } from './widgets/rounded-sizes/rounded-sizes';

@Component({
  selector: 'app-button',
  imports: [
    FlatButtons,
    DefaultsButtons,
    ButtonSizes,
    OutlineButtonSizes,
    RoundedButton,
    OutlineRoundedButton,
    RoundedSizes,
    OutlineRoundedSizes,
    DisableButton,
    IconsButton,
    IconWithTitle,
    DashedBorder,
    LoaderButton,
    RippleButton,
    ButtonGroup,
    BlockLevelButton,
    ButtonVariations,
    BoldBorderOutlineButton,
    RadioCheckboxAnimatedButton,
    RadialButton,
  ],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {}
