import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginForm } from '../login-form/login-form';

@Component({
  selector: 'app-login-bg-image',
  imports: [RouterModule, LoginForm],
  templateUrl: './login-bg-image.html',
  styleUrl: './login-bg-image.scss',
})
export class LoginBgImage {}
