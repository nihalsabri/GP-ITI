// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { Service, ServicesComponent } from './services';

// describe('ServiceComponent', () => {
//   let component: ServicesComponent;
//   let fixture: ComponentFixture<ServicesComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [ ServicesComponent ],
//       imports: [
//         HttpClientTestingModule,
//         ReactiveFormsModule
//       ]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(ServicesComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should initialize form with default values', () => {
//     expect(component.serviceForm.get('name')?.value).toBe('');
//     expect(component.serviceForm.get('isActive')?.value).toBe(true);
//     expect(component.serviceForm.get('price')?.value).toBe(0);
//   });

//   it('should validate required fields', () => {
//     const nameControl = component.serviceForm.get('name');
//     const categoryControl = component.serviceForm.get('category');

//     expect(nameControl?.valid).toBeFalsy();
//     expect(categoryControl?.valid).toBeFalsy();

//     nameControl?.setValue('سباكة');
//     categoryControl?.setValue('سباكة');

//     expect(nameControl?.valid).toBeTruthy();
//     expect(categoryControl?.valid).toBeTruthy();
//   });

//   it('should load dummy data on init', () => {
//     component.ngOnInit();
//     expect(component.services.length).toBeGreaterThan(0);
//   });

//   it('should toggle form visibility on add new', () => {
//     expect(component.showForm).toBeFalsy();
//     component.onAddNew();
//     expect(component.showForm).toBeTruthy();
//     expect(component.isEditMode).toBeFalsy();
//   });

//   it('should filter services correctly', () => {
//     component.services = component.getDummyData();
//     component.filteredServices = component.services;

//     const event = { target: { value: 'سباكة' } } as any;
//     component.applyFilter(event);

//     expect(component.filteredServices.length).toBeLessThanOrEqual(component.services.length);
//   });
// });
