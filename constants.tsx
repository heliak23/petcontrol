
import { AppointmentStatus, Client, Appointment, Product, Service } from './types';

export const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Ana Silva',
    initials: 'AS',
    phone: '(11) 98765-4321',
    email: 'ana.silva@email.com',
    pets: [
      { id: 'p1', name: 'Thor', breed: 'Golden Retriever', age: '4 anos', weight: '28kg', gender: 'male', image: 'https://picsum.photos/seed/thor/200/200' },
      { id: 'p2', name: 'Lola', breed: 'Beagle', age: '2 anos', weight: '12kg', gender: 'female', image: 'https://picsum.photos/seed/lola/200/200' }
    ]
  },
  {
    id: '2',
    name: 'Carlos Mendes',
    initials: 'CM',
    phone: '(21) 99887-6655',
    email: 'carlos.m@email.com',
    image: 'https://picsum.photos/seed/carlos/100/100',
    pets: [
      { id: 'p3', name: 'Rex', breed: 'Golden Retriever', age: '5 anos', weight: '30kg', gender: 'male', image: 'https://picsum.photos/seed/rex/200/200' }
    ]
  },
  {
    id: '3',
    name: 'Mariana Jones',
    initials: 'MJ',
    phone: '(41) 91234-5678',
    email: 'mari.jones@email.com',
    pets: [
      { id: 'p4', name: 'Luna', breed: 'Siamesa', age: '3 anos', weight: '4kg', gender: 'female', image: 'https://picsum.photos/seed/luna/200/200' }
    ]
  },
  {
    id: '4',
    name: 'Roberto Bastos',
    initials: 'RB',
    phone: '(11) 90000-0000',
    email: 'roberto@email.com',
    pets: []
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    petName: 'Buddy',
    clientName: 'Roberto Almeida',
    service: 'Banho & Tosa',
    date: '12 Out, 2023',
    time: '14:00 - 15:30',
    professional: 'João Paulo',
    professionalInitials: 'JP',
    status: AppointmentStatus.CONFIRMED,
    petImage: 'https://picsum.photos/seed/buddy/100/100'
  },
  {
    id: 'a2',
    petName: 'Mia',
    clientName: 'Carla Dias',
    service: 'Vacinação',
    date: '12 Out, 2023',
    time: '16:00 - 16:30',
    professional: 'Dr. Renata',
    professionalInitials: 'DR',
    status: AppointmentStatus.PENDING,
    petImage: 'https://picsum.photos/seed/mia/100/100'
  },
  {
    id: 'a3',
    petName: 'Thor',
    clientName: 'Marcos Silva',
    service: 'Consulta Geral',
    date: '13 Out, 2023',
    time: '09:00 - 09:45',
    professional: 'Dr. Renata',
    professionalInitials: 'DR',
    status: AppointmentStatus.CANCELLED
  },
  {
    id: 'a4',
    petName: 'Balu',
    clientName: 'Fernanda Costa',
    service: 'Banho',
    date: '13 Out, 2023',
    time: '10:00 - 11:00',
    professional: 'João Paulo',
    professionalInitials: 'JP',
    status: AppointmentStatus.CONFIRMED,
    petImage: 'https://picsum.photos/seed/balu/100/100'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'pr1',
    name: 'Ração Premium Golden Formula Frango e Arroz 15kg',
    category: 'Rações',
    price: 149.90,
    oldPrice: 176.90,
    discount: '-15%',
    rating: 4.5,
    reviews: 128,
    image: 'https://picsum.photos/seed/dogfood/400/400'
  },
  {
    id: 'pr2',
    name: 'Mordedor Resistente Kong Classic Vermelho - Médio',
    category: 'Brinquedos',
    price: 69.90,
    rating: 5,
    reviews: 54,
    image: 'https://picsum.photos/seed/toy/400/400'
  },
  {
    id: 'pr3',
    name: 'Shampoo Pet Clean 5 em 1 para Cães e Gatos 700ml',
    category: 'Higiene',
    price: 22.50,
    rating: 3,
    reviews: 12,
    status: 'NOVO',
    image: 'https://picsum.photos/seed/shampoo/400/400'
  }
];

export const MOCK_SERVICES: Service[] = [
  {
    id: 's1',
    name: 'Banho & Tosa',
    category: 'Higiene',
    description: 'Inclui lavagem com shampoo premium, condicionador, corte de unhas e limpeza de ouvidos.',
    duration: '60 min',
    price: 85.00,
    image: 'https://picsum.photos/seed/grooming/200/200'
  },
  {
    id: 's2',
    name: 'Limpeza Dental',
    category: 'Saúde',
    description: 'Remoção de tártaro e polimento dental para a saúde bucal do seu pet.',
    duration: '45 min',
    price: 120.00,
    image: 'https://picsum.photos/seed/dentist/200/200'
  }
];
