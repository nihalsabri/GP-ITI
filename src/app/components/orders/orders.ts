import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { DataService } from '../../services/data';
import { MatIconModule } from '@angular/material/icon';


interface Client {
  id: number;
  name: string;
}

interface Tradesperson {
  id: number;
  name: string;
  job: string;
}

interface OrderData {
  id?: string;
  clientId: number;
  tradespersonId: number;
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
  imports: [CommonModule, FormsModule,MatIconModule]
})
export class OrdersComponent implements OnInit {
  orders: OrderData[] = [];
  clients: Client[] = [
    { id: 1, name: 'أحمد محمد' },
    { id: 2, name: 'محمود علي' },
    { id: 3, name: 'سارة جمال' }
  ];
  tradespeople: Tradesperson[] = [
    { id: 101, name: 'حسن عبد الله', job: 'كهربائي' },
    { id: 102, name: 'كريم مصطفى', job: 'سباك' },
    { id: 103, name: 'علي سعيد', job: 'نجار' }
  ];

  isModalOpen = false;
  isEditMode = false;
  newOrder: OrderData;

  constructor(private dataService: DataService) {
    this.newOrder = this.resetOrder();
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  // ====== تحميل الأوردرات من Firebase ======
  loadOrders() {
    this.dataService.getData('orders').subscribe(
      (data: OrderData[]) => {
        this.orders = data || [];
      },
      (error: any) => console.error('Error loading orders:', error)
    );
  }

  // ====== فتح المودال ======
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

  closeModal() {
    this.isModalOpen = false;
    this.newOrder = this.resetOrder();
  }

  onOverlayClick(event: any) {
    if (event.target.classList.contains('overlay')) {
      this.closeModal();
    }
  }

  // ====== حفظ أو تحديث الأوردر ======
  saveOrder(form: NgForm) {
    if (!form.valid) return;

    if (this.isEditMode && this.newOrder.id) {
      this.dataService.updateData('orders', this.newOrder.id, this.newOrder)
        .then(() => this.closeModal())
        .catch((error: any) => console.error('Error updating order:', error));
    } else {
      this.dataService.addData('orders', this.newOrder)
        .then(() => this.closeModal())
        .catch((err: any) => console.error('Error adding order:', err));
    }
  }

  // ====== حذف الأوردر ======
  deleteOrder(id?: string) {
    if (!id) return;
    this.dataService.deleteData('orders', id)
      .catch((err: any) => console.error('Error deleting order:', err));
  }

  // ====== مساعدة ======
  getClientName(id: number) {
    const client = this.clients.find(c => c.id === id);
    return client ? client.name : '-';
  }

  getTradespersonName(id: number) {
    const person = this.tradespeople.find(t => t.id === id);
    return person ? person.name : '-';
  }

  resetOrder(): OrderData {
    const today = new Date().toISOString().split('T')[0];
    return {
      clientId: 0,
      tradespersonId: 0,
      serviceType: '',
      status: 'جديدة',
      date: today
    };
  }
}
