import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataService } from '../../services/data';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders?: any[];
  createdAt: string;
}

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients.html',
  styleUrls: ['./clients.css'],
})
export class Clients implements OnInit {
  clients$!: Observable<Client[]>;
  filteredClients$!: Observable<Client[]>;
  searchTerm = '';

  // modal control
  showAddModal = false;

  // form data (ordersText for optional input)
  formData: Partial<Client> & { ordersText?: string } = {
    name: '',
    email: '',
    phone: '',
    ordersText: '',
  };

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.clients$ = this.dataService.getData('clients').pipe(
      map((arr: any[]) =>
        arr.map((item: any) => ({
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
  }

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

  openAddModal() {
    this.showAddModal = true;
    this.formData = { name: '', email: '', phone: '', ordersText: '' };
  }

  closeModal() {
    this.showAddModal = false;
    this.formData = { name: '', email: '', phone: '', ordersText: '' };
  }

  getLastOrderDisplay(orders?: any[]): string {
    if (!orders || orders.length === 0) return '';
    const sorted = [...orders].sort((a, b) => {
      const da = new Date(a.createdAt ?? a.date ?? 0).getTime();
      const db = new Date(b.createdAt ?? b.date ?? 0).getTime();
      return db - da;
    });
    const last = sorted[0];
    const d = new Date(last.createdAt ?? last.date ?? last);
    if (isNaN(d.getTime())) return String(last);
    return d.toLocaleDateString();
  }

  deleteClient(id: string, name?: string) {
    if (!id) return alert('Invalid client ID');
    if (!confirm(`Are you sure you want to delete "${name ?? 'this client'}"?`)) return;

    this.dataService
      .deleteData('clients', id)
      .then(() => console.log('Client deleted'))
      .catch((err) => {
        console.error('Error deleting client', err);
        alert('Error deleting client');
      });
  }

  saveClient() {
    if (!this.formData.name || !this.formData.email || !this.formData.phone) {
      alert('Please fill name, email, and phone.');
      return;
    }

    // Parse optional orders input (comma-separated -> array)
    const orders =
      this.formData.ordersText && this.formData.ordersText.trim()
        ? this.formData.ordersText.includes(',')
          ? this.formData.ordersText
              .split(',')
              .map((o) => o.trim())
              .filter((o) => o)
          : [this.formData.ordersText.trim()]
        : [];

    const payload = {
      name: this.formData.name,
      email: this.formData.email,
      phone: this.formData.phone,
      orders,
      createdAt: new Date().toISOString(),
    };

    this.dataService
      .addData('clients', payload)
      .then(() => {
        console.log('Client added');
        this.closeModal();
      })
      .catch((err) => {
        console.error('Error adding client', err);
        alert('Error adding client');
      });
  }
}
