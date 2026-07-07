/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Appointment, AirConditioner, ServiceType, AppointmentStatus } from '../types';
import { Calendar, Clock, MapPin, User, Phone, CheckCircle2, AlertCircle, Sparkles, Clipboard, Wrench, X, RefreshCw } from 'lucide-react';

export interface PrefillData {
  capacityBTU?: number;
  recommendedText?: string;
  acId?: string;
  serviceType?: ServiceType;
}

interface AppointmentsTabProps {
  appointments: Appointment[];
  acList: AirConditioner[];
  activeRole: 'client' | 'technician';
  onAddAppointment: (appt: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => void;
  onUpdateAppointmentStatus: (id: string, status: AppointmentStatus, techNotes?: string) => void;
  quickBookData: PrefillData | null;
  onClearQuickBook: () => void;
}

export default function AppointmentsTab({
  appointments,
  acList,
  activeRole,
  onAddAppointment,
  onUpdateAppointmentStatus,
  quickBookData,
  onClearQuickBook,
}: AppointmentsTabProps) {
  const [showBookForm, setShowBookForm] = useState(quickBookData !== null);
  
  // Helper to determine initial prefill details
  const getInitialDetails = () => {
    if (!quickBookData) return 'Requiere mantenimiento general porque el aire empezó a soplar con menos fuerza.';
    if (quickBookData.capacityBTU) {
      return `Instalación de equipo recomendado por la calculadora: ${quickBookData.recommendedText}. Capacidad deseada de ${quickBookData.capacityBTU.toLocaleString()} BTU.`;
    }
    if (quickBookData.serviceType === 'repair') {
      return 'Se reporta una falla de funcionamiento en el equipo seleccionado. Requiere revisión técnica presencial de urgencia.';
    }
    return 'Mantenimiento preventivo general periódico. Requiere lavado químico de serpentín evaporador, condensador, limpieza de filtros y revisión de presión de gas.';
  };

  // Service Booking Form State
  const [formData, setFormData] = useState({
    clientName: 'Juan Pérez',
    clientPhone: '+56 9 8765 4321',
    clientAddress: 'Av. Libertador #1040, Depto 42B',
    acId: quickBookData?.acId || 'new',
    serviceType: (quickBookData?.serviceType || 'maintenance') as ServiceType,
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow's date
    timeSlot: 'Mañana (8:00 AM - 12:00 PM)',
    details: getInitialDetails(),
  });

  // Technician Update notes state
  const [editingApptId, setEditingApptId] = useState<string | null>(null);
  const [techReportNotes, setTechReportNotes] = useState('');

  // Handle book submit
  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.clientPhone || !formData.clientAddress) {
      alert("Por favor completa los campos obligatorios de contacto.");
      return;
    }
    
    // Find AC Nickname
    let acNickname = 'Nueva Unidad a Instalar';
    if (formData.acId !== 'new') {
      const selectedAC = acList.find(ac => ac.id === formData.acId);
      if (selectedAC) {
        acNickname = selectedAC.nickname;
      }
    }

    onAddAppointment({
      clientName: formData.clientName,
      clientPhone: formData.clientPhone,
      clientAddress: formData.clientAddress,
      acId: formData.acId,
      acNickname,
      serviceType: formData.serviceType,
      date: formData.date,
      timeSlot: formData.timeSlot,
      details: formData.details,
    });

    // Reset Form
    onClearQuickBook();
    setShowBookForm(false);
  };

  const getServiceLabel = (type: ServiceType) => {
    switch (type) {
      case 'installation': return 'Nueva Instalación 🔧';
      case 'maintenance': return 'Mantenimiento / Limpieza 🧼';
      case 'repair': return 'Reparación Técnica ⚙️';
    }
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="text-[10px] tracking-wider bg-[#fef3c7] text-[#92400e] border border-amber-200/50 rounded-full px-2.5 py-1.5 font-bold flex items-center gap-1.5 shadow-2xs shrink-0 select-none">
            <Clock className="w-3 h-3 text-[#92400e]" />
            PENDIENTE
          </span>
        );
      case 'assigned':
        return (
          <span className="text-[10px] tracking-wider bg-[#dbeafe] text-[#1e40af] border border-blue-200/50 rounded-full px-2.5 py-1.5 font-bold flex items-center gap-1.5 shadow-2xs shrink-0 select-none">
            <User className="w-3 h-3 text-[#1e40af]" />
            EN RUTA
          </span>
        );
      case 'completed':
        return (
          <span className="text-[10px] tracking-wider bg-[#dcfce7] text-[#166534] border border-emerald-200/50 rounded-full px-2.5 py-1.5 font-bold flex items-center gap-1.5 shadow-2xs shrink-0 select-none">
            <CheckCircle2 className="w-3 h-3 text-[#166534]" />
            COMPLETADO
          </span>
        );
      case 'cancelled':
        return (
          <span className="text-[10px] tracking-wider bg-slate-100 text-slate-500 border border-slate-200 rounded-full px-2.5 py-1.5 font-bold flex items-center gap-1.5 shadow-2xs shrink-0 select-none">
            <X className="w-3 h-3 text-slate-500" />
            CANCELADO
          </span>
        );
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">
      
      {/* Tab Header title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-slate-800">
            {activeRole === 'client' ? 'Servicios de Climatización' : 'Hoja de Ruta del Técnico'}
          </h2>
          <p className="text-xs text-slate-400">
            {activeRole === 'client' ? 'Agenda mantenimiento e instalaciones' : 'Servicios asignados para hoy'}
          </p>
        </div>
        
        {activeRole === 'client' && !showBookForm && (
          <button
            onClick={() => setShowBookForm(true)}
            className="flex items-center gap-1 text-xs font-bold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-3.5 py-2 rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            Reservar Visita
          </button>
        )}
      </div>

      {/* Quick Booking override trigger */}
      {quickBookData && quickBookData.capacityBTU && !showBookForm && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
              <Sparkles className="w-4 h-4 fill-amber-300 animate-spin" />
              <span>Instalación Recomendada Lista</span>
            </div>
            <button onClick={onClearQuickBook} className="text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[10px] text-amber-700 leading-normal">
            Calculaste un requerimiento de **{quickBookData.capacityBTU.toLocaleString()} BTUs**. Haz clic abajo para rellenar automáticamente la reserva técnica.
          </p>
          <button
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                acId: 'new',
                serviceType: 'installation',
                details: `Instalación de equipo recomendado por la calculadora: ${quickBookData.recommendedText}. Capacidad deseada de ${quickBookData.capacityBTU?.toLocaleString()} BTU.`,
              }));
              setShowBookForm(true);
            }}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-1.5 px-3 rounded-xl text-[10px] text-center cursor-pointer transition-colors"
          >
            Rellenar Datos de Reserva
          </button>
        </div>
      )}

      {/* Booking Form (Client Only) */}
      {activeRole === 'client' && showBookForm && (
        <form onSubmit={handleBookSubmit} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5 text-blue-500" />
              Agendar Visita Técnica
            </h3>
            <button
              type="button"
              onClick={() => {
                setShowBookForm(false);
                onClearQuickBook();
              }}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
            >
              Cerrar
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {/* Contact Details */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col gap-2">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Tus Datos de Contacto</span>
              <div>
                <span className="text-[9px] text-slate-400 block mb-0.5">Nombre Completo</span>
                <div className="relative">
                  <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                    className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[9px] text-slate-400 block mb-0.5">Teléfono</span>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={formData.clientPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                      required
                    />
                  </div>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block mb-0.5">Dirección de Visita</span>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={formData.clientAddress}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientAddress: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Service & Equipment */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[9px] text-slate-400 font-bold block mb-0.5">Equipo de Aire</span>
                <select
                  value={formData.acId}
                  onChange={(e) => setFormData(prev => ({ ...prev, acId: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="new">+ Instalar Nuevo Aire</option>
                  {acList.map(ac => (
                    <option key={ac.id} value={ac.id}>{ac.nickname} ({ac.brand})</option>
                  ))}
                </select>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold block mb-0.5">Tipo de Servicio</span>
                <select
                  value={formData.serviceType}
                  onChange={(e: any) => setFormData(prev => ({ ...prev, serviceType: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="maintenance">Mantenimiento / Limpieza</option>
                  <option value="repair">Reparación Técnica (Falla)</option>
                  <option value="installation">Nueva Instalación</option>
                </select>
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[9px] text-slate-400 font-bold block mb-0.5">Fecha Preferida</span>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold block mb-0.5">Franja Horaria</span>
                <select
                  value={formData.timeSlot}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeSlot: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none"
                >
                  <option value="Mañana (8:00 AM - 12:00 PM)">Mañana (8:00 - 12:00)</option>
                  <option value="Tarde (12:00 PM - 4:00 PM)">Tarde (12:00 - 16:00)</option>
                  <option value="Tarde-Noche (4:00 PM - 7:00 PM)">Tarde-Noche (16:00 - 19:00)</option>
                </select>
              </div>
            </div>

            {/* Details Description */}
            <div>
              <span className="text-[9px] text-slate-400 font-bold block mb-0.5">Descripción de lo que ocurre</span>
              <textarea
                rows={2}
                value={formData.details}
                onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                placeholder="Describe qué falla tiene tu equipo o detalles adicionales para el técnico..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 resize-none font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-2.5 rounded-xl text-xs mt-1 transition-colors cursor-pointer"
          >
            Confirmar Reserva Técnica
          </button>
        </form>
      )}

      {/* List of Visits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {appointments.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-2xl py-8 px-4 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <Clipboard className="w-8 h-8 text-slate-300" />
            <span>No se encuentran visitas técnicas agendadas.</span>
            <span>Haz clic en "Reservar Visita" para solicitar tu primer servicio.</span>
          </div>
        ) : (
          appointments.map((appt) => {
            const isEditingThis = editingApptId === appt.id;
            return (
              <div
                key={appt.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col gap-3 relative"
              >
                {/* Header status bar */}
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Orden #{appt.id.substring(0, 5)}</span>
                    <h3 className="text-sm font-extrabold text-slate-800 leading-tight">
                      {getServiceLabel(appt.serviceType)}
                    </h3>
                  </div>
                  {getStatusBadge(appt.status)}
                </div>

                {/* Details layout */}
                <div className="flex flex-col gap-2 text-xs bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="font-medium">Fecha: <strong>{appt.date}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="font-medium">Horario: <strong>{appt.timeSlot}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="font-medium text-slate-700 truncate">Dirección: <strong>{appt.clientAddress}</strong></span>
                  </div>
                  
                  {/* Equipment target */}
                  <div className="border-t border-slate-200/60 pt-2 mt-1.5 flex flex-col gap-0.5">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Equipo Relacionado:</span>
                    <span className="font-bold text-slate-700">{appt.acNickname}</span>
                  </div>

                  {/* Failure notes */}
                  <div className="flex flex-col gap-0.5 mt-1">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Detalles de falla:</span>
                    <p className="text-slate-600 leading-normal text-[11px] font-medium italic">"{appt.details}"</p>
                  </div>
                  
                  {/* Contact info (Useful for Technicians) */}
                  <div className="border-t border-slate-200/60 pt-2 mt-1.5 flex flex-col gap-1">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Contacto de Cliente:</span>
                    <div className="flex justify-between font-semibold text-slate-700 text-[10px]">
                      <span>👤 {appt.clientName}</span>
                      <span>📞 {appt.clientPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Technician Technical Notes Field (if present) */}
                {appt.technicianNotes && (
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 text-xs flex flex-col gap-1">
                    <span className="text-[9px] text-emerald-800 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Clipboard className="w-3.5 h-3.5 text-emerald-600" />
                      Informe Técnico del Profesional:
                    </span>
                    <p className="text-slate-700 leading-normal text-[11px] font-medium font-mono whitespace-pre-line bg-white/60 p-2 rounded-lg border border-emerald-100/60">
                      {appt.technicianNotes}
                    </p>
                  </div>
                )}

                {/* Technician Actions Trigger (ONLY visible in Technician View!) */}
                {activeRole === 'technician' && appt.status !== 'completed' && appt.status !== 'cancelled' && (
                  <div className="border-t border-slate-100 pt-3 flex flex-col gap-2 mt-1">
                    {!isEditingThis ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingApptId(appt.id);
                            setTechReportNotes(appt.technicianNotes || '');
                          }}
                          className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-3 rounded-xl text-[10.5px] transition-colors cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Wrench className="w-3.5 h-3.5 text-amber-400" />
                          Registrar Reporte y Finalizar
                        </button>
                        <button
                          onClick={() => onUpdateAppointmentStatus(appt.id, 'cancelled')}
                          className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold py-2 rounded-xl text-[10.5px] transition-colors cursor-pointer"
                        >
                          Rechazar
                        </button>
                      </div>
                    ) : (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-2.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold text-slate-700 uppercase">Escribir Informe Técnico</span>
                          <button
                            type="button"
                            onClick={() => setEditingApptId(null)}
                            className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </div>
                        <textarea
                          rows={3}
                          value={techReportNotes}
                          onChange={(e) => setTechReportNotes(e.target.value)}
                          placeholder="Ej: Se lavó filtros de aire, se midió presión de carga (correcta a 120 PSI de R410A). Serpentín limpio, consumo eléctrico en rango óptimo de 4.8 Amperes..."
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-700 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!techReportNotes.trim()) {
                              alert("Por favor registra una descripción técnica de los trabajos realizados.");
                              return;
                            }
                            onUpdateAppointmentStatus(appt.id, 'completed', techReportNotes);
                            setEditingApptId(null);
                          }}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          Marcar Visita como Completada
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
