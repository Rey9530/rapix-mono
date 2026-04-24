import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginForm } from '../login-form/login-form';

@Component({
  selector: 'app-login-bg-image-two',
  imports: [RouterModule, LoginForm],
  templateUrl: './login-bg-image-two.html',
  styleUrl: './login-bg-image-two.scss',
})
export class LoginBgImageTwo {}
