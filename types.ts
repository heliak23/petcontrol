
export enum AppointmentStatus {
  CONFIRMED = 'Confirmado',
  PENDING = 'Pendente',
  CANCELLED = 'Cancelado',
}

export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: string;
  weight: string;
  gender: 'male' | 'female';
  image?: string;
}

export interface Client {
  id: string;
  name: string;
  initials: string;
  phone: string;
  email: string;
  pets: Pet[];
  image?: string;
}

export interface Appointment {
  id: string;
  petName: string;
  clientName: string;
  service: string;
  date: string;
  time: string;
  professional: string;
  professionalInitials: string;
  status: AppointmentStatus;
  petImage?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  discount?: string;
  rating: number;
  reviews: number;
  image: string;
  status?: 'NOVO' | 'ESGOTADO';
}

export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  duration: string;
  price: number;
  image: string;
}
