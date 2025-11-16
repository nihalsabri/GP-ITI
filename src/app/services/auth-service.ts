import { Injectable } from '@angular/core';

import { inject } from '@angular/core';
import { getAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(getAuth);

  constructor() {}
  login(email: string, password: string): Promise<any> {
    return this.firebaseAuth.signInWithEmailAndPassword(email, password);
  }

}
