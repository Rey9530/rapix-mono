import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginForm } from '../login-form/login-form';

@Component({
  selector: 'app-login',
  imports: [RouterModule, LoginForm],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {}
