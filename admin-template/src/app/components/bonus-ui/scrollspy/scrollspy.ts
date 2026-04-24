import { Component } from '@angular/core';

import { CustomScrollspy } from './widgets/custom-scrollspy/custom-scrollspy';
import { ListGroupScrollspy } from './widgets/list-group-scrollspy/list-group-scrollspy';
import { NavbarScrollspy } from './widgets/navbar-scrollspy/navbar-scrollspy';
import { NestedScrollspy } from './widgets/nested-scrollspy/nested-scrollspy';

@Component({
  selector: 'app-scrollspy',
  imports: [
    NavbarScrollspy,
    NestedScrollspy,
    ListGroupScrollspy,
    CustomScrollspy,
  ],
  templateUrl: './scrollspy.html',
  styleUrl: './scrollspy.scss',
})
export class Scrollspy {}
