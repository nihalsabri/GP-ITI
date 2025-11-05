// src/app/components/clients/clients.ts
import { Component, OnInit, OnDestroy } from '@angular/core';

import { ClientsService } from './services/clients';

import { Client } from './client.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.html',
  styleUrls: ['./clients.css'],
  imports: [BrowserModule, FormsModule],
})
export class ClientsComponent implements OnInit, OnDestroy {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  selectedClient: Client | null = null;
  showAddModal = false;
  showDetailsModal = false;
  showDeleteConfirm = false;
  clientToDelete: Client | null = null;
  searchTerm = '';
  isLoading = false;
  errorMessage = '';

  newClient: Client = {
    name: '',
    email: '',
    phone: '',
    address: '',
    registrationDate: new Date(),
    currentService: '',
    paymentMethod: '',
    status: 'active',
  };

  private destroy$ = new Subject<void>();

  constructor(private clientsService: ClientsService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadClients(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.clientsService
      .getClients()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clients) => {
          this.clients = clients;
          this.filteredClients = clients;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading clients:', error);
          this.errorMessage = 'Failed to load clients. Please try again.';
          this.isLoading = false;
        },
      });
  }

  searchClients(): void {
    if (!this.searchTerm.trim()) {
      this.filteredClients = this.clients;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredClients = this.clients.filter(
      (client) =>
        client.name.toLowerCase().includes(term) ||
        client.email.toLowerCase().includes(term) ||
        client.phone.includes(term) ||
        (client.currentService && client.currentService.toLowerCase().includes(term))
    );
  }

  openAddModal(): void {
    this.showAddModal = true;
    this.resetNewClient();
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.resetNewClient();
  }

  openDetailsModal(client: Client): void {
    this.selectedClient = client;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedClient = null;
  }

  openDeleteConfirm(client: Client): void {
    this.clientToDelete = client;
    this.showDeleteConfirm = true;
  }

  closeDeleteConfirm(): void {
    this.showDeleteConfirm = false;
    this.clientToDelete = null;
  }

  addClient(): void {
    if (!this.isValidClient(this.newClient)) {
      this.errorMessage = 'Please fill in all required fields (Name, Email, Phone).';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.clientsService
      .addClient(this.newClient)
      .then(() => {
        this.closeAddModal();
        this.isLoading = false;
      })
      .catch((error) => {
        console.error('Error adding client:', error);
        this.errorMessage = 'Failed to add client. Please try again.';
        this.isLoading = false;
      });
  }

  confirmDelete(): void {
    if (!this.clientToDelete || !this.clientToDelete.id) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.clientsService
      .deleteClient(this.clientToDelete.id)
      .then(() => {
        this.closeDeleteConfirm();
        this.isLoading = false;
      })
      .catch((error) => {
        console.error('Error deleting client:', error);
        this.errorMessage = 'Failed to delete client. Please try again.';
        this.isLoading = false;
      });
  }

  private isValidClient(client: Client): boolean {
    return !!(client.name && client.email && client.phone);
  }

  private resetNewClient(): void {
    this.newClient = {
      name: '',
      email: '',
      phone: '',
      address: '',
      registrationDate: new Date(),
      currentService: '',
      paymentMethod: '',
      status: 'active',
    };
  }
}
