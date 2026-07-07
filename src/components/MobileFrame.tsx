/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  CalendarRange,
  Sparkles,
  Cpu,
  Calculator,
  UserCheck,
  RefreshCw,
  Wrench,
  User,
  Shield,
  Clock,
  HelpCircle
} from 'lucide-react';

type TabType = 'appointments' | 'diagnose' | 'equipment' | 'calculator';

interface MobileFrameProps {
  children: React.ReactNode;
  activeRole: 'client' | 'technician';
  onRoleToggle: () => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function MobileFrame({
  children,
  activeRole,
  onRoleToggle,
  activeTab,
  setActiveTab,
}: MobileFrameProps) {
  
  const getTabLabel = (tab: TabType) => {
    switch (tab) {
      case 'appointments':
        return activeRole === 'client' ? 'Mis Citas / Servicios' : 'Hoja de Ruta del Técnico';
      case 'diagnose':
        return 'Soporte de Diagnóstico AI';
      case 'equipment':
        return 'Mis Equipos de Aire';
      case 'calculator':
        return 'Calculadora de Capacidad BTU';
    }
  };

  const menuItems = [
    { id: 'appointments' as TabType, label: activeRole === 'client' ? 'Citas Técnicas' : 'Ruta Técnica', icon: CalendarRange },
    { id: 'diagnose' as TabType, label: 'Diagnóstico AI', icon: Sparkles, badge: true },
    { id: 'equipment' as TabType, label: 'Mis Equipos', icon: Cpu },
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
          <div className="w-8 h-8 bg-blue-600 flex items-center justify-center rounded-lg text-white font-bold text-sm shadow-md shadow-blue-500/10">
            A
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight leading-none">AirePro</h1>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mt-1">
              Gestión Climática
            </span>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1 overflow-y-auto">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2 block">
            Navegación
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

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-slate-800 bg-[#0c1222] flex flex-col gap-3">
          
          {/* Active Profile Stat */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col gap-1">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Perfil Activo</span>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${activeRole === 'client' ? 'bg-blue-500' : 'bg-amber-500'}`} />
              <span className="text-xs font-bold text-white">
                {activeRole === 'client' ? 'Cliente / Propietario' : 'Técnico de Campo'}
              </span>
            </div>
          </div>

          {/* Role Toggle Trigger Button */}
          <button
            onClick={onRoleToggle}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold bg-[#1e293b] hover:bg-slate-800 text-white border border-slate-700/60 rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            Cambiar a {activeRole === 'client' ? 'Técnico' : 'Cliente'}
          </button>
        </div>

      </aside>

      {/* ========================================================================= */}
      {/* MAIN VIEWPORT LAYOUT (md and up)                                          */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        
        {/* DESKTOP HEADER (md and up) */}
        <header className="hidden md:flex h-[72px] bg-white border-b border-slate-200 px-8 items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-100 text-slate-500 border border-slate-200/80 rounded-md px-2 py-0.5 font-bold uppercase tracking-wide">
              {activeRole === 'client' ? 'Portal Cliente' : 'Consola Técnica'}
            </span>
            <h1 className="text-base font-bold text-slate-800 ml-1.5">{getTabLabel(activeTab)}</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Servicio en línea</span>
            </div>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* MOBILE VIEWPORT HEADER (small screens only)                               */}
        {/* ========================================================================= */}
        <header className="md:hidden bg-[#0f172a] border-b border-slate-800 px-4 py-3 flex items-center justify-between z-10 select-none shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 flex items-center justify-center rounded-md text-white font-bold text-xs select-none shadow-xs">
              A
            </div>
            <div>
              <h1 className="text-xs font-bold tracking-tight text-white leading-none">AirePro</h1>
              <span className="text-[9px] text-slate-400 font-medium block mt-0.5 uppercase tracking-wider">
                {activeRole === 'client' ? 'Portal Cliente' : 'Consola Técnica'}
              </span>
            </div>
          </div>

          {/* Top Switch Toggle on Mobile directly */}
          <button
            onClick={onRoleToggle}
            className="flex items-center gap-1 bg-[#1e293b] hover:bg-slate-800 border border-slate-700 text-white font-bold text-[9px] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 text-slate-300 animate-spin-once" />
            {activeRole === 'client' ? 'TÉCNICO' : 'CLIENTE'}
          </button>
        </header>

        {/* Screen Content Frame */}
        <main className="flex-1 overflow-hidden flex flex-col relative min-w-0">
          <div className="flex-1 overflow-hidden flex flex-col w-full max-w-7xl mx-auto md:p-6 lg:p-8">
            <div className="flex-1 bg-white md:border md:border-slate-200/80 md:rounded-3xl md:shadow-xs overflow-hidden flex flex-col min-w-0">
              {children}
            </div>
          </div>
        </main>

        {/* ========================================================================= */}
        {/* MOBILE BOTTOM NAVIGATION BAR (small screens only)                        */}
        {/* ========================================================================= */}
        <nav className="md:hidden bg-white border-t border-slate-200 py-1.5 px-2 grid grid-cols-4 select-none shrink-0 z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
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
