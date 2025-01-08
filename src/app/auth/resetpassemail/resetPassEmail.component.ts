import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth-service.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-resetpassword',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './resetPassEmail.component.html',
  styleUrl: './resetPassEmail.component.css',
})
export class ResetpasswordComponent {
  private formBuilder = inject(FormBuilder);
  constructor(private authService: AuthService) {}

  resetPasswordForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    this.authService
      .resetPasswordEmail(this.resetPasswordForm.value)
      .subscribe({
        next: (response) => {
          console.log(response, 'data sent from reset password email');
        },
        error: (error) => {
          console.log(error, 'error from reset password email');
        },
        complete: () => {
          console.log('complete');
          this.resetPasswordForm.reset();
        },
      });
  }
}
