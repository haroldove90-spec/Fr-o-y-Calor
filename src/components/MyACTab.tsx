/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AirConditioner } from '../types';
import { Plus, Wrench, ShieldAlert, CheckCircle, Flame, Calendar, Cpu, ArrowRight, MessageSquare, Sparkles } from 'lucide-react';

interface MyACTabProps {
  acList: AirConditioner[];
  onAddAC: (ac: Omit<AirConditioner, 'id'>) => void;
  onBookService: (acId: string, acNickname: string, serviceType: 'maintenance' | 'repair') => void;
  onAskAIAboutAC: (acNickname: string, brand: string, model: string) => void;
}

export default function MyACTab({ acList, onAddAC, onBookService, onAskAIAboutAC }: MyACTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    nickname: '',
    type: 'split' as 'split' | 'window' | 'cassette' | 'floor' | 'portable',
    btu: 12000,
    installationDate: new Date().toISOString().split('T')[0],
    lastServiceDate: new Date().toISOString().split('T')[0],
    status: 'normal' as 'normal' | 'maintenance_needed' | 'faulty',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brand || !formData.nickname) {
      alert("Por favor introduce una marca y un apodo para identificar tu equipo.");
      return;
    }
    onAddAC(formData);
    setFormData({
      brand: '',
      model: '',
      nickname: '',
      type: 'split',
      btu: 12000,
      installationDate: new Date().toISOString().split('T')[0],
      lastServiceDate: new Date().toISOString().split('T')[0],
      status: 'normal',
    });
    setShowAddForm(false);
  };

  const getStatusBadge = (status: AirConditioner['status']) => {
    switch (status) {
      case 'normal':
        return (
          <span className="flex items-center gap-1 text-[10px] bg-[#dcfce7] text-[#166534] border border-emerald-200/50 rounded-full px-2.5 py-0.5 font-bold tracking-wider uppercase shadow-2xs select-none">
            <CheckCircle className="w-3 h-3 text-[#166534]" />
            Óptimo
          </span>
        );
      case 'maintenance_needed':
        return (
          <span className="flex items-center gap-1 text-[10px] bg-[#fef3c7] text-[#92400e] border border-amber-200/50 rounded-full px-2.5 py-0.5 font-bold tracking-wider uppercase shadow-2xs select-none">
            <Calendar className="w-3 h-3 text-[#92400e]" />
            Sugerido
          </span>
        );
      case 'faulty':
        return (
          <span className="flex items-center gap-1 text-[10px] bg-rose-50 text-rose-600 border border-rose-100 rounded-full px-2.5 py-0.5 font-bold tracking-wider uppercase shadow-2xs select-none">
            <ShieldAlert className="w-3 h-3" />
            Con Falla
          </span>
        );
    }
  };

  const getACTypeLabel = (type: AirConditioner['type']) => {
    const labels = {
      split: 'Minisplit (Pared)',
      window: 'De Ventana',
      cassette: 'Cassette (Techo)',
      floor: 'Piso Techo',
      portable: 'Portátil'
    };
    return labels[type] || type;
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-slate-800">Mis Equipos de Aire</h2>
          <p className="text-xs text-slate-400">Controla tus sistemas de climatización</p>
        </div>
        
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1 text-xs font-semibold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-3 py-2 rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Agregar
          </button>
        )}
      </div>

      {/* Add New AC Form Panel */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Nuevo Equipo</h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
            >
              Cancelar
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <div>
              <span className="text-[10px] text-slate-400 font-medium block mb-0.5">Apodo del Equipo (ej: Aire de la Sala, Mi Dormitorio)</span>
              <input
                type="text"
                placeholder="Ej: Minisplit Sala principal"
                value={formData.nickname}
                onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 font-medium block mb-0.5">Marca</span>
                <input
                  type="text"
                  placeholder="Ej: Carrier, LG, York"
                  value={formData.brand}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-medium block mb-0.5">Modelo (Opcional)</span>
                <input
                  type="text"
                  placeholder="Ej: INVERTER-12K"
                  value={formData.model}
                  onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 font-medium block mb-0.5">Tipo de Aire</span>
                <select
                  value={formData.type}
                  onChange={(e: any) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="split">Minisplit (Pared)</option>
                  <option value="window">De Ventana</option>
                  <option value="cassette">Cassette (Techo)</option>
                  <option value="floor">Piso Techo</option>
                  <option value="portable">Portátil</option>
                </select>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-medium block mb-0.5">Capacidad (BTUs)</span>
                <select
                  value={formData.btu}
                  onChange={(e) => setFormData(prev => ({ ...prev, btu: parseInt(e.target.value) }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={9000}>9,000 BTU (0.75 Ton)</option>
                  <option value={12000}>12,000 BTU (1.0 Ton)</option>
                  <option value={18000}>18,000 BTU (1.5 Ton)</option>
                  <option value={24000}>24,000 BTU (2.0 Ton)</option>
                  <option value={36000}>36,000 BTU (3.0 Ton)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 font-medium block mb-0.5">F. de Instalación</span>
                <input
                  type="date"
                  value={formData.installationDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, installationDate: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-medium block mb-0.5">Último Mantenimiento</span>
                <input
                  type="date"
                  value={formData.lastServiceDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastServiceDate: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-medium block mb-0.5">Estado Inicial</span>
              <div className="grid grid-cols-3 gap-1.5">
                {(['normal', 'maintenance_needed', 'faulty'] as const).map((status) => {
                  const statusLabels = { normal: 'Óptimo', maintenance_needed: 'Mantenimiento', faulty: 'Con Falla' };
                  const colors = { normal: 'bg-emerald-500', maintenance_needed: 'bg-amber-500', faulty: 'bg-rose-500' };
                  const isSel = formData.status === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, status }))}
                      className={`text-[10px] font-semibold py-1 px-1.5 rounded-lg border text-center transition-all ${
                        isSel
                          ? 'bg-slate-800 text-white border-slate-800'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${colors[status]} mr-1 align-middle`}></span>
                      {statusLabels[status]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold py-2.5 rounded-xl mt-1 transition-colors cursor-pointer"
          >
            Guardar Equipo de Aire
          </button>
        </form>
      )}

      {/* Equipment List Grid */}
      <div>
        {acList.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <Cpu className="w-8 h-8 text-slate-300" />
            <span>Aún no registras tus aires acondicionados.</span>
            <span>Usa el botón de arriba para registrar tu primer equipo.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {acList.map((ac) => (
              <div
                key={ac.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col justify-between gap-3"
              >
                {/* Top Content */}
                <div className="flex flex-col gap-3">
                  {/* Card Header */}
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-800 leading-tight">{ac.nickname}</h3>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block mt-0.5">
                        {ac.brand} {ac.model ? `• ${ac.model}` : ''}
                      </span>
                    </div>
                    {getStatusBadge(ac.status)}
                  </div>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 bg-slate-50 rounded-xl p-2.5 text-xs border border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-400">Tipo:</span>
                      <span className="font-semibold text-slate-700">{getACTypeLabel(ac.type)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-400">Capacidad:</span>
                      <span className="font-semibold text-slate-700">{ac.btu.toLocaleString()} BTU</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-400">Último Servicio:</span>
                      <span className="font-semibold text-slate-700">{ac.lastServiceDate}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-400">F. Instalado:</span>
                      <span className="font-semibold text-slate-700">{ac.installationDate}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Footer */}
                <div className="flex justify-between gap-2 mt-1 shrink-0">
                  
                  {/* Book Technical Visit */}
                  <button
                    onClick={() => onBookService(ac.id, ac.nickname, ac.status === 'faulty' ? 'repair' : 'maintenance')}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold py-1.5 px-2 px-2.5 rounded-xl text-[10px] text-center transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    {ac.status === 'faulty' ? 'Reparación' : 'Mantenimiento'}
                  </button>

                  {/* Consult Gemini AI About this AC */}
                  <button
                    onClick={() => onAskAIAboutAC(ac.nickname, ac.brand, ac.type)}
                    className="bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 border border-blue-100 font-semibold py-1.5 px-3 rounded-xl text-[10px] transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Diagnóstico
                  </button>

                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
