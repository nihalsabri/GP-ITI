// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { DataService } from '../../services/data';

// interface Tradesperson {
//   id: string;
//   name: string;
//   trade: string;
//   phone: string;
//   email?: string;
//   experience?: number;
//   rating?: number;
//   createdAt: string;
// }

// interface Order {
//   tradespersonId: string;
//   tradespersonName: string;
//   service: string;
//   createdAt: string;
// }

// interface Client {
//   id?: string;
//   name: string;
//   email: string;
//   phone: string;
//   orders?: Order[];
//   createdAt?: string;
// }

// @Component({
//   selector: 'app-clients',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './clients.html',
//   styleUrls: ['./clients.css'],
// })
// export class Clients implements OnInit {
//   clients$!: Observable<Client[]>;
//   filteredClients$!: Observable<Client[]>;
//   tradespeople$!: Observable<Tradesperson[]>;

//   // cached plain array for template lookups (avoids async pipe + find in template)
//   tradespeopleList: Tradesperson[] = [];

//   searchTerm = '';
//   showAddModal = false;

//   // form model
//   formData: Partial<Client> & { orders?: Order[] } = {
//     name: '',
//     email: '',
//     phone: '',
//     orders: [],
//   };

//   constructor(private dataService: DataService) {}

//   ngOnInit() {
//     this.loadData();
//   }

//   loadData() {
//     // load clients
//     this.clients$ = this.dataService.getData('clients').pipe(
//       map((arr: any[]) =>
//         (arr || []).map((item: any) => ({
//           id: item.id ?? item.key ?? '',
//           name: item.name ?? '',
//           email: item.email ?? '',
//           phone: item.phone ?? '',
//           orders: Array.isArray(item.orders) ? item.orders : [],
//           createdAt: item.createdAt ?? '',
//         }))
//       )
//     );
//     this.filteredClients$ = this.clients$;

//     // load tradespeople
//     this.tradespeople$ = this.dataService.getData('Tradespeople').pipe(
//       map((arr: any[]) =>
//         (arr || []).map(
//           (t: any) =>
//             ({
//               id: t.id ?? t.key ?? '',
//               name: t.name ?? '',
//               trade: t.trade ?? '',
//               phone: t.phone ?? '',
//               email: t.email ?? '',
//               experience: t.experience ?? undefined,
//               rating: t.rating ?? undefined,
//               createdAt: t.createdAt ?? '',
//             } as Tradesperson)
//         )
//       )
//     );

//     // keep a plain array copy for quick lookup in template & handlers
//     this.tradespeople$.subscribe((list) => {
//       this.tradespeopleList = list || [];
//     });
//   }

//   filterData() {
//     const term = this.searchTerm.trim().toLowerCase();
//     if (!term) {
//       this.filteredClients$ = this.clients$;
//       return;
//     }

//     this.filteredClients$ = this.clients$.pipe(
//       map((list) =>
//         list.filter(
//           (c) =>
//             (c.name || '').toLowerCase().includes(term) ||
//             (c.email || '').toLowerCase().includes(term) ||
//             (c.phone || '').toLowerCase().includes(term)
//         )
//       )
//     );
//   }

//   openAddModal() {
//     this.showAddModal = true;
//     this.formData = { name: '', email: '', phone: '', orders: [] };
//   }

//   closeModal() {
//     this.showAddModal = false;
//     this.formData = { name: '', email: '', phone: '', orders: [] };
//   }

//   // Order helpers
//   addOrder() {
//     const orders = this.formData.orders ?? [];
//     orders.push({
//       tradespersonId: '',
//       tradespersonName: '',
//       service: '',
//       createdAt: new Date().toISOString(),
//     });
//     this.formData.orders = orders;
//   }

//   removeOrder(index: number) {
//     this.formData.orders?.splice(index, 1);
//   }

//   // Called from template when user selects a tradesperson for an order
//   onTradespersonSelect(order: Order) {
//     const tp = this.getTradesperson(order.tradespersonId);
//     order.tradespersonName = tp?.name ?? '';
//   }

//   // helper to lookup tradesperson by id from the cached plain array
//   getTradesperson(id?: string): Tradesperson | undefined {
//     if (!id) return undefined;
//     return this.tradespeopleList.find((tp) => tp.id === id);
//   }

//   // Display last order summary: name - service
//   getLastOrderDisplay(orders?: Order[]): string {
//     if (!orders || orders.length === 0) return '';
//     const sorted = [...orders].sort((a, b) => {
//       const da = new Date(a.createdAt).getTime();
//       const db = new Date(b.createdAt).getTime();
//       return db - da;
//     });
//     const last = sorted[0];
//     return `${last.tradespersonName || this.getTradesperson(last.tradespersonId)?.name || '-'} - ${
//       last.service || '-'
//     }`;
//   }

//   deleteClient(id: string | undefined, name?: string) {
//     if (!id) return alert('Invalid client ID');
//     if (!confirm(`Are you sure you want to delete "${name ?? 'this client'}"?`)) return;

//     this.dataService
//       .deleteData('clients', id)
//       .then(() => console.log('Client deleted'))
//       .catch((err) => {
//         console.error('Error deleting client', err);
//         alert('Error deleting client');
//       });
//   }

//   // Validate and save client + orders
//   saveClient() {
//     if (!this.formData.name || !this.formData.email || !this.formData.phone) {
//       alert('Please fill name, email, and phone.');
//       return;
//     }

//     // Validate orders: each order must have tradespersonId and service if any orders exist
//     const orders = this.formData.orders ?? [];
//     for (let i = 0; i < orders.length; i++) {
//       const o = orders[i];
//       if (!o.tradespersonId) {
//         alert(`Order #${i + 1}: please select a tradesperson.`);
//         return;
//       }
//       if (!o.service || !o.service.trim()) {
//         alert(`Order #${i + 1}: please enter a service.`);
//         return;
//       }
//       // ensure tradespersonName is present (resolve if needed)
//       if (!o.tradespersonName) {
//         o.tradespersonName = this.getTradesperson(o.tradespersonId)?.name ?? '';
//       }
//       // ensure createdAt set
//       if (!o.createdAt) o.createdAt = new Date().toISOString();
//     }

//     const payload: Client = {
//       name: this.formData.name!,
//       email: this.formData.email!,
//       phone: this.formData.phone!,
//       orders,
//       createdAt: new Date().toISOString(),
//     };

//     this.dataService
//       .addData('clients', payload)
//       .then(() => {
//         console.log('Client added');
//         this.closeModal();
//       })
//       .catch((err) => {
//         console.error('Error adding client', err);
//         alert('Error adding client');
//       });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataService } from '../../services/data';
import { MatIconModule } from '@angular/material/icon';


interface Tradesperson {
  id: string;
  name: string;
  trade: string;
  phone: string;
  email?: string;
  experience?: number;
  rating?: number;
  createdAt: string;
}

interface Order {
  tradespersonId: string;
  tradespersonName: string;
  service: string;
  createdAt: string;
}

interface Client {
  id?: string;
  name: string;
  email: string;
  phone: string;
  orders?: Order[];
  createdAt?: string;
}

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './clients.html',
  styleUrls: ['./clients.css'],
})
export class Clients implements OnInit {
  clients$!: Observable<Client[]>;
  filteredClients$!: Observable<Client[]>;
  tradespeople$!: Observable<Tradesperson[]>;
  private tradesSub?: Subscription;

  // cached plain array for template lookups
  tradespeopleList: Tradesperson[] = [];

  searchTerm = '';
  showAddModal = false;

  // form model
  formData: Partial<Client> & { orders?: Order[] } = {
    name: '',
    email: '',
    phone: '',
    orders: [],
  };

  // Inline validation state
  formErrors: { name?: string; email?: string; phone?: string } = {};
  ordersErrors: { [index: number]: { tradespersonId?: string; service?: string } } = {};

  // toast
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  toastVisible = false;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.tradesSub?.unsubscribe();
  }

  /********** Data loading **********/
  loadData() {
    // clients observable
    this.clients$ = this.dataService.getData('clients').pipe(
      map((arr: any[]) =>
        (arr || []).map((item: any) => ({
          id: item.id ?? item.key ?? '',
          name: item.name ?? '',
          email: item.email ?? '',
          phone: item.phone ?? '',
          orders: Array.isArray(item.orders) ? item.orders : [],
          createdAt: item.createdAt ?? '',
        }))
      )
    );
    this.filteredClients$ = this.clients$;

    // tradespeople observable + cached plain array
    this.tradespeople$ = this.dataService.getData('Tradespeople').pipe(
      map((arr: any[]) =>
        (arr || []).map(
          (t: any) =>
            ({
              id: t.id ?? t.key ?? '',
              name: t.name ?? '',
              trade: t.trade ?? '',
              phone: t.phone ?? '',
              email: t.email ?? '',
              experience: t.experience ?? undefined,
              rating: t.rating ?? undefined,
              createdAt: t.createdAt ?? '',
            } as Tradesperson)
        )
      )
    );

    // subscribe once to keep a plain array for lookups in template/handlers
    this.tradesSub = this.tradespeople$.subscribe((list) => {
      this.tradespeopleList = list || [];
    });
  }

  /********** Search / filter **********/
  filterData() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredClients$ = this.clients$;
      return;
    }
    this.filteredClients$ = this.clients$.pipe(
      map((list) =>
        list.filter(
          (c) =>
            (c.name || '').toLowerCase().includes(term) ||
            (c.email || '').toLowerCase().includes(term) ||
            (c.phone || '').toLowerCase().includes(term)
        )
      )
    );
  }

  /********** Modal helpers **********/
  openAddModal() {
    this.clearFormErrors();
    this.ordersErrors = {};
    this.formData = { name: '', email: '', phone: '', orders: [] };
    this.showAddModal = true;
  }

  closeModal() {
    this.showAddModal = false;
    this.formData = { name: '', email: '', phone: '', orders: [] };
    this.ordersErrors = {};
    this.clearFormErrors();
  }

  /********** Orders helpers **********/
  addOrder() {
    const orders = this.formData.orders ?? [];
    orders.push({
      tradespersonId: '',
      tradespersonName: '',
      service: '',
      createdAt: new Date().toISOString(),
    });
    this.formData.orders = orders;
    const idx = (this.formData.orders?.length || 1) - 1;
    this.ordersErrors[idx] = {};
  }

  removeOrder(index: number) {
    this.formData.orders?.splice(index, 1);
    // remove and reindex ordersErrors
    delete this.ordersErrors[index];
    const newErrors: typeof this.ordersErrors = {};
    const keys = Object.keys(this.ordersErrors)
      .map((k) => parseInt(k, 10))
      .filter((k) => !isNaN(k))
      .sort((a, b) => a - b);

    let shift = 0;
    for (let k of keys) {
      if (k === index) {
        shift = 1;
        continue;
      }
      newErrors[k - shift] = this.ordersErrors[k];
    }
    this.ordersErrors = newErrors;
  }

  onTradespersonSelect(order: Order) {
    const tp = this.getTradesperson(order.tradespersonId);
    order.tradespersonName = tp?.name ?? '';
  }

  getTradesperson(id?: string): Tradesperson | undefined {
    if (!id) return undefined;
    return this.tradespeopleList.find((tp) => tp.id === id);
  }

  getLastOrderDisplay(orders?: Order[]): string {
    if (!orders || orders.length === 0) return '';
    const sorted = [...orders].sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return db - da;
    });
    const last = sorted[0];
    return `${last.tradespersonName || this.getTradesperson(last.tradespersonId)?.name || '-'} - ${
      last.service || '-'
    }`;
  }

  /********** Delete **********/
  deleteClient(id: string | undefined, name?: string) {
    if (!id) return this.showErrorToast('Invalid client ID');
    if (!confirm(`Are you sure you want to delete "${name ?? 'this client'}"?`)) return;

    this.dataService
      .deleteData('clients', id)
      .then(() => this.showSuccessToast('Client deleted'))
      .catch((err) => {
        console.error('Error deleting client', err);
        this.showErrorToast('Error deleting client');
      });
  }

  /********** Validation helpers **********/
  clearFormErrors() {
    this.formErrors = {};
  }
  clearFieldError(field: keyof typeof this.formErrors) {
    delete this.formErrors[field];
  }
  clearOrderError(index: number, field: keyof Order) {
    if (!this.ordersErrors[index]) return;
    delete this.ordersErrors[index][field as keyof (typeof this.ordersErrors)[number]];
  }

  /********** Toast helpers **********/
  showToast(msg: string, type: 'success' | 'error' = 'success', duration = 3000) {
    this.toastMessage = msg;
    this.toastType = type;
    this.toastVisible = true;
    setTimeout(() => (this.toastVisible = false), duration);
  }
  showSuccessToast(msg: string) {
    this.showToast(msg, 'success', 2500);
  }
  showErrorToast(msg: string) {
    this.showToast(msg, 'error', 4000);
  }

  /********** Save client **********/
  async saveClient(): Promise<void> {
    // reset errors
    this.clearFormErrors();
    this.ordersErrors = {};

    // basic required fields
    if (!this.formData.name) this.formErrors.name = 'Name is required';
    if (!this.formData.email) this.formErrors.email = 'Email is required';
    if (!this.formData.phone) this.formErrors.phone = 'Phone is required';

    if (Object.keys(this.formErrors).length) return;

    // Validate orders
    const orders = this.formData.orders ?? [];
    for (let i = 0; i < orders.length; i++) {
      const o = orders[i];
      this.ordersErrors[i] = {};
      if (!o.tradespersonId) {
        this.ordersErrors[i].tradespersonId = 'Select a tradesperson';
      }
      if (!o.service || !o.service.trim()) {
        this.ordersErrors[i].service = 'Enter service';
      }
      if (!o.tradespersonName) {
        o.tradespersonName = this.getTradesperson(o.tradespersonId)?.name ?? '';
      }
      if (!o.createdAt) o.createdAt = new Date().toISOString();
    }

    const hasOrderErrors = Object.keys(this.ordersErrors).some((k) => {
      const e = this.ordersErrors[parseInt(k, 10)];
      return e && (e.tradespersonId || e.service);
    });
    if (hasOrderErrors) return;

    const payload: Client = {
      name: this.formData.name!,
      email: this.formData.email!,
      phone: this.formData.phone!,
      orders,
      createdAt: new Date().toISOString(),
    };

    try {
      const newId = await this.dataService.addData('clients', payload);
      this.showSuccessToast('Client added successfully' + (newId ? ` (id: ${newId})` : ''));
      setTimeout(() => this.closeModal(), 700);
    } catch (err: any) {
      console.error('Error adding client', err);
      const msg = err?.message ?? (typeof err === 'string' ? err : JSON.stringify(err));
      this.showErrorToast('Error adding client: ' + msg);
    }
  }
}
