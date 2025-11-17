// import { Injectable } from '@angular/core';

// import { inject } from '@angular/core';
// import { getAuth } from '@angular/fire/auth';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   firebaseAuth = inject(getAuth);

//   constructor() {}
//   // login method to authenticate user with email and password
//   login(email: string, password: string): Promise<any> {
//     return this.firebaseAuth.signInWithEmailAndPassword(email, password);
//   }

// }

// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';

import { Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // observable of firebase.User | null
  user$: Observable<any>;

  // observable that emits true if the current user UID is present under /admins in Realtime DB
  isAdmin$: Observable<boolean>;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router
  ) {
    // authState from compat gives an observable of the current user (or null)
    this.user$ = this.afAuth.authState;

    // map user -> check /admins/{uid} in realtime db
    this.isAdmin$ = this.user$.pipe(
      switchMap((user) => {
        if (!user) return of(false);
        return this.db
          .object<boolean>(`admins/${user.uid}`)
          .valueChanges()
          .pipe(switchMap((flag) => of(!!flag)));
      })
    );
  }

  // login method: authenticate user with email and password
  login(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // sign out and optionally navigate to login
  async signOut(redirect = true) {
    await this.afAuth.signOut();
    if (redirect) this.router.navigate(['/login']);
  }

  // get current user UID (or null)
  async currentUid(): Promise<string | null> {
    const user = await this.afAuth.currentUser;
    return user ? user.uid : null;
  }
}
