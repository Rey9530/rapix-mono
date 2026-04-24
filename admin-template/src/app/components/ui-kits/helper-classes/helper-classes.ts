import { Component } from '@angular/core';

import { BorderPosition } from './widgets/border-position/border-position';
import { BorderTypes } from './widgets/border-types/border-types';
import { Borders } from './widgets/borders/borders';
import { ExtenderBackgroundColor } from './widgets/extender-background-color/extender-background-color';
import { FontSize } from './widgets/font-size/font-size';
import { FontStyle } from './widgets/font-style/font-style';
import { FontWeight } from './widgets/font-weight/font-weight';
import { ImageSize } from './widgets/image-size/image-size';
import { Margins } from './widgets/margins/margins';
import { OneSideMargin } from './widgets/one-side-margin/one-side-margin';
import { OneSidePadding } from './widgets/one-side-padding/one-side-padding';
import { Padding } from './widgets/padding/padding';
import { TextColors } from './widgets/text-colors/text-colors';
import { Card } from '../../../shared/components/ui/card/card';
import {
  borderRadiusClasses,
  colors,
  borderWidth,
  additiveBorder,
  subtractiveBorder,
  additiveRadius,
  extendedBackgroundColors,
  borderPosition,
  colorsTwo,
  borderTypes,
} from '../../../shared/data/ui-kits/helper-classes';

@Component({
  selector: 'app-helper-classes',
  imports: [
    Card,
    Borders,
    ExtenderBackgroundColor,
    BorderPosition,
    ImageSize,
    FontStyle,
    FontWeight,
    TextColors,
    Padding,
    BorderTypes,
    OneSidePadding,
    OneSideMargin,
    Margins,
    FontSize,
  ],
  templateUrl: './helper-classes.html',
  styleUrl: './helper-classes.scss',
})
export class HelperClasses {
  public borderRadiusClasses = borderRadiusClasses;
  public colors = colors;
  public colorsTwo = colorsTwo;
  public borderWidth = borderWidth;
  public additiveBorder = additiveBorder;
  public subtractiveBorder = subtractiveBorder;
  public additiveRadius = additiveRadius;
  public extendedBackgroundColors = extendedBackgroundColors;
  public borderPosition = borderPosition;
  public borderTypes = borderTypes;
}
