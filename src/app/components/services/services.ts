import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './services.html',
  styleUrls: ['./services.css']
})
export class ServicesComponent implements OnInit {
  services$!: Observable<any[]>;
  filteredServices$!: Observable<any[]>;
  searchTerm = '';

  serviceForm: FormGroup;
  showForm = false;
  isEditMode = false;
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  editingId: string | null = null;
  loading = false;

  categories = [
    'سباكة',
    'نجارة',
    'كهرباء',
    'نقاشة',
    'تكييفات',
    'أعمال منزلية',
    'صيانة عامة',
    'كهربائيات',
    'دهانات',
    'تنظيف'
  ];

  constructor(
    private fb: FormBuilder,
    private dataService: DataService
  ) {
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    console.log('🚀 ServiceComponent initialized');
    this.loadData();
  }

  loadData(): void {
    console.log('📥 Loading data from Firebase: services');
    this.services$ = this.dataService.getData('services');
    this.filteredServices$ = this.services$;

    // للتشخيص: اطبع البيانات
    this.services$.subscribe(data => {
      console.log('✅ Data received from Firebase:', data);
      console.log('📊 Number of services:', data.length);
    });
  }

  filterData(): void {
    if (!this.searchTerm.trim()) {
      this.filteredServices$ = this.services$;
      return;
    }

    this.filteredServices$ = new Observable(observer => {
      this.services$.subscribe(data => {
        const filtered = data.filter(service =>
          service.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          service.category.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          service.description.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
        observer.next(filtered);
      });
    });
  }

  onAddNew(): void {
    console.log('➕ Opening add new form');
    this.isEditMode = false;
    this.showForm = true;
    this.editingId = null;
    this.serviceForm.reset({ isActive: true, price: 0, imageUrl: '' });
    this.imagePreview = null;
    this.selectedImage = null;
  }

  onEdit(service: any): void {
    console.log('✏️ Editing service:', service);
    this.isEditMode = true;
    this.showForm = true;
    this.editingId = service.id;
    this.serviceForm.patchValue({
      name: service.name,
      description: service.description,
      category: service.category,
      price: service.price,
      imageUrl: service.imageUrl || '',
      isActive: service.isActive
    });
    this.imagePreview = service.imageUrl || null;
  }

  onDelete(service: any): void {
    console.log('🗑️ Attempting to delete service:', service);
    if (confirm(`هل أنت متأكد من حذف الخدمة "${service.name}"؟`)) {
      this.loading = true;
      console.log('🔥 Deleting from Firebase path: services/' + service.id);

      this.dataService.deleteData('services', service.id)
        .then(() => {
          console.log('✅ Delete successful');
          alert('تم حذف الخدمة بنجاح ✅');
          this.loading = false;
        })
        .catch(error => {
          console.error('❌ Delete failed:', error);
          alert('حدث خطأ أثناء حذف الخدمة ❌');
          this.loading = false;
        });
    }
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      console.log('📷 Image selected:', file.name, file.size, 'bytes');
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        this.serviceForm.patchValue({ imageUrl: e.target.result });
        console.log('✅ Image converted to Base64');
      };
      reader.readAsDataURL(file);
    }
  }

  saveData(): void {
    console.log('💾 Attempting to save data');
    console.log('📝 Form valid:', this.serviceForm.valid);
    console.log('📋 Form data:', this.serviceForm.value);

    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      console.warn('⚠️ Form is invalid');
      alert('يرجى ملء جميع الحقول المطلوبة ⚠️');
      return;
    }

    console.log('Submitting form...', this.serviceForm.value);
    this.loading = true;
    const serviceData = this.serviceForm.value;
    console.log('📦 Service data to save:', serviceData);

    if (this.isEditMode && this.editingId) {
      console.log('🔄 Updating existing service, ID:', this.editingId);
      this.dataService.updateData('services', this.editingId, serviceData)
        .then(() => {
          console.log('✅ Update successful');
          alert('تم تحديث الخدمة بنجاح ✅');
          this.closeModal();
          this.loading = false;
        })
        .catch(error => {
          console.error('❌ Update failed:', error);
          alert('حدث خطأ أثناء تحديث الخدمة ❌');
          this.loading = false;
        });
    } else {
      console.log('➕ Adding new service to path: services');
      this.dataService.addData('services', serviceData)
        .then((id) => {
          console.log('✅ Add successful, new ID:', id);
          alert('تم إضافة الخدمة بنجاح ✅');
          this.closeModal();
          this.loading = false;
        })
        .catch(error => {
          console.error('❌ Add failed:', error);
          console.error('Error details:', JSON.stringify(error));
          alert('حدث خطأ أثناء إضافة الخدمة ❌');
          this.loading = false;
        });
    }
  }
  
  closeModal(): void {
    console.log('🚪 Closing modal');
    this.showForm = false;
    this.isEditMode = false;
    this.editingId = null;
    this.serviceForm.reset({ isActive: true, price: 0, imageUrl: '' });
    this.imagePreview = null;
    this.selectedImage = null;
  }

  getError(field: string): string {
    const control = this.serviceForm.get(field);
    if (control?.hasError('required')) {
      return 'هذا الحقل مطلوب';
    }
    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength'].requiredLength;
      return `يجب أن يكون ${requiredLength} أحرف على الأقل`;
    }
    if (control?.hasError('min')) {
      return 'يجب أن يكون الرقم أكبر من أو يساوي صفر';
    }
    return '';
  }

  onSubmit(): void {
    this.saveData();
  }

  onCancel(): void {
    this.closeModal();
  }

  applyFilter(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filterData();
  }
}
