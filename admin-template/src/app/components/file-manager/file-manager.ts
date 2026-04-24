import { Component } from '@angular/core';

import { Files } from './widgets/files/files';
import { Sidebar } from './widgets/sidebar/sidebar';

@Component({
  selector: 'app-file-manager',
  imports: [Sidebar, Files],
  templateUrl: './file-manager.html',
  styleUrl: './file-manager.scss',
})
export class FileManager {}
