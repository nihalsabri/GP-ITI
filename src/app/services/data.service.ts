import { Injectable } from '@angular/core';
import {getDatabase, ref,push,set, onValue,remove,
   update,off,Database
} from 'firebase/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private db: Database;

  constructor() {
    this.db = getDatabase();
  }

  addData(path: string, data: any): Promise<void> { //هتعلمني بحاجة
    try {
      const listRef = ref(this.db, path);
      const newRef = push(listRef);
      const id = newRef.key;

      return set(newRef, { // idبتقول  كل الداتا اللي انا هبعتهالك من ال
        id,//ده حطها
        ...data,//علي كل الداتا اللي بعتتها
        createdAt: new Date().toISOString() //وقت الانشاء
      });
    } catch (error) {
      console.error(' Error in addData:', error);
      return Promise.reject(error);
    }
  }

  getData(path: string): Observable<any[]> { //رجعلي الداتا متحدثة
    return new Observable(observer => {
      try {
        const dbRef = ref(this.db, path);//روح للpath اللي انا بعتها
        const unsubscribe = onValue( //تابعلي التغيرات في الداتا
          dbRef,
          (snapshot: any) => {//لما الداتا تتغير
            const data = snapshot.val();//جيبلي الداتا
            if (data) {//لو في داتا
             const dataArray = Object.keys(data).map(key => {
  const item = data[key];
  // إذا كان العنصر مخزّن بالفعل مع id داخلي، نركّبه لكن نضمن وجود id = key
  return { id: key, ...item };
});
//حولها لمصفوفة
              dataArray.sort((a, b) =>// رتبها حسب تاريخ الانشاء
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()//الاخدث في الاول
              );
              observer.next(dataArray);//ابعثلي الداتا
            } else {//لو مفيش داتا
              observer.next([]);//ابعثلي مصفوفة فاضية
            }
          },
          (error: any) => {//لو في مشكلة
            console.error('Error in reading data', error);//اطبعلي الخطأ
            observer.error(error);//ابعثلي الخطأ
          }
        );

        return () => {//لما حد يشترك في الobservable
          off(dbRef);//وقف الاشتراك
        };
      } catch (error) {//لو في مشكلة
        console.error('ُError in getData:', error);//اطبعلي الخطأ
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
        updatedAt: new Date().toISOString()
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
    return new Observable(observer => {
      const connectedRef = ref(this.db, '.info/connected');
      const unsubscribe = onValue(connectedRef, (snapshot: any) => {
        observer.next(snapshot.val() === true);
      });
      return () => off(connectedRef);
    });
  }
}
