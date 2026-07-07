/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Sparkles,
  Calculator,
  RefreshCw,
  TrendingUp,
  Compass,
  Briefcase,
  Users,
  Shield,
  Clock,
  Wrench,
  ThermometerSnowflake,
  Activity,
  LogOut,
  Smartphone,
  Download
} from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

type TabType = 'workspace' | 'diagnose' | 'calculator';
type RoleType = 'admin' | 'coordinator' | 'technician';

interface MobileFrameProps {
  children: React.ReactNode;
  activeRole: RoleType;
  onRoleChange: (role: RoleType | 'portal') => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function MobileFrame({
  children,
  activeRole,
  onRoleChange,
  activeTab,
  setActiveTab,
}: MobileFrameProps) {
  const { isInstallable, isInstalled, triggerInstall } = usePWA();
  
  const getRoleLabel = (role: RoleType) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'coordinator':
        return 'Coordinador / Oficina';
      case 'technician':
        return 'Técnico en Campo';
    }
  };

  const getWorkspaceTitle = () => {
    switch (activeRole) {
      case 'admin':
        return '🔴 Consola de Administración (Omar Castillo)';
      case 'coordinator':
        return '🟡 Logística y Recepción (Oficina)';
      case 'technician':
        return '🟢 Agenda de Ruta Técnica (Móvil)';
    }
  };

  const getTabLabel = (tab: TabType) => {
    switch (tab) {
      case 'workspace':
        return getWorkspaceTitle();
      case 'diagnose':
        return 'Asistente de Diagnóstico AI';
      case 'calculator':
        return 'Calculadora Técnica de BTUs';
    }
  };

  const menuItems = [
    { id: 'workspace' as TabType, label: activeRole === 'admin' ? 'Dashboard Admin' : activeRole === 'coordinator' ? 'Logística Oficina' : 'Ruta Técnica', icon: Briefcase },
    { id: 'diagnose' as TabType, label: 'Diagnóstico AI', icon: Sparkles, badge: true },
    { id: 'calculator' as TabType, label: 'Cálculo BTU', icon: Calculator },
  ];

  return (
    <div className="min-h-screen w-full flex bg-slate-50 font-sans antialiased text-slate-800 overflow-hidden">
      
      {/* ========================================================================= */}
      {/* DESKTOP SIDEBAR LAYOUT (md and up)                                        */}
      {/* ========================================================================= */}
      <aside className="hidden md:flex flex-col w-[280px] bg-[#0f172a] text-slate-400 border-r border-slate-800 shrink-0 h-screen select-none">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800/80">
          <img
            src="https://appdesignproyectos.com/caloryfriologo.png"
            alt="Calor y Frío"
            className="h-10 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
          <div>
            <h1 className="text-sm font-black text-white tracking-wider leading-none uppercase">Calor y Frío</h1>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block mt-1">
              Climas & Climatización
            </span>
          </div>
        </div>

        {/* Role Selector Box */}
        <div className="p-4 border-b border-slate-800 bg-[#0c1222]/50">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Seleccionar Rol de Acceso
          </span>
          <div className="relative">
            <select
              value={activeRole}
              onChange={(e) => onRoleChange(e.target.value as any)}
              className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-blue-500 cursor-pointer appearance-none"
            >
              <option value="admin">🔴 Administrador (Omar)</option>
              <option value="coordinator">🟡 Coordinación (Recepción)</option>
              <option value="technician">🟢 Técnico (Carlos)</option>
              <option value="portal">🏠 Portal de Inicio</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
              <RefreshCw className="w-3.5 h-3.5 animate-spin-once" />
            </div>
          </div>
        </div>

        {/* PWA Install Sidebar Button */}
        {!isInstalled && (
          <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/30">
            <button
              onClick={triggerInstall}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/10 cursor-pointer group"
            >
              <Smartphone className="w-3.5 h-3.5 text-cyan-200 animate-bounce" />
              <span>Instalar Aplicación</span>
            </button>
          </div>
        )}

        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1 overflow-y-auto">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2 block">
            Herramientas y Módulos
          </span>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Info */}
        <div className="p-4 border-t border-slate-800 bg-[#0c1222] flex flex-col gap-2">
          <button
            onClick={() => onRoleChange('portal')}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Volver al Portal</span>
          </button>
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Empresa de Climas Activa
          </div>
        </div>

      </aside>

      {/* ========================================================================= */}
      {/* MAIN VIEWPORT LAYOUT (md and up)                                          */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        
        {/* DESKTOP HEADER (md and up) */}
        <header className="hidden md:flex h-[72px] bg-white border-b border-slate-200 px-8 items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] border rounded-md px-2 py-0.5 font-bold uppercase tracking-wide ${
              activeRole === 'admin' 
                ? 'bg-rose-50 text-rose-600 border-rose-100' 
                : activeRole === 'coordinator' 
                  ? 'bg-amber-50 text-amber-700 border-amber-100' 
                  : 'bg-emerald-50 text-emerald-700 border-emerald-100'
            }`}>
              {getRoleLabel(activeRole)}
            </span>
            <h1 className="text-base font-bold text-slate-800 ml-1.5">{getTabLabel(activeTab)}</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {!isInstalled && (
              <button
                onClick={triggerInstall}
                className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm shadow-blue-500/10 cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Instalar PWA</span>
              </button>
            )}
            <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Central Calor y Frío</span>
            </div>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* MOBILE VIEWPORT HEADER (small screens only)                               */}
        {/* ========================================================================= */}
        <header className="md:hidden bg-[#0f172a] border-b border-slate-800 px-4 py-3 flex items-center justify-between z-10 select-none shrink-0">
          <div className="flex items-center gap-2">
            <img
              src="https://appdesignproyectos.com/caloryfriologo.png"
              alt="Calor y Frío"
              className="h-8 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="text-xs font-black tracking-wider text-white leading-none uppercase">Calor y Frío</h1>
              <span className="text-[9px] text-slate-400 font-semibold block mt-0.5 uppercase tracking-wider">
                {getRoleLabel(activeRole)}
              </span>
            </div>
          </div>

          {/* Top Switch Toggle on Mobile directly */}
          <div className="flex items-center gap-2">
            <select
              value={activeRole}
              onChange={(e) => onRoleChange(e.target.value as any)}
              className="bg-slate-800 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none text-xs cursor-pointer"
            >
              <option value="admin">🔴 Admin</option>
              <option value="coordinator">🟡 Coordinador</option>
              <option value="technician">🟢 Técnico</option>
              <option value="portal">🏠 Portal</option>
            </select>
          </div>
        </header>

        {/* Screen Content Frame */}
        <main className="flex-1 overflow-hidden flex flex-col relative min-w-0">
          <div className="flex-1 overflow-hidden flex flex-col w-full max-w-7xl mx-auto md:p-6">
            <div className="flex-1 bg-white md:border md:border-slate-200/80 md:rounded-3xl md:shadow-xs overflow-hidden flex flex-col min-w-0">
              {children}
            </div>
          </div>
        </main>

        {/* ========================================================================= */}
        {/* MOBILE BOTTOM NAVIGATION BAR (small screens only)                        */}
        {/* ========================================================================= */}
        <nav className="md:hidden bg-white border-t border-slate-200 py-1.5 px-2 grid grid-cols-3 select-none shrink-0 z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 py-1 text-center transition-all cursor-pointer ${
                  isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <div className="relative">
                  <IconComponent className="w-5 h-5 shrink-0" />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-extrabold tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>

      </div>

    </div>
  );
}
