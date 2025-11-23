import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  async login() {
    this.error = '';
    this.loading = true;

    try {
      await this.auth.login(this.email.trim(), this.password);
      // navigates to dashboard; AdminGuard will allow or redirect if not admin
      await this.router.navigate(['/dashboard']);
    } catch (err: any) {
      console.error('Login error', err);
      // Friendly error messages
      if (err?.code === 'auth/user-not-found') {
        this.error = 'User not found. Check email or sign up first.';
      } else if (err?.code === 'auth/wrong-password') {
        this.error = 'Wrong password. Try again.';
      } else if (err?.message) {
        this.error = err.message;
      } else {
        this.error = 'Login failed — please try again.';
      }
    } finally {
      this.loading = false;
    }
  }
}
