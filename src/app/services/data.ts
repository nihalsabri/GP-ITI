// import { Injectable } from '@angular/core';
// import { AngularFireDatabase } from '@angular/fire/compat/database'; // ← THIS LINE

// import {
//   getDatabase,
//   ref,
//   push,
//   set,
//   onValue,
//   remove,
//   update,
//   off,
//   Database,
// } from 'firebase/database';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class DataService {
//   private db: Database;
//   constructor() {
//     this.db = getDatabase();
//   }
//   // crud operations
//   addData(path: string, data: any): Promise<void> {
//     try {
//       const listRef = ref(this.db, path);
//       const newRef = push(listRef);
//       const id = newRef.key;

//       return set(newRef, {
//         id,
//         ...data,
//         createdAt: new Date().toISOString(),
//       });
//     } catch (error) {
//       console.error(' Error in addData:', error);
//       return Promise.reject(error);
//     }
//   }

//   getData(path: string): Observable<any[]> {
//     return new Observable((observer) => {
//       try {
//         const dbRef = ref(this.db, path);
//         const unsubscribe = onValue(
//           dbRef,
//           (snapshot) => {
//             const data = snapshot.val();
//             if (data) {
//               const dataArray = Object.keys(data).map((key) => data[key]);
//               dataArray.sort(
//                 (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//               );
//               observer.next(dataArray);
//             } else {
//               observer.next([]);
//             }
//           },
//           (error) => {
//             console.error('Error in reading data', error);
//             observer.error(error);
//           }
//         );

//         return () => {
//           off(dbRef);
//         };
//       } catch (error) {
//         console.error('ُError in getData:', error);
//         observer.error(error);
//         return () => {};
//       }
//     });
//   }

//   updateData(path: string, id: string, data: any): Promise<void> {
//     try {
//       const dbRef = ref(this.db, `${path}/${id}`);
//       return update(dbRef, {
//         ...data,
//         updatedAt: new Date().toISOString(),
//       });
//     } catch (error) {
//       console.error(' Error in updateData:', error);
//       return Promise.reject(error);
//     }
//   }

//   deleteData(path: string, id: string): Promise<void> {
//     try {
//       const dbRef = ref(this.db, `${path}/${id}`);
//       return remove(dbRef);
//     } catch (error) {
//       console.error('Error in deleteData:', error);
//       return Promise.reject(error);
//     }
//   }

//   checkConnection(): Observable<boolean> {
//     return new Observable((observer) => {
//       const connectedRef = ref(this.db, '.info/connected');
//       const unsubscribe = onValue(connectedRef, (snapshot) => {
//         observer.next(snapshot.val() === true);
//       });
//       return () => off(connectedRef);
//     });
//   }
// }

import { Injectable, Injector, runInInjectionContext } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private afd: AngularFireDatabase, private injector: Injector) {}

  /**
   * Add data to a list path. Generates a key, sets createdAt, and writes the id into the record.
   */
  async addData(path: string, data: any): Promise<void> {
    try {
      const createdAt = new Date().toISOString();
      const listRef = this.afd.list(path);

      const newRef: any = await listRef.push({ ...data, createdAt });

      const id = newRef?.key;
      if (id) {
        await this.afd.object(`${path}/${id}`).update({ id });
      }

      return Promise.resolve();
    } catch (error) {
      console.error('Error in addData:', error);
      return Promise.reject(error);
    }
  }

  /**
   * Returns an Observable of the list at `path` as an array of objects.
   * Ensures the call runs inside Angular's injection context to avoid NG0203.
   */
  getData(path: string): Observable<any[]> {
    // run the list subscription inside Angular's injection context so internal `inject()` calls succeed
    return runInInjectionContext(this.injector, () =>
      this.afd
        .list(path)
        .snapshotChanges()
        .pipe(
          map((changes) =>
            (changes || []).map((c: any) => {
              const payload = c.payload.val();
              return {
                id: c.payload.key,
                ...payload,
              };
            })
          ),
          map((arr: any[]) =>
            arr.sort(
              (a, b) =>
                (new Date(b.createdAt || 0).getTime() || 0) -
                (new Date(a.createdAt || 0).getTime() || 0)
            )
          )
        )
    );
  }

  /**
   * Update an object at path/id. Adds updatedAt timestamp.
   */
  updateData(path: string, id: string, data: any): Promise<void> {
    try {
      const dbRef = this.afd.object(`${path}/${id}`);
      return dbRef.update({
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error in updateData:', error);
      return Promise.reject(error);
    }
  }

  /**
   * Delete an object at path/id.
   */
  deleteData(path: string, id: string): Promise<void> {
    try {
      const dbRef = this.afd.object(`${path}/${id}`);
      return dbRef.remove();
    } catch (error) {
      console.error('Error in deleteData:', error);
      return Promise.reject(error);
    }
  }

  /**
   * Check connection state (.info/connected) -> emits boolean
   */
  checkConnection(): Observable<boolean> {
    // run in injection context for consistency
    return runInInjectionContext(this.injector, () =>
      this.afd
        .object<boolean>('.info/connected')
        .valueChanges()
        .pipe(map((v) => !!v))
    );
  }
}
