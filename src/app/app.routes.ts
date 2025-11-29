import { Routes } from '@angular/router';
import { Layout } from './components/layout/layout';
import { NoPage } from './components/no-page/no-page';
import { OrdersComponent } from './components/orders/orders';
import { Clients } from './components/clients/clients';
import { ServicesComponent } from './components/services/services';
import { Tradespeople } from './components/tradespeople/tradespeople';
import { adminGuard } from './guards/admin-guard';
import { MainPage } from './components/main-page/main-page';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('../app/components/login/login').then((m) => m.Login),
  },

  {
    path: '',
    component: Layout,
    canActivate: [adminGuard], 
    children: [
      { path: '', component: MainPage, pathMatch: 'full' },
      { path: 'orders', component: OrdersComponent },
      { path: 'clients', component: Clients },
      { path: 'services', component: ServicesComponent },
      { path: 'tradespeople', component: Tradespeople },
    ],
  },

  { path: '**', component: NoPage, title: 'Not Found' },
];
