import { Component } from '@angular/core';

import { DefaultSitemap } from './widgets/default-sitemap/default-sitemap';
import { TreeStructureSitemap } from './widgets/tree-structure-sitemap/tree-structure-sitemap';

@Component({
  selector: 'app-sitemap',
  imports: [DefaultSitemap, TreeStructureSitemap],
  templateUrl: './sitemap.html',
  styleUrl: './sitemap.scss',
})
export class Sitemap {}
