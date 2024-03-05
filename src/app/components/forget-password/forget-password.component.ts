import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ForgotpassService } from 'src/app/core/services/forgotpass.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent {
  constructor(
    private _ForgotpassService: ForgotpassService,
    private _Router: Router
  ) {}
  step1: boolean = true;
  step2: boolean = false;
  step3: boolean = false;
  email: string = '';
  userMsg: string = '';

  forgotForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  resetCodeForm: FormGroup = new FormGroup({
    resetCode: new FormControl('', [Validators.required]),
  });

  resetPassword: FormGroup = new FormGroup({
    newPassword: new FormControl('', [
      Validators.required,
      Validators.pattern(
        /^(?=.*[0-9a-zA-Z])(?=.*[a-z])(?=.*[A-Z])(?=.*[@&*]).{9,}$/
      ),
    ]),
  });

  forgotPassword(): void {
    let userEmail = this.forgotForm.value;
    this.email = userEmail.email;

    this._ForgotpassService.forgotPassword(userEmail).subscribe({
      next: (response) => {
        console.log(response);
        this.userMsg = response.message;
        this.step1 = false;
        this.step2 = true;
      },
      error: (err) => {
        this.userMsg = err.error.message;
      },
    });
  }

  resetCode(): void {
    let resetCode = this.resetCodeForm.value;
    this._ForgotpassService.resetCode(resetCode).subscribe({
      next: (response) => {
        this.userMsg = response.status;
        this.step2 = false;
        this.step3 = true;
      },
      error: (err) => {
        this.userMsg = err.error.message;
      },
    });
  }

  newPassword(): void {
    let resetForm = this.resetPassword.value;

    let userPassword = this.forgotForm.value;
    this.newPassword = userPassword.email;

    resetForm.email = this.email;

    this._ForgotpassService.resetPassword(resetForm).subscribe({
      next: (response) => {
        if (response.token) {
          localStorage.setItem('etoken', response.token);
          this._Router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.userMsg = err.error.message;
      },
    });
  }
}
