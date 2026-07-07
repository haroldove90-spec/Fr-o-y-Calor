/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Sparkles,
  Calculator,
  RefreshCw,
  Briefcase,
  Users,
  Shield,
  Wrench,
  LogOut,
  Smartphone,
  Download,
  Home
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
    { 
      id: 'workspace' as TabType, 
      label: activeRole === 'admin' ? 'Dashboard Admin' : activeRole === 'coordinator' ? 'Logística Oficina' : 'Ruta Técnica', 
      icon: Briefcase 
    },
    { 
      id: 'diagnose' as TabType, 
      label: 'Diagnóstico AI', 
      icon: Sparkles, 
      badge: true 
    },
    { 
      id: 'calculator' as TabType, 
      label: 'Cálculo BTU', 
      icon: Calculator 
    },
  ];

  return (
    <div className="min-h-screen w-full flex bg-[#FFF5CB]/10 font-sans antialiased text-slate-800 overflow-hidden">
      
      {/* ========================================================================= */}
      {/* DESKTOP SIDEBAR LAYOUT (md and up) - Styled with Pantone Deep Teal & Cream */}
      {/* ========================================================================= */}
      <aside className="hidden md:flex flex-col w-[280px] bg-[#3B6774] text-[#FFF5CB]/80 border-r border-[#3B6774]/20 shrink-0 h-screen select-none">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10 bg-black/10">
          <img
            src="https://appdesignproyectos.com/caloryfriologo.png"
            alt="Calor y Frío"
            className="h-10 w-auto object-contain drop-shadow-md"
            referrerPolicy="no-referrer"
          />
          <div>
            <h1 className="text-xs font-black text-white tracking-wider leading-none uppercase">Calor y Frío</h1>
            <span className="text-[9px] text-[#FFF5CB]/70 font-bold uppercase tracking-widest block mt-1">
              Climas & Climatización
            </span>
          </div>
        </div>

        {/* Role Selector Box */}
        <div className="p-4 border-b border-white/10 bg-black/15">
          <span className="text-[9px] font-bold text-[#FFF5CB]/60 uppercase tracking-wider block mb-2">
            Rol de Acceso Activo
          </span>
          <div className="relative">
            <select
              value={activeRole}
              onChange={(e) => onRoleChange(e.target.value as any)}
              className="w-full bg-[#2A4B55] text-white border border-white/10 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#96B4A8] cursor-pointer appearance-none"
            >
              <option value="admin">🔴 Administrador (Omar)</option>
              <option value="coordinator">🟡 Coordinación (Recepción)</option>
              <option value="technician">🟢 Técnico (Carlos)</option>
              <option value="portal">🏠 Portal de Inicio</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#FFF5CB]/60">
              <RefreshCw className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* PWA Install Sidebar Button */}
        {!isInstalled && (
          <div className="px-4 py-3 border-b border-white/10 bg-black/5">
            <button
              onClick={triggerInstall}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-[#DF4126] hover:bg-[#DF4126]/90 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-black/10 cursor-pointer group"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#FFF5CB] animate-bounce" />
              <span>Instalar Aplicación</span>
            </button>
          </div>
        )}

        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto">
          <span className="text-[10px] font-bold text-[#FFF5CB]/50 uppercase tracking-wider px-3 mb-2 block">
            Módulos de Trabajo
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
                    ? 'bg-[#FFF5CB] text-[#3B6774] shadow-md border-l-4 border-[#DF4126]'
                    : 'text-[#FFF5CB]/80 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#3B6774]' : 'text-[#FFF5CB]/70'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DF4126] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#DF4126]"></span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Exit / Logout Panel */}
        <div className="p-4 border-t border-white/10 bg-black/10 flex flex-col gap-2">
          <button
            onClick={() => onRoleChange('portal')}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 bg-[#DF4126]/10 hover:bg-[#DF4126] border border-[#DF4126]/20 hover:border-transparent text-[#FFF5CB] hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Salir al Portal</span>
          </button>
          <div className="flex items-center justify-center gap-1.5 text-[9px] text-[#FFF5CB]/40 font-bold uppercase tracking-wider mt-1">
            <span className="w-1.5 h-1.5 bg-[#96B4A8] rounded-full animate-pulse" />
            Empresa Activa
          </div>
        </div>

      </aside>

      {/* ========================================================================= */}
      {/* MAIN VIEWPORT LAYOUT                                                     */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0 relative">
        
        {/* DESKTOP HEADER (md and up) */}
        <header className="hidden md:flex h-[72px] bg-white border-b border-slate-200/80 px-8 items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] border rounded-md px-2.5 py-1 font-bold uppercase tracking-wide ${
              activeRole === 'admin' 
                ? 'bg-[#DF4126]/10 text-[#DF4126] border-[#DF4126]/20' 
                : activeRole === 'coordinator' 
                  ? 'bg-[#3B6774]/10 text-[#3B6774] border-[#3B6774]/20' 
                  : 'bg-[#96B4A8]/15 text-[#3B6774] border-[#96B4A8]/30'
            }`}>
              {getRoleLabel(activeRole)}
            </span>
            <h1 className="text-base font-bold text-slate-800 ml-1.5">{getTabLabel(activeTab)}</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {!isInstalled && (
              <button
                onClick={triggerInstall}
                className="flex items-center gap-1.5 bg-[#3B6774] hover:bg-[#3B6774]/90 text-[#FFF5CB] px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5 text-[#FFF5CB]" />
                <span>Instalar PWA</span>
              </button>
            )}
            
            <button
              onClick={() => onRoleChange('portal')}
              title="Salir al Portal"
              className="flex items-center gap-1 bg-slate-100 hover:bg-[#DF4126] text-slate-700 hover:text-white border border-slate-200 hover:border-transparent px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Salir</span>
            </button>

            <div className="flex items-center gap-1.5 bg-[#FFF5CB] text-[#3B6774] border border-[#FFF5CB]/80 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-[#DF4126] rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Calor y Frío</span>
            </div>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* MOBILE VIEWPORT HEADER (small screens only) - Styled in Deep Pantone Teal */}
        {/* ========================================================================= */}
        <header className="md:hidden bg-[#3B6774] border-b border-[#3B6774]/20 px-4 py-3 flex items-center justify-between z-10 select-none shrink-0 shadow-md">
          <div className="flex items-center gap-2">
            <img
              src="https://appdesignproyectos.com/caloryfriologo.png"
              alt="Calor y Frío"
              className="h-8 w-auto object-contain drop-shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="text-xs font-black tracking-wider text-white leading-none uppercase">Calor y Frío</h1>
              <span className="text-[9px] text-[#FFF5CB]/80 font-bold block mt-0.5 uppercase tracking-wider">
                {getRoleLabel(activeRole)}
              </span>
            </div>
          </div>

          {/* Controls: Switch role and Exit portal button */}
          <div className="flex items-center gap-2">
            <select
              value={activeRole}
              onChange={(e) => onRoleChange(e.target.value as any)}
              className="bg-[#2A4B55] text-white font-extrabold text-[10px] px-2.5 py-1.5 rounded-lg border border-white/10 focus:outline-none text-xs cursor-pointer"
            >
              <option value="admin">🔴 Admin</option>
              <option value="coordinator">🟡 Coordinador</option>
              <option value="technician">🟢 Técnico</option>
              <option value="portal">🏠 Portal</option>
            </select>

            <button
              onClick={() => onRoleChange('portal')}
              title="Cerrar sesión y salir"
              className="p-1.5 bg-[#DF4126] hover:bg-[#DF4126]/90 text-white rounded-lg shadow-sm cursor-pointer transition-all active:scale-95 flex items-center justify-center shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Screen Content Frame */}
        <main className="flex-1 overflow-hidden flex flex-col relative min-w-0">
          <div className="flex-1 overflow-hidden flex flex-col w-full max-w-7xl mx-auto md:p-6 pb-20 md:pb-6">
            <div className="flex-1 bg-white md:border md:border-slate-200/80 md:rounded-3xl md:shadow-lg overflow-hidden flex flex-col min-w-0">
              {children}
            </div>
          </div>
        </main>

        {/* ========================================================================= */}
        {/* MOBILE BOTTOM NAVIGATION BAR (Polished Floating dock in Pantone colors)  */}
        {/* ========================================================================= */}
        <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-[#3B6774] border border-white/10 py-2.5 px-4 rounded-2xl flex items-center justify-around select-none z-50 shadow-2xl shadow-black/25">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-xl transition-all duration-300 relative cursor-pointer ${
                  isActive 
                    ? 'text-[#3B6774] bg-[#FFF5CB] font-black scale-105 shadow-md shadow-black/10' 
                    : 'text-[#FFF5CB]/70 hover:text-white'
                }`}
              >
                <div className="relative">
                  <IconComponent className={`w-5 h-5 shrink-0 ${isActive ? 'stroke-[2.5px]' : ''}`} />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DF4126] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#DF4126]"></span>
                    </span>
                  )}
                </div>
                <span className="text-[9px] uppercase tracking-wider font-extrabold">{item.label}</span>
              </button>
            );
          })}
          
          {/* Quick Exit option integrated into Bottom Dock */}
          <button
            onClick={() => onRoleChange('portal')}
            className="flex flex-col items-center gap-1 py-1 px-3.5 rounded-xl text-[#FFF5CB]/70 hover:text-[#DF4126] transition-all duration-300 cursor-pointer"
          >
            <Home className="w-5 h-5 shrink-0" />
            <span className="text-[9px] uppercase tracking-wider font-extrabold">Salir</span>
          </button>
        </nav>

      </div>

    </div>
  );
}
