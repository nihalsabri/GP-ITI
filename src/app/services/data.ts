import { Injectable } from '@angular/core';
import { getDatabase, ref, push, set, onValue, remove, update, off, Database } from 'firebase/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private db: Database;
  constructor() {
    this.db = getDatabase();
  }

  addData(path: string, data: any): Promise<void> {
    console.log('Adding data to', path, data);
    const listRef = ref(this.db, path);
    const newRef = push(listRef);
    const id = newRef.key;
    return set(newRef, { id, ...data, createdAt: new Date().toISOString() });
  }

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
    });
  }

  updateData(path: string, id: string, data: any): Promise<void> {
    console.log('Updating data', id, 'in', path, data);
    const dbRef = ref(this.db, `${path}/${id}`);
    return update(dbRef, { ...data, updatedAt: new Date().toISOString() });
  }

  deleteData(path: string, id: string): Promise<void> {
    console.log('Deleting data', id, 'from', path);
    const dbRef = ref(this.db, `${path}/${id}`);
    return remove(dbRef);
  }
}
