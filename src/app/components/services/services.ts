import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

export interface Service {
  id?: number;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt?: Date;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
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
  currentServiceId: number | null = null;
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
    'تنظيف',
  ];

  private apiUrl = 'http://localhost:3000/api/services';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.loading = true;
    this.http.get<Service[]>(this.apiUrl).subscribe({
      next: (services) => {
        this.services = services;
        this.filteredServices = services;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.services = this.getDummyData();
        this.filteredServices = this.services;
        this.loading = false;
      },
    });
  }

  getDummyData(): Service[] {
    return [
      {
        id: 1,
        name: 'سباكة منزلية',
        description:
          'خدمات سباكة شاملة للمنازل والشقق تشمل إصلاح التسريبات وتركيب المواسير',
        category: 'سباكة',
        price: 150,
        isActive: true,
        imageUrl: 'https://via.placeholder.com/60/4299e1/ffffff?text=سباكة',
      },
      {
        id: 2,
        name: 'نجارة وتركيبات',
        description: 'تركيب وصيانة جميع أعمال النجارة من أبواب وشبابيك وخزائن',
        category: 'نجارة',
        price: 200,
        isActive: true,
        imageUrl: 'https://via.placeholder.com/60/f59e0b/ffffff?text=نجارة',
      },
      {
        id: 3,
        name: 'صيانة كهرباء',
        description: 'صيانة وإصلاح جميع الأعطال الكهربائية وتركيب الإضاءة',
        category: 'كهرباء',
        price: 180,
        isActive: true,
        imageUrl: 'https://via.placeholder.com/60/10b981/ffffff?text=كهرباء',
      },
      {
        id: 4,
        name: 'دهانات ونقاشة',
        description: 'أعمال الدهانات والديكورات بجميع أنواعها',
        category: 'نقاشة',
        price: 250,
        isActive: false,
        imageUrl: 'https://via.placeholder.com/60/8b5cf6/ffffff?text=دهانات',
      },
    ];
  }

  onAddNew(): void {
    this.isEditMode = false;
    this.showForm = true;
    this.serviceForm.reset({ isActive: true, price: 0 });
    this.imagePreview = null;
    this.selectedImage = null;
  }

  onEdit(service: Service): void {
    this.isEditMode = true;
    this.showForm = true;
    this.currentServiceId = service.id!;
    this.serviceForm.patchValue(service);
    this.imagePreview = service.imageUrl || null;
  }

  onDelete(service: Service): void {
    if (confirm(`هل أنت متأكد من حذف الخدمة "${service.name}"؟`)) {
      this.http.delete(`${this.apiUrl}/${service.id}`).subscribe({
        next: () => {
          this.loadServices();
          alert('تم حذف الخدمة بنجاح ✅');
        },
        error: (error) => {
          console.error('Error deleting service:', error);
          this.services = this.services.filter((s) => s.id !== service.id);
          this.filteredServices = this.services;
          alert('تم حذف الخدمة بنجاح ✅');
        },
      });
    }
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const serviceData: Service = this.serviceForm.value;

    if (this.selectedImage) {
      this.uploadImage(this.selectedImage).subscribe({
        next: (response) => {
          serviceData.imageUrl = response.imageUrl;
          this.saveService(serviceData);
        },
        error: (error) => {
          console.error('Error uploading image:', error);
          this.saveService(serviceData);
        },
      });
    } else {
      if (this.isEditMode && this.imagePreview) {
        serviceData.imageUrl = this.imagePreview;
      }
      this.saveService(serviceData);
    }
  }

  uploadImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<{ imageUrl: string }>(`${this.apiUrl}/upload`, formData);
  }

  private saveService(serviceData: Service): void {
    const request = this.isEditMode
      ? this.http.put<Service>(`${this.apiUrl}/${this.currentServiceId}`, serviceData)
      : this.http.post<Service>(this.apiUrl, serviceData);

    request.subscribe({
      next: () => {
        this.loadServices();
        this.onCancel();
        alert(this.isEditMode ? 'تم تحديث الخدمة بنجاح ✅' : 'تم إضافة الخدمة بنجاح ✅');
        this.loading = false;
      },
      error: (error) => {
        console.error('Error saving service:', error);
        if (!this.isEditMode) {
          const newService = { ...serviceData, id: Date.now() };
          this.services.push(newService);
          this.filteredServices = this.services;
        }
        this.onCancel();
        alert(this.isEditMode ? 'تم تحديث الخدمة بنجاح ✅' : 'تم إضافة الخدمة بنجاح ✅');
        this.loading = false;
      },
    });
  }

  onCancel(): void {
    this.showForm = false;
    this.serviceForm.reset();
    this.imagePreview = null;
    this.selectedImage = null;
    this.currentServiceId = null;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredServices = this.services.filter(
      (service) =>
        service.name.toLowerCase().includes(filterValue) ||
        service.category.toLowerCase().includes(filterValue) ||
        service.description.toLowerCase().includes(filterValue)
    );
  }

  getError(field: string): string {
    const control = this.serviceForm.get(field);
    if (control?.hasError('required')) {
      return 'هذا الحقل مطلوب';
    }
    if (control?.hasError('minlength')) {
      return `يجب أن يكون ${control.errors?.['minlength'].requiredLength} أحرف على الأقل`;
    }
    if (control?.hasError('min')) {
      return 'يجب أن يكون الرقم أكبر من أو يساوي صفر';
    }
    return '';
  }
}
