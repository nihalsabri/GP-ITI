import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface Service {
  id?: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt?: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './services.html',
  styleUrls: ['./services.css'],
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];
  filteredServices: Service[] = [];
  serviceForm: FormGroup;
  isEditMode = false;
  showForm = false;
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  currentServiceId: string | null = null;
  loading = false;

  categories = ['سباكة','نجارة','كهرباء','نقاشة','تكييفات','أعمال منزلية','صيانة عامة','كهربائيات','دهانات','تنظيف'];

  constructor(private fb: FormBuilder, private data: DataService) {
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
  }

  loadServices(): void {
    console.log('Loading services...');
    this.data.getData('services').subscribe({
      next: (services) => {
        console.log('Loaded services:', services);
        // تصفية الخدمات الفارغة
        this.services = services.filter(s => s.name && s.description && s.category && s.price != null);
        this.filteredServices = [...this.services];
      },
      error: (err) => console.error('Error loading services', err),
    });
  }

  onAddNew(): void {
    this.isEditMode = false;
    this.showForm = true;
    this.imagePreview = service.imageUrl || null;
  }

  async uploadImage(file: File): Promise<string> {
    const storage = getStorage();
    const filePath = `services/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, filePath);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  async onSubmit(): Promise<void> {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      console.warn('Form invalid', this.serviceForm.value);
      return;
    }

    console.log('Submitting form...', this.serviceForm.value);
    this.loading = true;
    let formData: Service = this.serviceForm.value;

    if (this.selectedImage) {
      try {
        formData.imageUrl = await this.uploadImage(this.selectedImage);
        console.log('Image uploaded:', formData.imageUrl);
      } catch (err) {
        console.error('Error uploading image', err);
      }
    }

    if (this.isEditMode && this.currentServiceId) {
      this.data.updateData('services', this.currentServiceId, formData)
        .then(() => {
          console.log('Service updated successfully');
          this.loadServices();
          this.onCancel();
          this.loading = false;
        })
        .catch(err => console.error('Error updating service', err));
    } else {
      this.data.addData('services', { ...formData, createdAt: new Date().toISOString() })
        .then(() => {
          console.log('Service added successfully');
          this.loadServices();
          this.onCancel();
          this.loading = false;
        })
        .catch(err => console.error('Error adding service', err));
    }
  }

  onDelete(service: Service): void {
    if (!confirm(`هل أنت متأكد من حذف الخدمة "${service.name}"؟`)) return;

    this.data.deleteData('services', service.id!)
      .then(() => {
        console.log('Service deleted');
        this.loadServices();
      })
      .catch(err => console.error('Error deleting service', err));
  }

  onCancel(): void {
    this.currentServiceId = null;
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagePreview = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredServices = this.services
      .filter(service =>
        (service.name.toLowerCase().includes(value) ||
         service.category.toLowerCase().includes(value) ||
         service.description.toLowerCase().includes(value))
      )
      .filter(s => s.name && s.description && s.category && s.price != null); 
  }

  getError(field: string): string {
    const control = this.serviceForm.get(field);
    if (control?.hasError('required')) return 'هذا الحقل مطلوب';
    if (control?.hasError('minlength'))
      return `يجب أن يكون ${control.errors?.['minlength'].requiredLength} أحرف على الأقل`;
    if (control?.hasError('min')) return 'يجب أن يكون الرقم أكبر من أو يساوي صفر';
    return '';
  }
}
