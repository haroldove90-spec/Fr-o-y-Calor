/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Appointment,
  InventoryItem,
  RouteExpense,
  CajaChicaLog,
  Employee
} from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  Navigation,
  CheckCircle,
  Play,
  TrendingUp,
  Camera,
  Layers,
  FileText,
  DollarSign,
  Plus,
  Compass,
  AlertCircle,
  Sparkles,
  RefreshCw,
  ShoppingBag,
  ChevronRight
} from 'lucide-react';

interface TechnicianRouteProps {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  routeExpenses: RouteExpense[];
  setRouteExpenses: React.Dispatch<React.SetStateAction<RouteExpense[]>>;
  setCajaLogs: React.Dispatch<React.SetStateAction<CajaChicaLog[]>>;
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  addAuditLog: (action: string) => void;
}

export default function TechnicianRoute({
  appointments,
  setAppointments,
  inventory,
  setInventory,
  routeExpenses,
  setRouteExpenses,
  setCajaLogs,
  employees,
  setEmployees,
  addAuditLog,
}: TechnicianRouteProps) {
  
  // Choose technician to simulate (default to Carlos Torres)
  const activeTechs = employees.filter(e => e.role === 'technician');
  const [activeTechId, setActiveTechId] = useState(activeTechs[0]?.id || 'emp-2');
  const currentTech = employees.find(e => e.id === activeTechId);

  // Active appointment detail view
  const [selectedApptId, setSelectedApptId] = useState<string | null>(null);

  // Materials Reporting States inside active job
  const [selectedMaterialId, setSelectedMaterialId] = useState('');
  const [materialQty, setMaterialQty] = useState(1);

  // Field Notes State
  const [fieldNotes, setFieldNotes] = useState('');

  // Expenses logging state
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState<number>(0);
  const [expenseCategory, setExpenseCategory] = useState<'Combustible' | 'Peaje' | 'Refacción Emergencia' | 'Otro'>('Combustible');
  const [expenseDesc, setExpenseDesc] = useState('');

  // Get appointments for this technician
  const techAppointments = appointments.filter(
    (appt) => appt.technicianId === activeTechId && appt.status !== 'cancelled'
  );

  const activeAppt = appointments.find((a) => a.id === selectedApptId);

  // Step state change triggers
  const handleUpdateServiceState = (apptId: string, state: 'En Camino' | 'En Proceso' | 'Terminado') => {
    setAppointments(prev => prev.map(appt => {
      if (appt.id === apptId) {
        let nextStatus = appt.status;
        if (state === 'Terminado') {
          nextStatus = 'completed';
          
          // Increment completed services metric for the active technician
          setEmployees(empList => empList.map(e => {
            if (e.id === activeTechId) {
              return { ...e, completedServices: e.completedServices + 1 };
            }
            return e;
          }));

          // Log automatic income liquidation into Caja Chica as a pending verification log!
          const servicePrice = appt.serviceType === 'repair' ? 1800 : appt.serviceType === 'installation' ? 2500 : 1200;
          const newCajaLog: CajaChicaLog = {
            id: `CJ-${Date.now()}`,
            type: 'income',
            amount: servicePrice,
            concept: `Cobro en campo por orden ${appt.id} (${appt.clientName}) - Realizado por ${currentTech?.name}`,
            date: new Date().toISOString().split('T')[0],
            status: 'pending_validation' // Coordinator will validate this!
          };
          setCajaLogs(c => [newCajaLog, ...c]);

          addAuditLog(`Técnico ${currentTech?.name} completó servicio ${apptId}. Cobro de $${servicePrice} MXN enviado a caja.`);
        } else {
          addAuditLog(`Técnico ${currentTech?.name} cambió estado de orden ${apptId} a: ${state}`);
        }

        return {
          ...appt,
          serviceState: state,
          status: nextStatus,
          technicianNotes: fieldNotes || appt.technicianNotes
        };
      }
      return appt;
    }));

    if (state === 'Terminado') {
      setSelectedApptId(null);
      setFieldNotes('');
    }
  };

  // Report material usage handler
  const handleAddMaterialToJob = (apptId: string) => {
    if (!selectedMaterialId) return;
    const material = inventory.find(i => i.id === selectedMaterialId);
    if (!material) return;

    if (material.stock < materialQty) {
      alert(`Inventario insuficiente. Solo quedan ${material.stock} ${material.unit} de ${material.name}.`);
      return;
    }

    // Deduct stock
    setInventory(prev => prev.map(item => {
      if (item.id === selectedMaterialId) {
        return { ...item, stock: item.stock - materialQty };
      }
      return item;
    }));

    // Register material in appointment
    setAppointments(prev => prev.map(appt => {
      if (appt.id === apptId) {
        const currentMaterials = appt.materialsUsed || [];
        const existingIdx = currentMaterials.findIndex(m => m.itemId === selectedMaterialId);
        
        let nextMaterials = [...currentMaterials];
        if (existingIdx > -1) {
          nextMaterials[existingIdx].qty += materialQty;
        } else {
          nextMaterials.push({
            itemId: selectedMaterialId,
            name: material.name,
            qty: materialQty
          });
        }
        return { ...appt, materialsUsed: nextMaterials };
      }
      return appt;
    }));

    addAuditLog(`Técnico ${currentTech?.name} reportó el uso de ${materialQty} ${material.unit} de ${material.name} en servicio ${apptId}`);
    setSelectedMaterialId('');
    setMaterialQty(1);
  };

  // Mock Photo evidence uploader helper
  const handleSimulatePhoto = (apptId: string, field: 'beforePhoto' | 'afterPhoto') => {
    // We'll set a standard beautiful high-quality air conditioner photo simulation
    const dummyUrl = field === 'beforePhoto' 
      ? 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=60' // dusty / old
      : 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=60'; // clean / work-in-progress

    setAppointments(prev => prev.map(appt => {
      if (appt.id === apptId) {
        return { ...appt, [field]: dummyUrl };
      }
      return appt;
    }));

    addAuditLog(`Técnico ${currentTech?.name} cargó foto de evidencia (${field === 'beforePhoto' ? 'Antes' : 'Después'}) en servicio ${apptId}`);
  };

  // Expense Logger Handler
  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (expenseAmount <= 0 || !expenseDesc.trim()) return;

    const newExpense: RouteExpense = {
      id: `EXP-${Date.now()}`,
      technicianId: activeTechId,
      technicianName: currentTech?.name || 'Técnico de Campo',
      amount: expenseAmount,
      category: expenseCategory,
      description: expenseDesc,
      date: new Date().toISOString().split('T')[0]
    };

    setRouteExpenses(prev => [newExpense, ...prev]);

    // Send a pending verification expense log automatically into Caja Chica!
    const newCajaLog: CajaChicaLog = {
      id: `CJ-${Date.now()}`,
      type: 'expense',
      amount: expenseAmount,
      concept: `Gasto de ruta reportado por Técnico ${currentTech?.name}: ${expenseDesc} (${expenseCategory})`,
      date: new Date().toISOString().split('T')[0],
      status: 'pending_validation' // Needs coordinator approval
    };
    setCajaLogs(c => [newCajaLog, ...c]);

    addAuditLog(`Técnico ${currentTech?.name} reportó un gasto de viáticos por $${expenseAmount} MXN para gasolina/compras`);
    setExpenseAmount(0);
    setExpenseDesc('');
    setShowAddExpense(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      
      {/* Simulation Selector Bar */}
      <div className="bg-[#0f172a] text-slate-300 px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0 select-none">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-emerald-400 animate-spin-once" />
          <span className="text-xs font-bold text-white">Consola de Simulación Técnico en Campo</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Ver como técnico:</span>
          <select
            value={activeTechId}
            onChange={(e) => {
              setActiveTechId(e.target.value);
              setSelectedApptId(null);
            }}
            className="bg-slate-800 text-white font-bold px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-400 text-xs cursor-pointer"
          >
            {activeTechs.map(tech => (
              <option key={tech.id} value={tech.id}>
                🟢 {tech.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">

        {/* 1. AGENDAR GASTO DE RUTA RAPIDO */}
        {showAddExpense ? (
          <form
            onSubmit={handleAddExpenseSubmit}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4"
          >
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              Registrar Gasto de Gasolina o Refacción en Ruta (Viáticos)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Concepto de compra</label>
                <input
                  type="text"
                  placeholder="Ej. Carga de Gasolina Magna"
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monto del comprobante</label>
                <input
                  type="number"
                  placeholder="Ej. 450"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(parseInt(e.target.value) || 0)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  min="1"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Categoría</label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value as any)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                >
                  <option value="Combustible">⛽ Gasolina / Combustible</option>
                  <option value="Peaje">🛣️ Casetas / Peaje</option>
                  <option value="Refacción Emergencia">📦 Refacción de Emergencia</option>
                  <option value="Otro">🛠️ Otro Gasto</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 text-xs font-bold pt-1">
              <button
                type="button"
                onClick={() => setShowAddExpense(false)}
                className="px-3 py-2 bg-slate-200 text-slate-600 rounded-xl hover:bg-slate-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
                Registrar Gasto de Viático
              </button>
            </div>
          </form>
        ) : (
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Registro de Viáticos</span>
              <h3 className="text-xs font-extrabold text-slate-800 mt-0.5">¿Compraste insumos o gasolina en el camino?</h3>
            </div>
            <button
              onClick={() => setShowAddExpense(true)}
              className="bg-[#1e293b] hover:bg-slate-800 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Subir Gasto de Ruta
            </button>
          </div>
        )}

        {/* 2. SERVICES LIST AND ACTIVE FOCUS VIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left / Middle: List of Assigned services of the day */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Mi Agenda Diaria del Técnico ({techAppointments.length} Trabajos)
            </h3>

            {techAppointments.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-200 p-8 rounded-3xl text-center text-slate-400 text-xs">
                Disfruta tu día libre, no tienes servicios asignados el día de hoy.
              </div>
            ) : (
              <div className="space-y-4">
                {techAppointments.map((appt) => {
                  const isActiveJob = selectedApptId === appt.id;
                  return (
                    <div
                      key={appt.id}
                      onClick={() => setSelectedApptId(appt.id)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-4 select-none ${
                        isActiveJob
                          ? 'bg-blue-50/20 border-blue-500 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                              {appt.id}
                            </span>
                            <span className="text-[10px] text-slate-500 font-semibold">{appt.timeSlot}</span>
                          </div>
                          <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mt-1">{appt.clientName}</h4>
                        </div>
                        
                        {/* Status badge */}
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[9px] uppercase tracking-wider border ${
                          appt.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                            : appt.serviceState === 'En Proceso'
                              ? 'bg-blue-50 text-blue-700 border-blue-200/50 animate-pulse'
                              : appt.serviceState === 'En Camino'
                                ? 'bg-amber-50 text-amber-700 border-amber-200/50'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {appt.status === 'completed' ? 'TERMINADO' : appt.serviceState || 'ASIGNADO'}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{appt.clientAddress}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="line-clamp-1 italic">{appt.details}</span>
                        </div>
                      </div>

                      {/* Map trigger with single click */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(appt.clientAddress)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()} // don't open details modal
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 font-bold text-[10px] px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Navigation className="w-3.5 h-3.5" /> Abrir Ruta en GPS
                        </a>
                        <span className="text-[10px] text-blue-600 font-bold flex items-center gap-0.5">
                          Ver Panel Técnico <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Panel: Technical Focus / Active Job Flow controls */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Control de Trabajo en Curso
            </h3>

            {activeAppt ? (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-5">
                
                {/* Active job header info */}
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                    {activeAppt.id}
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mt-1.5">{activeAppt.clientName}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">{activeAppt.clientAddress}</p>
                </div>

                {/* FLOW STEPS (Buttons En Camino, En Proceso, Terminado) */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estado de Servicio en Campo</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => handleUpdateServiceState(activeAppt.id, 'En Camino')}
                      className={`py-2 px-1 text-[10px] font-bold uppercase rounded-xl border text-center transition-all cursor-pointer ${
                        activeAppt.serviceState === 'En Camino'
                          ? 'bg-amber-500 text-white border-amber-600'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      En Camino
                    </button>
                    <button
                      onClick={() => handleUpdateServiceState(activeAppt.id, 'En Proceso')}
                      className={`py-2 px-1 text-[10px] font-bold uppercase rounded-xl border text-center transition-all cursor-pointer ${
                        activeAppt.serviceState === 'En Proceso'
                          ? 'bg-blue-600 text-white border-blue-700'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      En Proceso
                    </button>
                    <button
                      onClick={() => handleUpdateServiceState(activeAppt.id, 'Terminado')}
                      className="py-2 px-1 text-[10px] font-bold uppercase rounded-xl border bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-700 text-center transition-all cursor-pointer"
                    >
                      Terminado
                    </button>
                  </div>
                </div>

                {/* EVIDENCIA FOTOGRAFICA (Antes y Despues) */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Evidencia Técnica (Antes y Después)</label>
                  <div className="grid grid-cols-2 gap-3">
                    
                    {/* Before Photo */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-semibold text-slate-500 block">Antes del Servicio</span>
                      {activeAppt.beforePhoto ? (
                        <div className="relative rounded-xl overflow-hidden aspect-video border border-slate-200">
                          <img src={activeAppt.beforePhoto} className="w-full h-full object-cover" alt="Antes" referrerPolicy="no-referrer" />
                          <button
                            onClick={() => handleSimulatePhoto(activeAppt.id, 'beforePhoto')}
                            className="absolute bottom-1 right-1 bg-slate-900/80 text-white p-1 rounded hover:bg-slate-900 cursor-pointer"
                            title="Cambiar foto"
                          >
                            <Camera className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSimulatePhoto(activeAppt.id, 'beforePhoto')}
                          className="w-full aspect-video rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 flex flex-col items-center justify-center text-slate-400 text-[10px] font-bold gap-1 cursor-pointer"
                        >
                          <Camera className="w-5 h-5 text-slate-300" /> Capturar Foto
                        </button>
                      )}
                    </div>

                    {/* After Photo */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-semibold text-slate-500 block">Trabajo Terminado</span>
                      {activeAppt.afterPhoto ? (
                        <div className="relative rounded-xl overflow-hidden aspect-video border border-slate-200">
                          <img src={activeAppt.afterPhoto} className="w-full h-full object-cover" alt="Después" referrerPolicy="no-referrer" />
                          <button
                            onClick={() => handleSimulatePhoto(activeAppt.id, 'afterPhoto')}
                            className="absolute bottom-1 right-1 bg-slate-900/80 text-white p-1 rounded hover:bg-slate-900 cursor-pointer"
                            title="Cambiar foto"
                          >
                            <Camera className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSimulatePhoto(activeAppt.id, 'afterPhoto')}
                          className="w-full aspect-video rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 flex flex-col items-center justify-center text-slate-400 text-[10px] font-bold gap-1 cursor-pointer"
                        >
                          <Camera className="w-5 h-5 text-slate-300" /> Capturar Foto
                        </button>
                      )}
                    </div>

                  </div>
                </div>

                {/* REPORTE DE MATERIALES CONSUMIDOS */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Insumos y Refacciones Utilizadas</label>
                  
                  {/* Select materials from Warehouse */}
                  <div className="flex gap-1.5">
                    <select
                      value={selectedMaterialId}
                      onChange={(e) => setSelectedMaterialId(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-300 rounded-xl text-xs px-2 py-1.5 focus:outline-none focus:border-blue-500"
                    >
                      <option value="">-- Seleccionar Refacción --</option>
                      {inventory.map(item => (
                        <option key={item.id} value={item.id}>
                          📦 {item.name} (Quedan {item.stock})
                        </option>
                      ))}
                    </select>
                    
                    <input
                      type="number"
                      value={materialQty}
                      onChange={(e) => setMaterialQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-12 bg-slate-50 border border-slate-300 rounded-xl text-xs p-1.5 text-center focus:outline-none focus:border-blue-500 font-bold"
                      min="1"
                    />

                    <button
                      onClick={() => handleAddMaterialToJob(activeAppt.id)}
                      className="bg-[#1e293b] hover:bg-slate-800 text-white text-[11px] font-bold px-3 rounded-xl transition-colors cursor-pointer"
                    >
                      Agregar
                    </button>
                  </div>

                  {/* Materials used list summary */}
                  {activeAppt.materialsUsed && activeAppt.materialsUsed.length > 0 && (
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] space-y-1">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Registrados en orden:</span>
                      {activeAppt.materialsUsed.map((m, idx) => (
                        <div key={idx} className="flex justify-between font-medium text-slate-700">
                          <span>• {m.name}</span>
                          <span className="font-extrabold">x{m.qty} pzas</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* NOTAS DE CAMPO / OBSERVACIONES */}
                <div className="space-y-1.5 pt-3 border-t border-slate-100">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Notas de Diagnóstico en Campo</label>
                  <textarea
                    placeholder="Escribe observaciones detectadas, diagnóstico final o recomendaciones para el cliente..."
                    value={fieldNotes}
                    onChange={(e) => setFieldNotes(e.target.value)}
                    className="w-full h-16 bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 rounded-xl p-2.5 text-xs text-slate-700 leading-normal"
                  />
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-6 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                <Compass className="w-8 h-8 text-slate-300" />
                <span>Selecciona un servicio de tu agenda diaria para iniciar la ruta y registrar evidencias.</span>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
