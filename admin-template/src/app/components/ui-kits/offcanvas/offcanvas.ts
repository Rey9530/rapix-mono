import { Component } from '@angular/core';

import { InitialOffcanvas } from './widgets/initial-offcanvas/initial-offcanvas';
import { OffcanvasDirection } from './widgets/offcanvas-direction/offcanvas-direction';
import { OffcanvasVariation } from './widgets/offcanvas-variation/offcanvas-variation';

@Component({
  selector: 'app-offcanvas',
  imports: [InitialOffcanvas, OffcanvasDirection, OffcanvasVariation],
  templateUrl: './offcanvas.html',
  styleUrl: './offcanvas.scss',
})
export class Offcanvas {}
