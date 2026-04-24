import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginForm } from '../login-form/login-form';

@Component({
  selector: 'app-login-bg-image-three',
  imports: [RouterModule, LoginForm],
  templateUrl: './login-bg-image-three.html',
  styleUrl: './login-bg-image-three.scss',
})
export class LoginBgImageThree {}
