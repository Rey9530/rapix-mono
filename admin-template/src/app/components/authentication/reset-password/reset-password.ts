import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [RouterModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword {
  public showPassword: boolean = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
