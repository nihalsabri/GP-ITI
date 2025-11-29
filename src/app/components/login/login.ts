// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthService } from '../../services/auth-service';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './login.html',
//   styleUrls: ['./login.css'],
// })
// export class Login {
//   email = '';
//   password = '';
//   loading = false;
//   error = '';

//   constructor(private auth: AuthService, private router: Router) {}

//   async login() {
//     this.error = '';
//     this.loading = true;

//     try {
//       await this.auth.login(this.email.trim(), this.password);
//       // navigates to dashboard; AdminGuard will allow or redirect if not admin
//       await this.router.navigate(['/dashboard']);
//     } catch (err: any) {
//       console.error('Login error', err);
//       // Friendly error messages
//       if (err?.code === 'auth/user-not-found') {
//         this.error = 'User not found. Check email or sign up first.';
//       } else if (err?.code === 'auth/wrong-password') {
//         this.error = 'Wrong password. Try again.';
//       } else if (err?.message) {
//         this.error = err.message;
//       } else {
//         this.error = 'Login failed — please try again.';
//       }
//     } finally {
//       this.loading = false;
//     }
//   }
// }

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

    console.log('[LoginComponent] login() called', { email: this.email });

    try {
      // call the AuthService.login which wraps signInWithEmailAndPassword
      const result: any = await this.auth.login(this.email.trim(), this.password);
      console.log('[LoginComponent] auth.login() result', result);

      // if the result includes a user object, force refresh the ID token (helps when using custom claims)
      try {
        if (result && result.user && typeof result.user.getIdToken === 'function') {
          await result.user.getIdToken(true);
          console.log('[LoginComponent] token refreshed');
        }
      } catch (tokenErr) {
        console.warn('[LoginComponent] token refresh failed (non-fatal)', tokenErr);
      }

      // navigate to dashboard (or root). The guard will allow or redirect as needed.
      await this.router.navigate(['/']);
      console.log('[LoginComponent] navigation attempted to /');
    } catch (err: any) {
      console.error('[LoginComponent] Login error', err);

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
