import { Routes } from '@angular/router';
import { Layout } from './components/layout/layout';
import { NoPage } from './components/no-page/no-page';
import { OrdersComponent } from './components/orders/orders';
import { Clients } from './components/clients/clients';
import { ServicesComponent } from './components/services/services';
import { Tradespeople } from './components/tradespeople/tradespeople';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'orders', pathMatch: 'full' },
      { path: 'orders', component: OrdersComponent },
      { path: 'clients', component: Clients },
      { path: 'services', component: ServicesComponent },
      { path: 'tradespeople', component: Tradespeople }
    ]
  },
  { path: '**', component: NoPage, title: 'Not Found' }
];
