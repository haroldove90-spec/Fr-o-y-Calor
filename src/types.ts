/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AirConditioner {
  id: string;
  brand: string;
  model: string;
  nickname: string;
  type: 'split' | 'window' | 'cassette' | 'floor' | 'portable';
  btu: number;
  installationDate: string;
  lastServiceDate: string;
  status: 'normal' | 'maintenance_needed' | 'faulty';
}

export type ServiceType = 'installation' | 'maintenance' | 'repair';

export type AppointmentStatus = 'pending' | 'assigned' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  acId: string | 'new'; // 'new' indicates booking for a new unit to install
  acNickname: string;
  serviceType: ServiceType;
  date: string;
  timeSlot: string;
  details: string;
  status: AppointmentStatus;
  technicianId?: string;
  technicianName?: string;
  technicianNotes?: string;
  createdAt: string;
  
  // Campo de técnico
  serviceState?: 'En Camino' | 'En Proceso' | 'Terminado';
  beforePhoto?: string;
  afterPhoto?: string;
  materialsUsed?: { itemId: string; name: string; qty: number }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface BTUMeasurements {
  width: number;
  length: number;
  height: number;
  sunExposure: 'low' | 'medium' | 'high'; // low: shadow/morning, medium: normal, high: sunny all day
  occupants: number;
  electricalDevices: number;
  climateZone: 'warm' | 'temperate' | 'tropical';
}

// 🔴 Rol 1: Administrador Types
export interface Employee {
  id: string;
  name: string;
  role: 'admin' | 'coordinator' | 'technician';
  permissions: string[];
  completedServices: number;
  status: 'active' | 'inactive';
}

export interface CatalogPrice {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  code: string;
  stock: number;
  unit: string;
  price: number;
}

// 🟡 Rol 2: Coordinador / Recepción Types
export interface Client {
  id: string;
  name: string;
  phone: string;
  address: string;
  source: string; // "Llegó por Facebook", etc
  registeredAt: string;
}

export interface Quote {
  id: string;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  servicesSelected: { name: string; price: number }[];
  total: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface CajaChicaLog {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  concept: string;
  date: string;
  status: 'pending_validation' | 'validated';
}

// 🟢 Rol 3: Técnico Types
export interface RouteExpense {
  id: string;
  technicianId: string;
  technicianName: string;
  amount: number;
  category: 'Combustible' | 'Peaje' | 'Refacción Emergencia' | 'Otro';
  description: string;
  date: string;
  receiptPhoto?: string;
}

export interface AuditLog {
  id: string;
  user: string;
  role: string;
  action: string;
  timestamp: string;
}
