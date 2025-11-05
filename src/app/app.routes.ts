import { Routes } from '@angular/router';
import { Layout } from './components/layout/layout';
import { NoPage } from './components/no-page/no-page';
import { Orders } from './components/orders/orders';
import { Clients } from './components/clients/clients';
import { Services } from './components/services/services';
import { Tradespeople } from './components/tradespeople/tradespeople';

export const routes: Routes = [ 
    
    {path:'',component:Layout, children:[

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'orders', component: Orders },
      { path: 'clients', component: Clients },
      { path: 'services', component: Services },
      { path: 'tradespeople', component: Tradespeople }

  ]},
  {path:'**',component:NoPage,title:"Not Found"}
];
