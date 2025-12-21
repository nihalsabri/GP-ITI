import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data';
import { Observable } from 'rxjs';
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

@Component({
  selector: 'app-tradespeople',
  standalone: true,
  imports: [CommonModule, FormsModule,MatIconModule],
 templateUrl: `./tradespeople.html`,
  styleUrl: './tradespeople.css'
})
export class Tradespeople implements OnInit {
    // $ is a convention to indicate an Observable
    //observable stream of Tradesperson array
  tradespeople$!: Observable<Tradesperson[]>;
  filteredTradespeople$!: Observable<Tradesperson[]>;
  searchTerm = '';

  showAddModal = false;
  showEditModal = false;

  formData: any = {
    name: '',
    trade: '',
    phone: '',
    email: '',
    experience: null,
    rating: null
  };

  editingId: string | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
      //to access Tradespeople data from Firebase
    this.tradespeople$ = this.dataService.getData('Tradespeople');
    this.filteredTradespeople$ = this.tradespeople$;
  }

  filterData() {
    if (!this.searchTerm.trim()) {
      this.filteredTradespeople$ = this.tradespeople$;
      return;
    }

    this.filteredTradespeople$ = new Observable(observer => {
      this.tradespeople$.subscribe(data => {
        const filtered = data.filter(person =>
          person.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          person.trade.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
        observer.next(filtered);
      });
    });
  }

  editTradesperson(person: Tradesperson) {
    this.editingId = person.id;
    this.formData = { ...person };
    this.showEditModal = true;
  }

  deleteTradesperson(id: string, name: string) {
    if (confirm(`Are you sure to delete "${name}"؟`)) {
      this.dataService.deleteData('Tradespeople', id)
        .then(() => {
          console.log('Deleted successfully ');
        })
        .catch(error => {
          console.error('ُError while deleting', error);
          alert('Error occurred while deleting');
        });
    }
  }

  saveData() {
    if (!this.formData.name || !this.formData.trade || !this.formData.phone) {
      alert(' Please fill in all required fields');
      return;
    }

    if (this.showEditModal && this.editingId) {
      this.dataService.updateData('Tradespeople', this.editingId, this.formData)
        .then(() => {
          console.log('updated successfully ');
          this.closeModal();
        })
        .catch(error => {
          console.error('error happened while updating', error);
          alert('Error occurred while updating');
        });
    } else {
      this.dataService.addData('Tradespeople', this.formData)
        .then(() => {
          console.log('Added successfully ');
          this.closeModal();
        })
        .catch(error => {
          console.error(' error happened while adding new tradepeople', error);
          alert('Error occurred while adding new tradesperson');
        });
    }
  }

  closeModal() {
    this.showAddModal = false;
    this.showEditModal = false;
    this.editingId = null;
    this.formData = {
      name: '',
      trade: '',
      phone: '',
      email: '',
      experience: null,
      rating: null
    };
  }
}
