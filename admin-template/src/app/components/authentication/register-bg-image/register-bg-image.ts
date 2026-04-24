import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RegisterForm } from '../register-form/register-form';

@Component({
  selector: 'app-register-bg-image',
  imports: [RouterModule, RegisterForm],
  templateUrl: './register-bg-image.html',
  styleUrl: './register-bg-image.scss',
})
export class RegisterBgImage {}
