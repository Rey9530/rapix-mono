import { Component } from '@angular/core';

import { BlockQuote } from './widgets/block-quote/block-quote';
import { ColoredHeading } from './widgets/colored-heading/colored-heading';
import { DisplayHeading } from './widgets/display-heading/display-heading';
import { FontWeight } from './widgets/font-weight/font-weight';
import { Heading } from './widgets/heading/heading';
import { InlineTextElement } from './widgets/inline-text-element/inline-text-element';
import { ListingTypography } from './widgets/listing-typography/listing-typography';
import { TextColors } from './widgets/text-colors/text-colors';

@Component({
  selector: 'app-typography',
  imports: [
    Heading,
    ColoredHeading,
    FontWeight,
    ListingTypography,
    DisplayHeading,
    InlineTextElement,
    TextColors,
    BlockQuote,
  ],
  templateUrl: './typography.html',
  styleUrl: './typography.scss',
})
export class Typography {}
