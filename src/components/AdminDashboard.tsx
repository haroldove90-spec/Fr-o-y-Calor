/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Employee,
  CatalogPrice,
  InventoryItem,
  AuditLog,
  CajaChicaLog
} from '../types';
import {
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Cpu,
  Plus,
  Trash2,
  Edit2,
  Save,
  Check,
  AlertTriangle,
  History,
  TrendingUp as ProfitIcon,
  Award,
  ChevronRight,
  Sparkles,
  PackageCheck
} from 'lucide-react';

interface AdminDashboardProps {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  catalog: CatalogPrice[];
  setCatalog: React.Dispatch<React.SetStateAction<CatalogPrice[]>>;
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  cajaLogs: CajaChicaLog[];
  auditLogs: AuditLog[];
  addAuditLog: (action: string) => void;
}

export default function AdminDashboard({
  employees,
  setEmployees,
  catalog,
  setCatalog,
  inventory,
  setInventory,
  cajaLogs,
  auditLogs,
  addAuditLog,
}: AdminDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'financial' | 'personal' | 'catalog' | 'inventory' | 'history'>('financial');

  // Modals / Input states for Adding Items
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpRole, setNewEmpRole] = useState<'admin' | 'coordinator' | 'technician'>('technician');

  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPriceValue, setTempPriceValue] = useState<number>(0);

  const [showAddPart, setShowAddPart] = useState(false);
  const [newPartName, setNewPartName] = useState('');
  const [newPartCode, setNewPartCode] = useState('');
  const [newPartStock, setNewPartStock] = useState<number>(10);
  const [newPartUnit, setNewPartUnit] = useState('pzas');
  const [newPartPrice, setNewPartPrice] = useState<number>(500);

  // Financial Calculations
  const totalIncome = cajaLogs
    .filter((log) => log.type === 'income' && log.status === 'validated')
    .reduce((sum, log) => sum + log.amount, 185000) + 60800; // Base historical data + mock log
  const totalExpenses = cajaLogs
    .filter((log) => log.type === 'expense' && log.status === 'validated')
    .reduce((sum, log) => sum + log.amount, 54000) + 35400; // Base historical
  const netProfit = totalIncome - totalExpenses;
  const pendingDebts = 32000; // Adeudos pendientes

  // Personal Management Handlers
  const handleAddEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName.trim()) return;
    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      name: newEmpName,
      role: newEmpRole,
      permissions: newEmpRole === 'admin' 
        ? ['all'] 
        : newEmpRole === 'coordinator' 
          ? ['clients', 'schedule', 'quotes', 'caja_chica'] 
          : ['agenda', 'route', 'status_update', 'photos'],
      completedServices: 0,
      status: 'active'
    };
    setEmployees((prev) => [...prev, newEmp]);
    addAuditLog(`Alta de empleado: ${newEmp.name} como ${newEmpRole}`);
    setNewEmpName('');
    setShowAddEmployee(false);
  };

  const handleToggleEmployeeStatus = (id: string, currentStatus: 'active' | 'inactive') => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, status: nextStatus } : emp))
    );
    const emp = employees.find((e) => e.id === id);
    if (emp) {
      addAuditLog(`Cambió estado de empleado ${emp.name} a ${nextStatus}`);
    }
  };

  // Catalog Prices Handlers
  const handleStartEditPrice = (price: CatalogPrice) => {
    setEditingPriceId(price.id);
    setTempPriceValue(price.price);
  };

  const handleSavePrice = (id: string) => {
    setCatalog((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price: tempPriceValue } : item))
    );
    setEditingPriceId(null);
    const item = catalog.find((c) => c.id === id);
    if (item) {
      addAuditLog(`Actualizó precio de ${item.name} a $${tempPriceValue} MXN`);
    }
  };

  // Inventory Handlers
  const handleAdjustStock = (id: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStock = Math.max(0, item.stock + delta);
          return { ...item, stock: newStock };
        }
        return item;
      })
    );
    const item = inventory.find((i) => i.id === id);
    if (item) {
      addAuditLog(`Ajustó stock de ${item.name} a ${Math.max(0, item.stock + delta)} ${item.unit}`);
    }
  };

  const handleAddPartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartName.trim() || !newPartCode.trim()) return;
    const newItem: InventoryItem = {
      id: `part-${Date.now()}`,
      name: newPartName,
      code: newPartCode.toUpperCase(),
      stock: newPartStock,
      unit: newPartUnit,
      price: newPartPrice,
    };
    setInventory((prev) => [...prev, newItem]);
    addAuditLog(`Agregó refacción al inventario: ${newPartName} (${newPartCode})`);
    setNewPartName('');
    setNewPartCode('');
    setNewPartStock(10);
    setShowAddPart(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      
      {/* Sub tabs navigation */}
      <div className="bg-white border-b border-slate-200 px-6 flex overflow-x-auto gap-4 scrollbar-thin shrink-0 select-none">
        <button
          onClick={() => setActiveSubTab('financial')}
          className={`py-4 px-1 border-b-2 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer ${
            activeSubTab === 'financial'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Salud Financiera
        </button>
        <button
          onClick={() => setActiveSubTab('personal')}
          className={`py-4 px-1 border-b-2 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer ${
            activeSubTab === 'personal'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Gestión de Personal
        </button>
        <button
          onClick={() => setActiveSubTab('catalog')}
          className={`py-4 px-1 border-b-2 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer ${
            activeSubTab === 'catalog'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Precios Maestros
        </button>
        <button
          onClick={() => setActiveSubTab('inventory')}
          className={`py-4 px-1 border-b-2 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer ${
            activeSubTab === 'inventory'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Inventario Refacciones
        </button>
        <button
          onClick={() => setActiveSubTab('history')}
          className={`py-4 px-1 border-b-2 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer ${
            activeSubTab === 'history'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Auditoría General
        </button>
      </div>

      {/* Main Panel Content Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">

        {/* 1. FINANCIAL DASHBOARD TAB */}
        {activeSubTab === 'financial' && (
          <div className="space-y-6">
            
            {/* Top Indicator Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Ingresos Totales</span>
                  <span className="text-xl font-extrabold text-slate-900">${totalIncome.toLocaleString()} MXN</span>
                  <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5 mt-0.5">
                    <TrendingUp className="w-3 h-3" /> +14.2% este mes
                  </span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <TrendingDown className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Gastos de Operación</span>
                  <span className="text-xl font-extrabold text-slate-900">${totalExpenses.toLocaleString()} MXN</span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Incluye vales de ruta</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ProfitIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Utilidad Neta</span>
                  <span className="text-xl font-extrabold text-slate-900">${netProfit.toLocaleString()} MXN</span>
                  <span className="text-[10px] text-blue-500 font-bold flex items-center gap-0.5 mt-0.5">
                    Rentabilidad: {((netProfit / totalIncome) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Adeudos Pendientes</span>
                  <span className="text-xl font-extrabold text-slate-900">${pendingDebts.toLocaleString()} MXN</span>
                  <span className="text-[10px] text-amber-600 font-medium block mt-0.5">Por liquidar clientes</span>
                </div>
              </div>
            </div>

            {/* Custom Interactive CSS Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-800">Desglose de Ingresos vs Egresos</h3>
                    <span className="text-xs text-slate-400 block mt-0.5">Histórico comparativo semanal</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-600 rounded"></span>Ingreso</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-rose-500 rounded"></span>Egreso</span>
                  </div>
                </div>

                {/* CSS Bar Graph Grid */}
                <div className="h-64 flex items-end justify-between gap-4 pt-4 border-b border-slate-100">
                  {[
                    { label: 'Semana 1', inc: 70, exp: 40 },
                    { label: 'Semana 2', inc: 85, exp: 55 },
                    { label: 'Semana 3', inc: 95, exp: 35 },
                    { label: 'Semana 4', inc: 120, exp: 45 },
                  ].map((bar, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full flex items-end justify-center gap-1.5 h-48">
                        <div
                          style={{ height: `${bar.inc}%` }}
                          className="w-8 sm:w-12 bg-blue-600 rounded-t-lg shadow-sm hover:opacity-95 transition-opacity relative group"
                        >
                          <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none select-none z-10">
                            ${(bar.inc * 2000).toLocaleString()}
                          </span>
                        </div>
                        <div
                          style={{ height: `${bar.exp}%` }}
                          className="w-8 sm:w-12 bg-rose-500 rounded-t-lg shadow-sm hover:opacity-95 transition-opacity relative group"
                        >
                          <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none select-none z-10">
                            ${(bar.exp * 2000).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">{bar.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technician performance metrics */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-800">Rendimiento de Técnicos</h3>
                    <span className="text-xs text-slate-400 block mt-0.5">Servicios cerrados esta semana</span>
                  </div>
                  <Award className="w-5 h-5 text-amber-500 fill-amber-500" />
                </div>

                <div className="space-y-4">
                  {employees
                    .filter((e) => e.role === 'technician')
                    .map((tech) => (
                      <div key={tech.id} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700">{tech.name}</span>
                          <span className="font-extrabold text-blue-600">{tech.completedServices} servicios</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${Math.min(100, (tech.completedServices / 15) * 100)}%` }}
                            className="bg-blue-600 h-full rounded-full transition-all duration-300"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 2. EMPLOYEE MANAGEMENT TAB */}
        {activeSubTab === 'personal' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Plantilla de Empleados ({employees.length})</h3>
                <span className="text-xs text-slate-400 block mt-0.5">Gestión de personal y perfiles del negocio</span>
              </div>
              <button
                onClick={() => setShowAddEmployee(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Alta de Empleado
              </button>
            </div>

            {/* Add Employee Form overlay inside dashboard */}
            {showAddEmployee && (
              <form
                onSubmit={handleAddEmployeeSubmit}
                className="bg-slate-100 border border-slate-200/80 rounded-2xl p-4 space-y-4"
              >
                <div className="text-xs font-bold text-slate-700">Registrar Nuevo Colaborador</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nombre Completo</label>
                    <input
                      type="text"
                      placeholder="Ej. Carlos Torres"
                      value={newEmpName}
                      onChange={(e) => setNewEmpName(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rol de Sistema</label>
                    <select
                      value={newEmpRole}
                      onChange={(e) => setNewEmpRole(e.target.value as any)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                    >
                      <option value="technician">🟢 Técnico en Campo</option>
                      <option value="coordinator">🟡 Coordinador / Recepción</option>
                      <option value="admin">🔴 Administrador</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 text-xs font-bold pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddEmployee(false)}
                    className="px-3 py-2 bg-slate-200 text-slate-600 rounded-xl hover:bg-slate-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            )}

            {/* Employees Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[9px] tracking-wider select-none">
                      <th className="p-4">Colaborador</th>
                      <th className="p-4">Rol</th>
                      <th className="p-4">Estatus</th>
                      <th className="p-4">Servicios Completados</th>
                      <th className="p-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {employees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-50/55 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-slate-800">{emp.name}</div>
                          <span className="text-[9px] text-slate-400 font-semibold">{emp.id}</span>
                        </td>
                        <td className="p-4">
                          {emp.role === 'admin' ? (
                            <span className="bg-rose-50 text-rose-600 font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-rose-200/50">
                              Administrador
                            </span>
                          ) : emp.role === 'coordinator' ? (
                            <span className="bg-amber-50 text-amber-700 font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-amber-200/50">
                              Coordinación / Recepción
                            </span>
                          ) : (
                            <span className="bg-emerald-50 text-emerald-700 font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-200/50">
                              Técnico Campo
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-full ${
                              emp.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${emp.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                            {emp.status === 'active' ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="p-4 text-center font-bold text-slate-700">
                          {emp.role === 'technician' ? emp.completedServices : '-'}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleToggleEmployeeStatus(emp.id, emp.status)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            {emp.status === 'active' ? 'Desactivar' : 'Activar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* 3. CATALOG PRICES TAB */}
        {activeSubTab === 'catalog' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">Catálogo Maestro de Precios</h3>
              <span className="text-xs text-slate-400 block mt-0.5">Valores fijos oficiales para servicios de climatización</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {catalog.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex justify-between items-center gap-4">
                  <div className="flex-1">
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">{item.name}</h4>
                    <p className="text-[10px] text-slate-400 leading-normal mt-1">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 select-none">
                    {editingPriceId === item.id ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-extrabold text-slate-500">$</span>
                        <input
                          type="number"
                          value={tempPriceValue}
                          onChange={(e) => setTempPriceValue(parseInt(e.target.value) || 0)}
                          className="w-20 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold p-1 text-right focus:outline-none focus:border-blue-500"
                        />
                        <button
                          onClick={() => handleSavePrice(item.id)}
                          className="bg-emerald-500 text-white p-1 rounded hover:bg-emerald-600 transition-colors cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-slate-800">${item.price.toLocaleString()} MXN</span>
                        <button
                          onClick={() => handleStartEditPrice(item)}
                          className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-slate-50 rounded transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. INVENTORY SPARES TAB */}
        {activeSubTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Existencias de Refacciones</h3>
                <span className="text-xs text-slate-400 block mt-0.5">Control y ajuste de gases, capacitores y tarjetas universales</span>
              </div>
              <button
                onClick={() => setShowAddPart(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Agregar Refacción
              </button>
            </div>

            {/* Form Add part overlay */}
            {showAddPart && (
              <form
                onSubmit={handleAddPartSubmit}
                className="bg-slate-100 border border-slate-200/80 rounded-2xl p-4 space-y-4"
              >
                <div className="text-xs font-bold text-slate-700">Agregar Nueva Refacción / Insumo</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nombre del Insumo</label>
                    <input
                      type="text"
                      placeholder="Ej. Capacitor de Marcha 45uF"
                      value={newPartName}
                      onChange={(e) => setNewPartName(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Código Interno</label>
                    <input
                      type="text"
                      placeholder="Ej. CAP-45UF"
                      value={newPartCode}
                      onChange={(e) => setNewPartCode(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stock Inicial</label>
                    <input
                      type="number"
                      value={newPartStock}
                      onChange={(e) => setNewPartStock(parseInt(e.target.value) || 0)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                      min="0"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 text-xs font-bold pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddPart(false)}
                    className="px-3 py-2 bg-slate-200 text-slate-600 rounded-xl hover:bg-slate-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                  >
                    Agregar Insumo
                  </button>
                </div>
              </form>
            )}

            {/* Spares Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inventory.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">{item.name}</h4>
                      <span className="text-[10px] font-bold text-slate-400 block mt-0.5">{item.code}</span>
                    </div>
                    <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-100">
                      Costo: ${item.price} c/u
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="text-xs font-semibold text-slate-600">
                      Existencia: <span className="text-slate-800 font-extrabold">{item.stock}</span> {item.unit}
                    </div>
                    
                    {/* Stock quick controls */}
                    <div className="flex items-center gap-1 text-xs select-none">
                      <button
                        onClick={() => handleAdjustStock(item.id, -1)}
                        className="w-7 h-7 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-extrabold rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleAdjustStock(item.id, 1)}
                        className="w-7 h-7 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-extrabold rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. AUDIT HISTORY LOGS TAB */}
        {activeSubTab === 'history' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">Auditoría y Bitácora General</h3>
              <span className="text-xs text-slate-400 block mt-0.5">Registro en tiempo real de todos los movimientos de la plataforma</span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[9px] tracking-wider select-none">
                      <th className="p-4">Hora / Fecha</th>
                      <th className="p-4">Usuario</th>
                      <th className="p-4">Rol</th>
                      <th className="p-4">Acción Realizada</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px] text-slate-600">
                    {auditLogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-slate-400">
                          Sin movimientos registrados en esta sesión.
                        </td>
                      </tr>
                    ) : (
                      auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/55 transition-colors">
                          <td className="p-4 text-slate-400 font-sans">{log.timestamp}</td>
                          <td className="p-4 font-bold text-slate-700 font-sans">{log.user}</td>
                          <td className="p-4">
                            <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                              log.role === 'admin' 
                                ? 'bg-rose-50 text-rose-600 border border-rose-200/50' 
                                : log.role === 'coordinator' 
                                  ? 'bg-amber-50 text-amber-600 border border-amber-200/50' 
                                  : 'bg-emerald-50 text-emerald-600 border border-emerald-200/50'
                            }`}>
                              {log.role}
                            </span>
                          </td>
                          <td className="p-4 text-slate-800 font-sans font-medium">{log.action}</td>
                        </tr>
                      ))
                    )}
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
