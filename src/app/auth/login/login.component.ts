import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service.service';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private formBuilder = inject(FormBuilder);
  constructor(private authService: AuthService, private router: Router) {}

  loginForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit() {
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log(response);
        // route to chatrooms on successful login
        this.router.navigateByUrl('/chatrooms');
        const token = response.token;
        localStorage.setItem('token', token);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('complete');
        this.loginForm.reset();
      },
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }
}
