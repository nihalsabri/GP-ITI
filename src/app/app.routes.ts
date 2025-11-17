// import { Routes } from '@angular/router';
// import { Layout } from './components/layout/layout';
// import { NoPage } from './components/no-page/no-page';
// import { Orders } from './components/orders/orders';
// import { Clients } from './components/clients/clients';
// import { ServicesComponent } from './components/services/services';
// import { Tradespeople } from './components/tradespeople/tradespeople';
// import { adminGuard } from './guards/admin-guard';
// import { Login } from './components/login/login';
// import { MainPage } from './components/main-page/main-page';

// export const routes: Routes = [
//   {
//     path: '',
//     component: Layout,
//     children: [
//       {
//         path: 'login',
//         loadComponent: () => import('../app/components/login/login').then((m) => m.Login),
//       },
//       { path: '', component: MainPage, pathMatch: 'full', canActivate: [adminGuard] },
//       { path: 'orders', component: Orders },
//       { path: 'clients', component: Clients },
//       { path: 'services', component: ServicesComponent },
//       { path: 'tradespeople', component: Tradespeople },
//     ],
//   },
//   { path: '**', component: NoPage, title: 'Not Found' },
// ];

import { Routes } from '@angular/router';
import { Layout } from './components/layout/layout';
import { NoPage } from './components/no-page/no-page';
import { Orders } from './components/orders/orders';
import { Clients } from './components/clients/clients';
import { ServicesComponent } from './components/services/services';
import { Tradespeople } from './components/tradespeople/tradespeople';
import { adminGuard } from './guards/admin-guard';
import { MainPage } from './components/main-page/main-page';

// NOTE: Login is top-level so it's accessible without auth
export const routes: Routes = [
  // Login route (public)
  {
    path: 'login',
    loadComponent: () => import('../app/components/login/login').then((m) => m.Login),
  },

  // All dashboard routes are children of Layout and protected by adminGuard
  {
    path: '',
    component: Layout,
    canActivate: [adminGuard], // <- protects entering the layout
    children: [
      { path: '', component: MainPage, pathMatch: 'full' },
      { path: 'orders', component: Orders },
      { path: 'clients', component: Clients },
      { path: 'services', component: ServicesComponent },
      { path: 'tradespeople', component: Tradespeople },
    ],
  },

  // Catch-all
  { path: '**', component: NoPage, title: 'Not Found' },
];
