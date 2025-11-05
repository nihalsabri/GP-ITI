export interface Client {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  registrationDate: Date;
  currentService?: string;
  paymentMethod?: string;
  status?: 'active' | 'inactive';
}
