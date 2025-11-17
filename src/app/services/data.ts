import { Injectable } from '@angular/core';
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  remove,
  update,
  off,
  Database,
} from 'firebase/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private db: Database;
  constructor() {
    this.db = getDatabase();
  }
  // crud operations
  addData(path: string, data: any): Promise<void> {
    try {
      const listRef = ref(this.db, path);
      const newRef = push(listRef);
      const id = newRef.key;

      return set(newRef, {
        id,
        ...data,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error(' Error in addData:', error);
      return Promise.reject(error);
    }
  }

  getData(path: string): Observable<any[]> {
    return new Observable((observer) => {
      try {
        const dbRef = ref(this.db, path);
        const unsubscribe = onValue(
          dbRef,
          (snapshot) => {
            const data = snapshot.val();
            if (data) {
              const dataArray = Object.keys(data).map((key) => data[key]);
              dataArray.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );
              observer.next(dataArray);
            } else {
              observer.next([]);
            }
          },
          (error) => {
            console.error('Error in reading data', error);
            observer.error(error);
          }
        );

        return () => {
          off(dbRef);
        };
      } catch (error) {
        console.error('ُError in getData:', error);
        observer.error(error);
        return () => {};
      }
    });
  }

  updateData(path: string, id: string, data: any): Promise<void> {
    try {
      const dbRef = ref(this.db, `${path}/${id}`);
      return update(dbRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error(' Error in updateData:', error);
      return Promise.reject(error);
    }
  }

  deleteData(path: string, id: string): Promise<void> {
    try {
      const dbRef = ref(this.db, `${path}/${id}`);
      return remove(dbRef);
    } catch (error) {
      console.error('Error in deleteData:', error);
      return Promise.reject(error);
    }
  }

  checkConnection(): Observable<boolean> {
    return new Observable((observer) => {
      const connectedRef = ref(this.db, '.info/connected');
      const unsubscribe = onValue(connectedRef, (snapshot) => {
        observer.next(snapshot.val() === true);
      });
      return () => off(connectedRef);
    });
  }
}
