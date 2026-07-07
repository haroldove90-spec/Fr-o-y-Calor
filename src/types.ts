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
  technicianNotes?: string;
  createdAt: string;
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
