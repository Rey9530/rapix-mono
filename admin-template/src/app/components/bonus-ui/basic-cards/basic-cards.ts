import { NgClass, SlicePipe } from '@angular/common';
import { Component } from '@angular/core';

import { BasicCard } from './widgets/basic-card/basic-card';
import { DarkColorCard } from './widgets/dark-color-card/dark-color-card';
import { FlatCard } from './widgets/flat-card/flat-card';
import { IconHeading } from './widgets/icon-heading/icon-heading';
import { InfoCard } from './widgets/info-card/info-card';
import { ShadowCard } from './widgets/shadow-card/shadow-card';
import { list } from '../../../shared/data/bonus-ui/draggable-card';

@Component({
  selector: 'app-basic-cards',
  imports: [
    BasicCard,
    FlatCard,
    ShadowCard,
    IconHeading,
    DarkColorCard,
    InfoCard,
    NgClass,
    SlicePipe,
  ],
  templateUrl: './basic-cards.html',
  styleUrl: './basic-cards.scss',
})
export class BasicCards {
  public infoCard = list;
}
