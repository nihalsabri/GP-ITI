// import { CanActivateFn } from '@angular/router';
// import { inject } from '@angular/core';
// import { Router } from '@angular/router';
// import { map, take } from 'rxjs/operators';
// import { AuthService } from '../services/auth-service';

// export const adminGuard: CanActivateFn = (route, state) => {
//   const auth = inject(AuthService);
//   const router = inject(Router);

//   return auth.isAdmin$.pipe(
//     take(1),
//     map((isAdmin) => {
//       if (isAdmin) return true;
//       return router.parseUrl('/login');
//     })
//   );
// };
// src/app/guards/admin-guard.ts
// src/app/guards/admin-guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { filter, switchMap, take, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../services/auth-service';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.user$.pipe(
    // استنى لحد ما الuser يبقى ليس null
    filter((u) => u !== null),
    take(1),
    switchMap((user) => {
      if (!user) return of(router.parseUrl('/login') as UrlTree);
      return auth.isAdmin$.pipe(
        take(1),
        map((isAdmin) => (isAdmin ? true : (router.parseUrl('/login') as UrlTree)))
      );
    })
  );
};
