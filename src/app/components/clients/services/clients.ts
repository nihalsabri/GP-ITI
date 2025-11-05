// src/app/components/clients/services/clients.service.ts
import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  deleteDoc,
  docData,
  updateDoc,
  Timestamp,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Client } from './../client.model';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private clientsCollection = collection(this.firestore, 'clients');

  constructor(private firestore: Firestore) {}

  // Get all clients
  getClients(): Observable<Client[]> {
    return collectionData(this.clientsCollection, { idField: 'id' }).pipe(
      map((clients: any[]) => {
        return clients.map((client) => ({
          ...client,
          registrationDate: client.registrationDate?.toDate
            ? client.registrationDate.toDate()
            : new Date(client.registrationDate),
        }));
      })
    );
  }

  // Get single client by ID
  getClientById(id: string): Observable<Client> {
    const clientDoc = doc(this.firestore, `clients/${id}`);
    return docData(clientDoc, { idField: 'id' }).pipe(
      map((client: any) => ({
        ...client,
        registrationDate: client.registrationDate?.toDate
          ? client.registrationDate.toDate()
          : new Date(client.registrationDate),
      }))
    );
  }

  // Add new client
  addClient(client: Client): Promise<any> {
    const clientData = {
      ...client,
      registrationDate: Timestamp.fromDate(new Date()),
      status: client.status || 'active',
    };
    return addDoc(this.clientsCollection, clientData);
  }

  // Delete client
  deleteClient(id: string): Promise<void> {
    const clientDoc = doc(this.firestore, `clients/${id}`);
    return deleteDoc(clientDoc);
  }

  // Update client (optional - for future use if needed)
  updateClient(id: string, client: Partial<Client>): Promise<void> {
    const clientDoc = doc(this.firestore, `clients/${id}`);
    return updateDoc(clientDoc, { ...client });
  }
}
