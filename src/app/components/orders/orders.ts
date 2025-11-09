import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.html',
  styleUrls: ['./orders.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class OrdersComponent {
  isModalOpen = false;

  clients = [
    { id: 1, name: 'أحمد محمد' },
    { id: 2, name: 'محمود علي' },
    { id: 3, name: 'سارة جمال' }
  ];

  tradespeople = [
    { id: 101, name: 'حسن عبد الله', job: 'كهربائي' },
    { id: 102, name: 'كريم مصطفى', job: 'سباك' },
    { id: 103, name: 'علي سعيد', job: 'نجار' }
  ];

  orders = [
    {
      id: '#001',
      clientId: 1,
      tradespersonId: 101,
      serviceType: 'كهرباء',
      status: 'جديدة',
      date: '2025-11-07'
    },
    {
      id: '#002',
      clientId: 2,
      tradespersonId: 102,
      serviceType: 'سباكة',
      status: 'مكتملة',
      date: '2025-11-06'
    }
  ];

  newOrder = {
    id: '',
    clientId: 0,
    tradespersonId: 0,
    serviceType: '',
    status: 'جديدة',
    date: ''
  };

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  getClientName(id: number) {
    const client = this.clients.find(c => c.id === id);
    return client ? client.name : '-';
  }

  getTradespersonName(id: number) {
    const person = this.tradespeople.find(t => t.id === id);
    return person ? person.name : '-';
  }

  addOrder() {
    const newId = '#00' + (this.orders.length + 1);
    const orderData = { ...this.newOrder, id: newId };
    this.orders.push(orderData);
    this.newOrder = { id: '', clientId: 0, tradespersonId: 0, serviceType: '', status: 'جديدة', date: '' };
    this.closeModal();
  }
}
