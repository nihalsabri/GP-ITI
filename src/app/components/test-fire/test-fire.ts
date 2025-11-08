import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data';
import { Observable, Subscription } from 'rxjs';

interface Message {
  id: string;
  text: string;
  createdAt: string;
}

@Component({
  selector: 'app-test-firebase',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: `test-fire.html`,
  styleUrl: './test-fire.css'
})
export class TestFirebaseComponent implements OnDestroy {
  newMessage = '';  
  messages$: Observable<any[]>;
  private subscription?: Subscription;

  constructor(private dataService: DataService) {  
    this.messages$ = this.dataService.getData('messages'); 
  }

  addMessage() {
    if (this.newMessage.trim()) {
      this.dataService.addData('messages', {
        text: this.newMessage.trim()
      }).then(() => {
        console.log(' تمت إضافة الرسالة بنجاح');
      }).catch((error) => {
        console.error('خطأ في إضافة الرسالة:', error);
        alert('حدث خطأ أثناء إضافة الرسالة');
      });
      this.newMessage = '';
    }
  }

  deleteMessage(id: string) {
    if (confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
      this.dataService.deleteData('messages', id).then(() => {
        console.log(' تم الحذف بنجاح');
      }).catch((error) => {
        console.error(' خطأ في الحذف:', error);
        alert('حدث خطأ أثناء حذف الرسالة');
      });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}