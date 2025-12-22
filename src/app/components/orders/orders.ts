

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { DataService } from '../../services/data';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

interface Tradesperson {
  id: string;
  name: string;
  trade: string;
  phone: string;
  email?: string;
}

interface OrderData {
  id?: string;
  clientId: string;
  tradespersonId: string;
  serviceType: string;
  status: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.html',
  styleUrls: ['./orders.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class OrdersComponent implements OnInit {
  orders$!: Observable<OrderData[]>;
  clients$!: Observable<Client[]>;
  tradespeople$!: Observable<Tradesperson[]>;
  
  isModalOpen = false;
  isEditMode = false;
  newOrder: OrderData;

  constructor(private dataService: DataService) {
    this.newOrder = this.resetOrder();
  }

  ngOnInit(): void {
    this.loadOrders();
    this.loadClientsAndTradespeople();
  }

  loadOrders() {
    this.orders$ = this.dataService.getData('orders').pipe(
      map(orders => orders || [])
    );
  }

  loadClientsAndTradespeople() {
    this.clients$ = this.dataService.getData('clients');
    this.tradespeople$ = this.dataService.getData('Tradespeople');
  }

  getClientName(clientId: string): Observable<string> {
    return this.clients$.pipe(
      map(clients => {
        const client = clients.find(c => c.id === clientId);
        return client ? client.name : 'غير معروف';
      })
    );
  }

  getTradespersonName(tradespersonId: string): Observable<string> {
    return this.tradespeople$.pipe(
      map(tradespeople => {
        const person = tradespeople.find(t => t.id === tradespersonId);
        return person ? person.name : 'غير معروف';
      })
    );
  }
  

  openModal(order?: OrderData) {
    if (order) {
      this.isEditMode = true;
      this.newOrder = { ...order };
    } else {
      this.isEditMode = false;
      this.newOrder = this.resetOrder();
    }
    this.isModalOpen = true;
  }

  saveOrder(form: NgForm) {
    if (!form.valid) return;

    if (this.isEditMode && this.newOrder.id) {
      this.dataService.updateData('orders', this.newOrder.id, this.newOrder)
        .then(() => {
           this.loadOrders(); 
          this.closeModal();})
        .catch(error => console.error('Error updating order:', error));
    } else {
      this.dataService.addData('orders', this.newOrder)
        .then(() => {
           this.loadOrders(); 
          this.closeModal();})
        .catch(err => console.error('Error adding order:', err));
    }
  }


 

  onOverlayClick(event: any) {
    if (event.target.classList.contains('overlay')) {
      this.closeModal();
    }
  }



  deleteOrder(id?: string) {
    if (!id) return;
    this.dataService.deleteData('orders', id)
      .catch((err: any) => console.error('Error deleting order:', err));
  }
  resetOrder(): OrderData {
    const today = new Date().toISOString().split('T')[0];
    return {
      clientId: '',
      tradespersonId: '',
      serviceType: '',
      status: 'جديدة',
      date: today
    };
  }

  closeModal() {
    this.isModalOpen = false;
    this.newOrder = this.resetOrder();
  }
}