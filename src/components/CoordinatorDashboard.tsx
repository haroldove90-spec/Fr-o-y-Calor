/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Client,
  Appointment,
  Quote,
  CatalogPrice,
  Employee,
  CajaChicaLog,
  AppointmentStatus
} from '../types';
import {
  UserPlus,
  Calendar,
  UserCheck,
  FileText,
  DollarSign,
  Plus,
  Send,
  Sparkles,
  ClipboardList,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';

interface CoordinatorDashboardProps {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  quotes: Quote[];
  setQuotes: React.Dispatch<React.SetStateAction<Quote[]>>;
  catalog: CatalogPrice[];
  employees: Employee[];
  cajaLogs: CajaChicaLog[];
  setCajaLogs: React.Dispatch<React.SetStateAction<CajaChicaLog[]>>;
  addAuditLog: (action: string) => void;
  onAddAppointment: (appt: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => void;
}

export default function CoordinatorDashboard({
  clients,
  setClients,
  appointments,
  setAppointments,
  quotes,
  setQuotes,
  catalog,
  employees,
  cajaLogs,
  setCajaLogs,
  addAuditLog,
  onAddAppointment,
}: CoordinatorDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'clients' | 'agenda' | 'quotes' | 'caja_chica'>('clients');

  // 1. Client States
  const [showAddClient, setShowAddClient] = useState(false);
  const [cliName, setCliName] = useState('');
  const [cliPhone, setCliPhone] = useState('');
  const [cliAddress, setCliAddress] = useState('');
  const [cliSource, setCliSource] = useState('Llegó por Facebook');

  // 2. Schedule Request States
  const [showAddAppt, setShowAddAppt] = useState(false);
  const [apptClientName, setApptClientName] = useState('');
  const [apptPhone, setApptPhone] = useState('');
  const [apptAddress, setApptAddress] = useState('');
  const [apptServiceType, setApptServiceType] = useState<'installation' | 'maintenance' | 'repair'>('maintenance');
  const [apptDate, setApptDate] = useState('2026-07-08');
  const [apptSlot, setApptSlot] = useState('Mañana (8:00 AM - 12:00 PM)');
  const [apptDetails, setApptDetails] = useState('');
  const [apptTechId, setApptTechId] = useState('');

  // 3. Quote Generation States
  const [showAddQuote, setShowAddQuote] = useState(false);
  const [quoteClientName, setQuoteClientName] = useState('');
  const [quoteClientPhone, setQuoteClientPhone] = useState('');
  const [quoteClientAddress, setQuoteClientAddress] = useState('');
  const [selectedServices, setSelectedServices] = useState<{ name: string; price: number }[]>([]);

  // 4. Caja Chica States
  const [showAddCajaLog, setShowAddCajaLog] = useState(false);
  const [cajaType, setCajaType] = useState<'income' | 'expense'>('income');
  const [cajaAmount, setCajaAmount] = useState<number>(0);
  const [cajaConcept, setCajaConcept] = useState('');

  // Active Quote Preview modal
  const [previewingQuote, setPreviewingQuote] = useState<Quote | null>(null);

  // Handlers for Clients
  const handleAddClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliName.trim() || !cliPhone.trim()) return;
    const newClient: Client = {
      id: `cli-${Date.now()}`,
      name: cliName,
      phone: cliPhone,
      address: cliAddress,
      source: cliSource,
      registeredAt: new Date().toISOString().split('T')[0],
    };
    setClients((prev) => [newClient, ...prev]);
    addAuditLog(`Registró cliente: ${cliName} (${cliSource})`);
    
    // Auto-populate schedule form name if we want
    setCliName('');
    setCliPhone('');
    setCliAddress('');
    setShowAddClient(false);
  };

  // Handlers for Agenda
  const handleAddApptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apptClientName.trim() || !apptPhone.trim()) return;

    const selectedTech = employees.find(e => e.id === apptTechId);

    const newAppt: Appointment = {
      id: `APP-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: apptClientName,
      clientPhone: apptPhone,
      clientAddress: apptAddress,
      acId: 'new',
      acNickname: 'Unidad Climatización',
      serviceType: apptServiceType,
      date: apptDate,
      timeSlot: apptSlot,
      details: apptDetails || 'Servicio solicitado por coordinación',
      status: apptTechId ? 'assigned' : 'pending',
      technicianId: apptTechId || undefined,
      technicianName: selectedTech ? selectedTech.name : undefined,
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => [newAppt, ...prev]);
    addAuditLog(`Agendó servicio ${newAppt.id} para ${apptClientName}${selectedTech ? ` (Asignado a ${selectedTech.name})` : ''}`);

    setApptClientName('');
    setApptPhone('');
    setApptAddress('');
    setApptDetails('');
    setApptTechId('');
    setShowAddAppt(false);
  };

  const handleAssignTechnician = (apptId: string, techId: string) => {
    const selectedTech = employees.find(e => e.id === techId);
    if (!selectedTech) return;

    setAppointments(prev => prev.map(appt => {
      if (appt.id === apptId) {
        return {
          ...appt,
          status: 'assigned',
          technicianId: techId,
          technicianName: selectedTech.name
        };
      }
      return appt;
    }));

    addAuditLog(`Asignó orden ${apptId} al Técnico ${selectedTech.name}`);
  };

  // Handlers for Quotes
  const handleToggleServiceForQuote = (serviceName: string, servicePrice: number) => {
    const exists = selectedServices.some(s => s.name === serviceName);
    if (exists) {
      setSelectedServices(prev => prev.filter(s => s.name !== serviceName));
    } else {
      setSelectedServices(prev => [...prev, { name: serviceName, price: servicePrice }]);
    }
  };

  const handleCreateQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteClientName.trim() || selectedServices.length === 0) return;

    const total = selectedServices.reduce((sum, s) => sum + s.price, 0);
    const newQuote: Quote = {
      id: `COT-${Math.floor(10000 + Math.random() * 90000)}`,
      clientName: quoteClientName,
      clientPhone: quoteClientPhone,
      clientAddress: quoteClientAddress,
      servicesSelected: selectedServices,
      total,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setQuotes(prev => [newQuote, ...prev]);
    addAuditLog(`Generó cotización ${newQuote.id} para ${quoteClientName} por $${total} MXN`);

    setQuoteClientName('');
    setQuoteClientPhone('');
    setQuoteClientAddress('');
    setSelectedServices([]);
    setShowAddQuote(false);
  };

  const handleUpdateQuoteStatus = (id: string, status: 'accepted' | 'rejected') => {
    setQuotes(prev => prev.map(q => {
      if (q.id === id) {
        if (status === 'accepted') {
          // If quote accepted, automatically register a validated income log in Caja Chica!
          const newCaja: CajaChicaLog = {
            id: `CJ-${Date.now()}`,
            type: 'income',
            amount: q.total,
            concept: `Liquidación por aceptación de cotización ${q.id} - ${q.clientName}`,
            date: new Date().toISOString().split('T')[0],
            status: 'validated'
          };
          setCajaLogs(c => [newCaja, ...c]);
          addAuditLog(`Aceptó cotización ${id}. Ingreso por $${q.total} registrado en caja.`);
        } else {
          addAuditLog(`Rechazó cotización ${id}`);
        }
        return { ...q, status };
      }
      return q;
    }));
  };

  // Caja Chica Handlers
  const handleAddCajaLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cajaAmount <= 0 || !cajaConcept.trim()) return;

    const newLog: CajaChicaLog = {
      id: `CJ-${Date.now()}`,
      type: cajaType,
      amount: cajaAmount,
      concept: cajaConcept,
      date: new Date().toISOString().split('T')[0],
      status: 'validated'
    };

    setCajaLogs(prev => [newLog, ...prev]);
    addAuditLog(`Registró movimiento en caja: ${cajaConcept} ($${cajaAmount} MXN)`);

    setCajaAmount(0);
    setCajaConcept('');
    setShowAddCajaLog(false);
  };

  const handleValidateLog = (id: string) => {
    setCajaLogs(prev => prev.map(log => {
      if (log.id === id) {
        addAuditLog(`Validó y concilió depósito de técnico en caja chica por $${log.amount} MXN`);
        return { ...log, status: 'validated' };
      }
      return log;
    }));
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      
      {/* Sub tabs bar */}
      <div className="bg-white border-b border-slate-200 px-6 flex overflow-x-auto gap-4 scrollbar-thin shrink-0 select-none">
        <button
          onClick={() => setActiveSubTab('clients')}
          className={`py-4 px-1 border-b-2 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer ${
            activeSubTab === 'clients'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Registro de Clientes
        </button>
        <button
          onClick={() => setActiveSubTab('agenda')}
          className={`py-4 px-1 border-b-2 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer ${
            activeSubTab === 'agenda'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Agenda y Órdenes
        </button>
        <button
          onClick={() => setActiveSubTab('quotes')}
          className={`py-4 px-1 border-b-2 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer ${
            activeSubTab === 'quotes'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Cotizaciones
        </button>
        <button
          onClick={() => setActiveSubTab('caja_chica')}
          className={`py-4 px-1 border-b-2 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer ${
            activeSubTab === 'caja_chica'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Control de Caja Chica
        </button>
      </div>

      {/* Viewport content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">

        {/* 1. CLIENTS DIRECTORY */}
        {activeSubTab === 'clients' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Directorio de Clientes ({clients.length})</h3>
                <span className="text-xs text-slate-400 block mt-0.5">Fichas técnicas de contacto y procedencia de prospectos</span>
              </div>
              <button
                onClick={() => setShowAddClient(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <UserPlus className="w-4 h-4" /> Registrar Cliente
              </button>
            </div>

            {/* Quick add client form */}
            {showAddClient && (
              <form
                onSubmit={handleAddClientSubmit}
                className="bg-slate-100 border border-slate-200/80 rounded-2xl p-4 space-y-4"
              >
                <div className="text-xs font-bold text-slate-700">Crear Ficha Técnica de Cliente</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nombre</label>
                    <input
                      type="text"
                      placeholder="Ej. Roberto Sánchez"
                      value={cliName}
                      onChange={(e) => setCliName(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Teléfono / WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="Ej. +52 55 1234 5678"
                      value={cliPhone}
                      onChange={(e) => setCliPhone(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dirección de Servicio</label>
                    <input
                      type="text"
                      placeholder="Calle, número y colonia"
                      value={cliAddress}
                      onChange={(e) => setCliAddress(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Canal de Procedencia</label>
                    <select
                      value={cliSource}
                      onChange={(e) => setCliSource(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="Llegó por Facebook">🔵 Facebook Ads / Orgánico</option>
                      <option value="Llamada Directa">📞 Llamada Telefónica</option>
                      <option value="WhatsApp">🟢 Mensaje de WhatsApp</option>
                      <option value="Recomendación">⭐ Recomendado / Boca a boca</option>
                      <option value="Google Maps">📍 Google Maps / Buscador</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 text-xs font-bold pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddClient(false)}
                    className="px-3 py-2 bg-slate-200 text-slate-600 rounded-xl hover:bg-slate-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                  >
                    Guardar Ficha
                  </button>
                </div>
              </form>
            )}

            {/* Client cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clients.map((cli) => (
                <div key={cli.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">{cli.name}</h4>
                        <span className="text-[9px] text-slate-400 font-bold block mt-0.5">{cli.id}</span>
                      </div>
                      <span className="bg-slate-100 text-slate-600 font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wide border border-slate-200">
                        {cli.source}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{cli.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="line-clamp-2 leading-relaxed">{cli.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-medium">Registrado: {cli.registeredAt}</span>
                    <button
                      onClick={() => {
                        setQuoteClientName(cli.name);
                        setQuoteClientPhone(cli.phone);
                        setQuoteClientAddress(cli.address);
                        setActiveSubTab('quotes');
                        setShowAddQuote(true);
                      }}
                      className="text-blue-600 hover:text-blue-700 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      Cotizar <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. SCHEDULING AGENDA & ASSIGNATION */}
        {activeSubTab === 'agenda' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Agenda General de Servicios</h3>
                <span className="text-xs text-slate-400 block mt-0.5">Coordinación de solicitudes y vinculación de técnicos de ruta</span>
              </div>
              <button
                onClick={() => setShowAddAppt(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Agendar Visita
              </button>
            </div>

            {/* Quick Agenda Booking Form */}
            {showAddAppt && (
              <form
                onSubmit={handleAddApptSubmit}
                className="bg-slate-100 border border-slate-200/80 rounded-2xl p-4 space-y-4"
              >
                <div className="text-xs font-bold text-slate-700">Programar Solicitud de Servicio Técnico</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cliente</label>
                    <input
                      type="text"
                      placeholder="Ej. Sandra Méndez"
                      value={apptClientName}
                      onChange={(e) => setApptClientName(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Teléfono</label>
                    <input
                      type="tel"
                      placeholder="Ej. +52 55 ..."
                      value={apptPhone}
                      onChange={(e) => setApptPhone(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dirección</label>
                    <input
                      type="text"
                      placeholder="Ej. Calle Paseo de la Reforma #240"
                      value={apptAddress}
                      onChange={(e) => setApptAddress(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tipo de Trabajo</label>
                    <select
                      value={apptServiceType}
                      onChange={(e) => setApptServiceType(e.target.value as any)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="maintenance">🧼 Mantenimiento Preventivo</option>
                      <option value="repair">🔧 Reparación / Falla</option>
                      <option value="installation">❄️ Instalación de MiniSplit</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fecha</label>
                    <input
                      type="date"
                      value={apptDate}
                      onChange={(e) => setApptDate(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Horario de Visita</label>
                    <select
                      value={apptSlot}
                      onChange={(e) => setApptSlot(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="Mañana (8:00 AM - 12:00 PM)">Mañana (8:00 AM - 12:00 PM)</option>
                      <option value="Tarde (12:00 PM - 4:00 PM)">Tarde (12:00 PM - 4:00 PM)</option>
                      <option value="Vespertino (4:00 PM - 7:00 PM)">Vespertino (4:00 PM - 7:00 PM)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Detalles adicionales</label>
                    <input
                      type="text"
                      placeholder="Ej. El compresor arranca pero se apaga a los 5 minutos..."
                      value={apptDetails}
                      onChange={(e) => setApptDetails(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Asignar Técnico Disponible</label>
                    <select
                      value={apptTechId}
                      onChange={(e) => setApptTechId(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 animate-pulse-once"
                    >
                      <option value="">-- Sin asignar (Bandeja Pendiente) --</option>
                      {employees
                        .filter(e => e.role === 'technician' && e.status === 'active')
                        .map(tech => (
                          <option key={tech.id} value={tech.id}>
                            👤 {tech.name} (Activo)
                          </option>
                        ))
                      }
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 text-xs font-bold pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddAppt(false)}
                    className="px-3 py-2 bg-slate-200 text-slate-600 rounded-xl hover:bg-slate-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                  >
                    Agendar Orden de Trabajo
                  </button>
                </div>
              </form>
            )}

            {/* List of Visits and Assignment controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Column: Assigned Services */}
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  Servicios Programados / Asignados
                </div>

                <div className="space-y-3">
                  {appointments.filter(a => a.status !== 'pending').length === 0 ? (
                    <div className="bg-white border border-slate-200 p-6 rounded-2xl text-center text-slate-400 text-xs">
                      No hay citas asignadas programadas.
                    </div>
                  ) : (
                    appointments
                      .filter(a => a.status !== 'pending')
                      .map((appt) => (
                        <div key={appt.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <span className="text-[9px] font-mono text-slate-400 block">{appt.id}</span>
                              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">{appt.clientName}</h4>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wide border ${
                              appt.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                                : 'bg-blue-50 text-blue-700 border-blue-200/50 animate-pulse'
                            }`}>
                              {appt.status === 'completed' ? 'COMPLETADO' : 'ASIGNADO'}
                            </span>
                          </div>

                          <div className="space-y-1 text-[11px] text-slate-600">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>{appt.date} • {appt.timeSlot}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="line-clamp-1">{appt.clientAddress}</span>
                            </div>
                            <div className="flex items-center gap-1.5 font-semibold text-blue-600">
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Técnico: {appt.technicianName}</span>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Right Column: Unassigned / Pending Assignment */}
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Bandeja de Pendientes de Asignación
                </div>

                <div className="space-y-3">
                  {appointments.filter(a => a.status === 'pending').length === 0 ? (
                    <div className="bg-white border border-dashed border-slate-200 p-6 rounded-2xl text-center text-slate-400 text-xs">
                      ¡Excelente! No hay servicios pendientes por asignar.
                    </div>
                  ) : (
                    appointments
                      .filter(a => a.status === 'pending')
                      .map((appt) => (
                        <div key={appt.id} className="bg-amber-50/40 p-4 rounded-2xl border border-amber-200/60 shadow-2xs space-y-3">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <span className="text-[9px] font-mono text-slate-400 block">{appt.id}</span>
                              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">{appt.clientName}</h4>
                            </div>
                            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wide border border-amber-200">
                              PENDIENTE
                            </span>
                          </div>

                          <div className="space-y-1 text-[11px] text-slate-600">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>{appt.date} • {appt.timeSlot}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{appt.clientAddress}</span>
                            </div>
                          </div>

                          {/* Fast Assign Tech Selector */}
                          <div className="pt-2 border-t border-amber-200/40 flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-500 shrink-0 uppercase tracking-wide">Vincular Ruta:</span>
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleAssignTechnician(appt.id, e.target.value);
                                  e.target.value = ''; // Reset
                                }
                              }}
                              className="flex-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold px-2 py-1 focus:outline-none"
                            >
                              <option value="">-- Seleccionar Técnico --</option>
                              {employees
                                .filter(e => e.role === 'technician' && e.status === 'active')
                                .map(tech => (
                                  <option key={tech.id} value={tech.id}>
                                    👤 {tech.name}
                                  </option>
                                ))
                              }
                            </select>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 3. COTIZACIONES Y PRESUPUESTOS */}
        {activeSubTab === 'quotes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Generador de Cotizaciones</h3>
                <span className="text-xs text-slate-400 block mt-0.5">Creación rápida de presupuestos basados en la lista oficial de precios fijos</span>
              </div>
              <button
                onClick={() => setShowAddQuote(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4" /> Nueva Cotización
              </button>
            </div>

            {/* Create Quote Form */}
            {showAddQuote && (
              <form
                onSubmit={handleCreateQuoteSubmit}
                className="bg-slate-100 border border-slate-200/80 rounded-2xl p-4 space-y-4"
              >
                <div className="text-xs font-bold text-slate-700">Cotización Express para Cliente</div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cliente Destinatario</label>
                    <input
                      type="text"
                      placeholder="Ej. Sandra Méndez"
                      value={quoteClientName}
                      onChange={(e) => setQuoteClientName(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Teléfono / WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="+52 55 ..."
                      value={quoteClientPhone}
                      onChange={(e) => setQuoteClientPhone(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dirección de Envío</label>
                    <input
                      type="text"
                      placeholder="Calle, Colonia y C.P."
                      value={quoteClientAddress}
                      onChange={(e) => setQuoteClientAddress(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Fixed prices selection check-boxes */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Seleccionar Servicios del Catálogo</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {catalog.map((service) => {
                      const isChecked = selectedServices.some(s => s.name === service.name);
                      return (
                        <div
                          key={service.id}
                          onClick={() => handleToggleServiceForQuote(service.name, service.price)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                            isChecked
                              ? 'bg-blue-50/50 border-blue-500 text-blue-700'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-bold leading-tight">{service.name}</div>
                            <span className="text-[9px] text-slate-400 block mt-0.5">{service.description}</span>
                          </div>
                          <span className="text-xs font-extrabold shrink-0 ml-2">${service.price.toLocaleString()} MXN</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Subtotal & Action buttons */}
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <div className="text-xs font-bold text-slate-600">
                    Total Presupuesto:{' '}
                    <span className="text-sm font-extrabold text-blue-600">
                      ${selectedServices.reduce((sum, s) => sum + s.price, 0).toLocaleString()} MXN
                    </span>
                  </div>
                  <div className="flex gap-2 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setShowAddQuote(false)}
                      className="px-3 py-2 bg-slate-200 text-slate-600 rounded-xl hover:bg-slate-300"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={selectedServices.length === 0}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
                    >
                      Generar Presupuesto
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* List of Quotes & Status tracking */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[9px] tracking-wider select-none">
                      <th className="p-4">Folio</th>
                      <th className="p-4">Cliente</th>
                      <th className="p-4">Servicios</th>
                      <th className="p-4">Monto Total</th>
                      <th className="p-4">Estatus</th>
                      <th className="p-4 text-right">Compartir / Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {quotes.map((q) => (
                      <tr key={q.id} className="hover:bg-slate-50/55 transition-colors">
                        <td className="p-4 font-mono font-bold text-blue-600">{q.id}</td>
                        <td className="p-4">
                          <div className="font-bold text-slate-800">{q.clientName}</div>
                          <span className="text-[10px] text-slate-400 font-semibold">{q.clientPhone}</span>
                        </td>
                        <td className="p-4 max-w-xs">
                          <div className="truncate text-slate-600">
                            {q.servicesSelected.map(s => s.name).join(', ')}
                          </div>
                        </td>
                        <td className="p-4 font-extrabold text-slate-800">
                          ${q.total.toLocaleString()} MXN
                        </td>
                        <td className="p-4">
                          {q.status === 'pending' ? (
                            <span className="bg-amber-50 text-amber-600 font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-amber-200/50">
                              Pendiente
                            </span>
                          ) : q.status === 'accepted' ? (
                            <span className="bg-emerald-50 text-emerald-700 font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-200/50">
                              Aceptada
                            </span>
                          ) : (
                            <span className="bg-rose-50 text-rose-600 font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-rose-200/50">
                              Rechazada
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right flex items-center justify-end gap-1.5 flex-wrap">
                          
                          {/* Export buttons */}
                          <button
                            onClick={() => {
                              const whatsappText = `Hola, ${q.clientName}. Te compartimos la cotización ${q.id} de Frío y Calor por un total de $${q.total.toLocaleString()} MXN. Detalle de servicios: ${q.servicesSelected.map(s => s.name).join(', ')}`;
                              const url = `https://api.whatsapp.com/send?phone=${q.clientPhone}&text=${encodeURIComponent(whatsappText)}`;
                              window.open(url, '_blank');
                              addAuditLog(`Compartió cotización ${q.id} por WhatsApp`);
                            }}
                            className="bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-[9px] px-2 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 uppercase tracking-wide"
                          >
                            <Send className="w-3 h-3" /> WhatsApp
                          </button>

                          <button
                            onClick={() => setPreviewingQuote(q)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[9px] px-2 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 uppercase tracking-wide border border-slate-200"
                          >
                            <FileText className="w-3 h-3 text-slate-400" /> PDF
                          </button>

                          {q.status === 'pending' && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleUpdateQuoteStatus(q.id, 'accepted')}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white p-1 rounded-lg transition-colors cursor-pointer"
                                title="Aceptar Cotización"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleUpdateQuoteStatus(q.id, 'rejected')}
                                className="bg-rose-500 hover:bg-rose-600 text-white p-1 rounded-lg transition-colors cursor-pointer"
                                title="Rechazar Cotización"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quote Receipt PDF Modal Simulation */}
            {previewingQuote && (
              <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl border border-slate-300 shadow-xl max-w-lg w-full overflow-hidden flex flex-col p-6 space-y-6">
                  
                  {/* Header receipt */}
                  <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                    <div>
                      <div className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                        <span className="w-6 h-6 bg-blue-600 flex items-center justify-center rounded-md text-white font-bold text-xs select-none">F</span>
                        Frío y Calor
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-1">SERVICIOS TÉCNICOS PROFESIONALES DE CLIMAS</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-blue-600 uppercase block">COTIZACIÓN {previewingQuote.id}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Fecha: {previewingQuote.createdAt}</span>
                    </div>
                  </div>

                  {/* Client info */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs space-y-1.5">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cliente Destinatario</div>
                    <div className="font-bold text-slate-800">{previewingQuote.clientName}</div>
                    {previewingQuote.clientPhone && <div className="text-slate-600">Teléfono: {previewingQuote.clientPhone}</div>}
                    {previewingQuote.clientAddress && <div className="text-slate-600">Dirección: {previewingQuote.clientAddress}</div>}
                  </div>

                  {/* Pricing grid */}
                  <div className="space-y-3">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Desglose de Conceptos</div>
                    <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                      <div className="grid grid-cols-3 bg-slate-50 p-2.5 font-bold text-slate-600 border-b border-slate-100 text-[10px] uppercase">
                        <span className="col-span-2">Concepto</span>
                        <span className="text-right">Monto</span>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {previewingQuote.servicesSelected.map((serv, idx) => (
                          <div key={idx} className="grid grid-cols-3 p-2.5 text-slate-700">
                            <span className="col-span-2 font-medium">{serv.name}</span>
                            <span className="text-right font-extrabold text-slate-900">${serv.price.toLocaleString()} MXN</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Total footer */}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-slate-400 font-semibold">Términos: Pago al finalizar servicio técnico.</span>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Importe Total Neto</span>
                      <span className="text-base font-black text-blue-600">${previewingQuote.total.toLocaleString()} MXN</span>
                    </div>
                  </div>

                  {/* Modal Action Footer */}
                  <div className="flex justify-end gap-2 text-xs font-bold pt-4 border-t border-slate-100">
                    <button
                      onClick={() => {
                        window.print();
                      }}
                      className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl"
                    >
                      Imprimir / Descargar
                    </button>
                    <button
                      onClick={() => setPreviewingQuote(null)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                    >
                      Cerrar Vista
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* 4. CAJA CHICA CONTROL */}
        {activeSubTab === 'caja_chica' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Control de Caja Chica</h3>
                <span className="text-xs text-slate-400 block mt-0.5">Validación de cobros de técnicos y egresos de viáticos en ruta</span>
              </div>
              <button
                onClick={() => setShowAddCajaLog(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Registrar Movimiento
              </button>
            </div>

            {/* Quick cash movement entry form */}
            {showAddCajaLog && (
              <form
                onSubmit={handleAddCajaLogSubmit}
                className="bg-slate-100 border border-slate-200/80 rounded-2xl p-4 space-y-4"
              >
                <div className="text-xs font-bold text-slate-700">Registrar Nuevo Ajuste de Caja</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tipo de Flujo</label>
                    <select
                      value={cajaType}
                      onChange={(e) => setCajaType(e.target.value as any)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="income">🟢 Ingreso / Liquidación</option>
                      <option value="expense">🔴 Egreso / Pago Proveedor</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monto ($ MXN)</label>
                    <input
                      type="number"
                      value={cajaAmount}
                      onChange={(e) => setCajaAmount(parseInt(e.target.value) || 0)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                      min="1"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Concepto detallado</label>
                    <input
                      type="text"
                      placeholder="Ej. Anticipo servicio Sr. Pérez"
                      value={cajaConcept}
                      onChange={(e) => setCajaConcept(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 text-xs font-bold pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddCajaLog(false)}
                    className="px-3 py-2 bg-slate-200 text-slate-600 rounded-xl hover:bg-slate-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                  >
                    Registrar Ajuste
                  </button>
                </div>
              </form>
            )}

            {/* Caja Chica History Logs Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[9px] tracking-wider select-none">
                      <th className="p-4">Fecha</th>
                      <th className="p-4">Tipo</th>
                      <th className="p-4">Monto</th>
                      <th className="p-4">Concepto</th>
                      <th className="p-4">Estatus</th>
                      <th className="p-4 text-right">Conciliación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {cajaLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/55 transition-colors">
                        <td className="p-4 font-mono text-[11px] text-slate-400">{log.date}</td>
                        <td className="p-4">
                          {log.type === 'income' ? (
                            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-200/50">
                              Ingreso
                            </span>
                          ) : (
                            <span className="bg-rose-50 text-rose-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-rose-200/50">
                              Egreso
                            </span>
                          )}
                        </td>
                        <td className={`p-4 font-extrabold text-xs ${log.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {log.type === 'income' ? '+' : '-'}${log.amount.toLocaleString()} MXN
                        </td>
                        <td className="p-4 text-slate-700 font-medium max-w-sm truncate">
                          {log.concept}
                        </td>
                        <td className="p-4">
                          {log.status === 'validated' ? (
                            <span className="bg-emerald-50 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                              CONCILIADO
                            </span>
                          ) : (
                            <span className="bg-amber-50 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded-full border border-amber-200 animate-pulse">
                              PENDIENTE
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          {log.status === 'pending_validation' ? (
                            <button
                              onClick={() => handleValidateLog(log.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[9px] px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer uppercase tracking-wider"
                            >
                              Validar Cobro
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium font-sans flex items-center justify-end gap-1">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                              Verificado
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
