import { Injectable } from '@angular/core';
import { getDatabase, ref, push, set, onValue, remove, update, off, Database } from 'firebase/database';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { initializeApp, getApps } from 'firebase/app';


if (getApps().length === 0) {
  initializeApp(environment.firebase);
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private db: Database;

  constructor() {
    this.db = getDatabase();
  }

  addData(path: string, data: any): Promise<string> {
    console.log('Adding data to', path, data);
    try {
      const listRef = ref(this.db, path);
      const newRef = push(listRef);
      const id = newRef.key ?? '';
      const createdAt = new Date().toISOString();
      set(newRef, { id, ...data, createdAt });
      return Promise.resolve(id);
    } catch (err) {
      console.error('Error in addData:', err);
      return Promise.reject(err);
    }
  }

  getData(path: string): Observable<any[]> {
    return new Observable(observer => {
      const dbRef = ref(this.db, path);
      const unsubscribe = onValue(
        dbRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const dataArray = Object.keys(data).map(key => data[key]);
            dataArray.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            observer.next(dataArray);
          } else {
            observer.next([]);
          }
        },
        (error) => {
          console.error('Error in reading data:', error);
          observer.error(error);
        }
      );

      // Return cleanup function
      return () => {
        unsubscribe();
      };
    });
  }

  updateData(path: string, id: string, data: any): Promise<void> {
    console.log('Updating data', id, 'in', path, data);
    try {
      const dbRef = ref(this.db, `${path}/${id}`);
      return update(dbRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error in updateData:', error);
      return Promise.reject(error);
    }
  }

  deleteData(path: string, id: string): Promise<void> {
    console.log('Deleting data', id, 'from', path);
    const dbRef = ref(this.db, `${path}/${id}`);
    return remove(dbRef);
  }
}