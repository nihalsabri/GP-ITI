import { Injectable } from '@angular/core';
import { getDatabase, ref, push, set, onValue, remove, update,
  off, Database} from 'firebase/database';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { initializeApp, getApps } from 'firebase/app';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  
// @Injectable({
//   providedIn: 'root',
// })
// export class DataService {
//   private db: Database;
//   constructor() {
//     this.db = getDatabase();
//   }

  // crud operations
  addData(path: string, data: any): Promise<void> {
    console.log('Adding data to', path, data);
    const listRef = ref(this.db, path);
    const newRef = push(listRef);
    const id = newRef.key;
    return set(newRef, { id, ...data, createdAt: new Date().toISOString() });


      const db = getDatabase();
      const listRef = ref(db, path);
      const newRef = push(listRef);
      const id = newRef.key ?? '';

      const createdAt = new Date().toISOString();
      await set(newRef, { id, ...data, createdAt });

      return id;
    } catch (err) {
      console.error('Error in addData (modular):', err);
      return Promise.reject(err);
    }
=======

  addData(path: string, data: any): Promise<void> {
    console.log('Adding data to', path, data);
    const listRef = ref(this.db, path);
    const newRef = push(listRef);
    const id = newRef.key;
    return set(newRef, { id, ...data, createdAt: new Date().toISOString() });

  }

  /**
   * Read list via AngularFire compat (keeps snapshotChanges, sorting)
   */
  getData(path: string): Observable<any[]> {
    return new Observable(observer => {
      const dbRef = ref(this.db, path);
      onValue(dbRef, snapshot => {
        const data = snapshot.val();
        if (data) {
          const dataArray = Object.keys(data).map(key => data[key]);
          dataArray.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          observer.next(dataArray);
        } else {
          observer.next([]);
        }
      }, error => observer.error(error));
      try {
        const dbRef = ref(this.db, path);
        const unsubscribe = onValue(
          dbRef, 
          (snapshot) => {
            const data = snapshot.val();
            if (data) {
              const dataArray = Object.keys(data).map(key => data[key]);
              dataArray.sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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
  updateData(path: string, id: string, data: any): Promise<void> {
    try {
      const dbRef = ref(this.db, `${path}/${id}`);
      return update(dbRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error(' Error in updateData:', error);
      return Promise.reject(error);
    }
    console.log('Updating data', id, 'in', path, data);
    const dbRef = ref(this.db, `${path}/${id}`);
    return update(dbRef, { ...data, updatedAt: new Date().toISOString() });

  deleteData(path: string, id: string): Promise<void> {    console.log('Deleting data', id, 'from', path);
    const dbRef = ref(this.db, `${path}/${id}`);
    return remove(dbRef);
  }
